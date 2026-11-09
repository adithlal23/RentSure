
const { pool } = require("../config/db");

// Create payment record — landlord only
const createPayment = async (req, res) => {
  try {
    const {
      lease_id,
      amount,
      payment_date,
      due_date,
      payment_status = "pending",
      payment_method
    } = req.body;

    if (!lease_id || !amount || !due_date || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Lease ID, valid amount and due date are required"
      });
    }

    if (!["pending", "paid", "overdue"].includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
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

    const [result] = await pool.execute(
      `INSERT INTO rent_payments
       (lease_id, amount, payment_date, due_date, payment_status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        lease_id,
        amount,
        payment_date || null,
        due_date,
        payment_status,
        payment_method || null
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Payment record created successfully",
      payment_id: result.insertId
    });

  } catch (error) {
    console.error("Create payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment record"
    });
  }
};


// Get payment records for the logged-in user
const getPayments = async (req, res) => {
  try {
    let query = `
      SELECT
        rp.*,
        l.tenant_id,
        l.monthly_rent,
        p.property_name,
        t.full_name AS tenant_name
      FROM rent_payments rp
      JOIN leases l ON rp.lease_id = l.lease_id
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
    `;

    if (req.user.role === "tenant") {
      query += " WHERE l.tenant_id = ?";
    } else {
      query += " WHERE p.landlord_id = ?";
    }

    query += " ORDER BY rp.due_date DESC";

    const [payments] = await pool.execute(query, [req.user.userId]);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });

  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments"
    });
  }
};


// Get overdue payments for the logged-in user
const getOverduePayments = async (req, res) => {
  try {
    let query = `
      SELECT
        rp.*,
        l.tenant_id,
        p.property_name,
        t.full_name AS tenant_name
      FROM rent_payments rp
      JOIN leases l ON rp.lease_id = l.lease_id
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
      WHERE rp.payment_status = 'overdue'
         OR (rp.payment_status = 'pending' AND rp.due_date < CURDATE())
    `;

    if (req.user.role === "tenant") {
      query += " AND l.tenant_id = ?";
    } else {
      query += " AND p.landlord_id = ?";
    }

    query += " ORDER BY rp.due_date ASC";

    const [payments] = await pool.execute(query, [req.user.userId]);

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });

  } catch (error) {
    console.error("Get overdue payments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch overdue payments"
    });
  }
};


// Update payment status — landlord only
const updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status, payment_method, payment_date } = req.body;

    if (!["pending", "paid", "overdue"].includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    const [result] = await pool.execute(
      `UPDATE rent_payments rp
       JOIN leases l ON rp.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       SET rp.payment_status = ?,
           rp.payment_method = COALESCE(?, rp.payment_method),
           rp.payment_date = CASE
             WHEN ? = 'paid' THEN COALESCE(?, CURDATE())
             ELSE rp.payment_date
           END
       WHERE rp.payment_id = ? AND p.landlord_id = ?`,
      [
        payment_status,
        payment_method || null,
        payment_status,
        payment_date || null,
        req.params.id,
        req.user.userId
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully"
    });

  } catch (error) {
    console.error("Update payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status"
    });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getOverduePayments,
  updatePaymentStatus
};
