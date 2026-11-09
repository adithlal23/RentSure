
const { pool } = require("../config/db");

// Create security deposit — landlord only
const createDeposit = async (req, res) => {
  try {
    const { lease_id, initial_amount } = req.body;

    if (!lease_id || !initial_amount || Number(initial_amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Lease ID and a valid deposit amount are required"
      });
    }

    const [leases] = await pool.execute(
      `SELECT l.lease_id
       FROM leases l
       JOIN properties p ON l.property_id = p.property_id
       WHERE l.lease_id = ? AND p.landlord_id = ?`,
      [lease_id, req.user.userId]
    );

    if (!leases.length) {
      return res.status(403).json({
        success: false,
        message: "You do not own this lease"
      });
    }

    const [existing] = await pool.execute(
      "SELECT deposit_id FROM security_deposits WHERE lease_id = ?",
      [lease_id]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: "A security deposit already exists for this lease"
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO security_deposits
       (lease_id, initial_amount, deduction_amount, refund_amount, status)
       VALUES (?, ?, 0, 0, 'held')`,
      [lease_id, initial_amount]
    );

    return res.status(201).json({
      success: true,
      message: "Security deposit created successfully",
      deposit_id: result.insertId
    });

  } catch (error) {
    console.error("Create deposit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create security deposit"
    });
  }
};


// Get security deposits belonging to the logged-in user
const getDeposits = async (req, res) => {
  try {
    let query = `
      SELECT
        sd.*,
        l.tenant_id,
        l.monthly_rent,
        p.property_name,
        p.address,
        t.full_name AS tenant_name,
        landlord.full_name AS landlord_name
      FROM security_deposits sd
      JOIN leases l ON sd.lease_id = l.lease_id
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
      JOIN users landlord ON p.landlord_id = landlord.user_id
    `;

    if (req.user.role === "tenant") {
      query += " WHERE l.tenant_id = ?";
    } else {
      query += " WHERE p.landlord_id = ?";
    }

    query += " ORDER BY sd.created_at DESC";

    const [deposits] = await pool.execute(query, [req.user.userId]);

    return res.status(200).json({
      success: true,
      count: deposits.length,
      data: deposits
    });

  } catch (error) {
    console.error("Get deposits error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch security deposits"
    });
  }
};


// Settle security deposit — landlord only
const settleDeposit = async (req, res) => {
  try {
    const { deduction_amount = 0 } = req.body;

    const deduction = Number(deduction_amount);

    if (!Number.isFinite(deduction) || deduction < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid deduction amount"
      });
    }

    const [deposits] = await pool.execute(
      `SELECT sd.deposit_id, sd.initial_amount, sd.status
       FROM security_deposits sd
       JOIN leases l ON sd.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       WHERE sd.deposit_id = ? AND p.landlord_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (!deposits.length) {
      return res.status(404).json({
        success: false,
        message: "Security deposit not found"
      });
    }

    const deposit = deposits[0];

    if (deposit.status === "settled") {
      return res.status(409).json({
        success: false,
        message: "This deposit has already been settled"
      });
    }

    if (deduction > Number(deposit.initial_amount)) {
      return res.status(400).json({
        success: false,
        message: "Deduction cannot exceed the initial deposit"
      });
    }

    const refund = Number(deposit.initial_amount) - deduction;

    await pool.execute(
      `UPDATE security_deposits
       SET deduction_amount = ?,
           refund_amount = ?,
           status = 'settled'
       WHERE deposit_id = ?`,
      [deduction, refund, req.params.id]
    );

    return res.status(200).json({
      success: true,
      message: "Security deposit settled successfully",
      deduction_amount: deduction,
      refund_amount: refund
    });

  } catch (error) {
    console.error("Settle deposit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to settle security deposit"
    });
  }
};

module.exports = {
  createDeposit,
  getDeposits,
  settleDeposit
};
