
const { pool } = require("../config/db");

// Create a lease — landlord only
const createLease = async (req, res) => {
  try {
    const {
      property_id,
      tenant_id,
      start_date,
      end_date,
      monthly_rent
    } = req.body;

    if (!property_id || !tenant_id || !start_date || !end_date || !monthly_rent) {
      return res.status(400).json({
        success: false,
        message: "All lease fields are required"
      });
    }

    if (new Date(end_date) <= new Date(start_date) || Number(monthly_rent) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid lease dates and rent"
      });
    }

    const [properties] = await pool.execute(
      "SELECT property_id FROM properties WHERE property_id = ? AND landlord_id = ?",
      [property_id, req.user.userId]
    );

    if (!properties.length) {
      return res.status(403).json({
        success: false,
        message: "You do not own this property"
      });
    }

    const [tenants] = await pool.execute(
      "SELECT user_id FROM users WHERE user_id = ? AND role = 'tenant'",
      [tenant_id]
    );

    if (!tenants.length) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const [overlap] = await pool.execute(
      `SELECT lease_id FROM leases
       WHERE tenant_id = ?
       AND property_id = ?
       AND status = 'active'
       AND start_date <= ?
       AND end_date >= ?`,
      [tenant_id, property_id, end_date, start_date]
    );

    if (overlap.length) {
      return res.status(409).json({
        success: false,
        message: "An overlapping active lease already exists"
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO leases
       (property_id, tenant_id, start_date, end_date, monthly_rent)
       VALUES (?, ?, ?, ?, ?)`,
      [property_id, tenant_id, start_date, end_date, monthly_rent]
    );

    return res.status(201).json({
      success: true,
      message: "Lease created successfully",
      lease_id: result.insertId
    });

  } catch (error) {
    console.error("Create lease error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lease"
    });
  }
};


// Get leases belonging to the logged-in user
const getLeases = async (req, res) => {
  try {
    let query = `
      SELECT
        l.*,
        p.property_name,
        p.address,
        p.city,
        p.property_type,
        t.full_name AS tenant_name,
        t.email AS tenant_email,
        landlord.full_name AS landlord_name,
        landlord.email AS landlord_email
      FROM leases l
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
      JOIN users landlord ON p.landlord_id = landlord.user_id
    `;

    if (req.user.role === "tenant") {
      query += " WHERE l.tenant_id = ?";
    } else {
      query += " WHERE p.landlord_id = ?";
    }

    query += " ORDER BY l.created_at DESC";

    const [leases] = await pool.execute(query, [req.user.userId]);

    return res.status(200).json({
      success: true,
      count: leases.length,
      data: leases
    });

  } catch (error) {
    console.error("Get leases error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leases"
    });
  }
};


// Get one lease — only its tenant or landlord
const getLeaseById = async (req, res) => {
  try {
    let query = `
      SELECT
        l.*,
        p.property_name,
        p.address,
        p.city,
        t.full_name AS tenant_name,
        t.email AS tenant_email,
        landlord.full_name AS landlord_name,
        landlord.email AS landlord_email
      FROM leases l
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
      JOIN users landlord ON p.landlord_id = landlord.user_id
      WHERE l.lease_id = ?
    `;

    const params = [req.params.id];

    if (req.user.role === "tenant") {
      query += " AND l.tenant_id = ?";
    } else {
      query += " AND p.landlord_id = ?";
    }

    params.push(req.user.userId);

    const [leases] = await pool.execute(query, params);

    if (!leases.length) {
      return res.status(404).json({
        success: false,
        message: "Lease not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: leases[0]
    });

  } catch (error) {
    console.error("Get lease error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lease"
    });
  }
};


// Update a lease — landlord only
const updateLease = async (req, res) => {
  try {
    const { property_id, tenant_id, start_date, end_date, monthly_rent, status } = req.body;

    const [existing] = await pool.execute(
      `SELECT l.*
       FROM leases l
       JOIN properties p ON l.property_id = p.property_id
       WHERE l.lease_id = ? AND p.landlord_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Lease not found"
      });
    }

    const current = existing[0];

    const nextPropertyId = property_id ?? current.property_id;
    const nextTenantId = tenant_id ?? current.tenant_id;
    const nextStartDate = start_date ?? current.start_date;
    const nextEndDate = end_date ?? current.end_date;
    const nextRent = monthly_rent ?? current.monthly_rent;
    const nextStatus = status ?? current.status;

    if (!["active", "completed", "terminated"].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lease status"
      });
    }

    if (new Date(nextEndDate) <= new Date(nextStartDate) || Number(nextRent) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lease dates or rent"
      });
    }

    const [properties] = await pool.execute(
      "SELECT property_id FROM properties WHERE property_id = ? AND landlord_id = ?",
      [nextPropertyId, req.user.userId]
    );

    if (!properties.length) {
      return res.status(403).json({
        success: false,
        message: "You do not own this property"
      });
    }

    const [tenants] = await pool.execute(
      "SELECT user_id FROM users WHERE user_id = ? AND role = 'tenant'",
      [nextTenantId]
    );

    if (!tenants.length) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const [overlap] = await pool.execute(
      `SELECT lease_id FROM leases
       WHERE tenant_id = ?
       AND property_id = ?
       AND lease_id != ?
       AND status = 'active'
       AND start_date <= ?
       AND end_date >= ?`,
      [nextTenantId, nextPropertyId, req.params.id, nextEndDate, nextStartDate]
    );

    if (nextStatus === "active" && overlap.length) {
      return res.status(409).json({
        success: false,
        message: "An overlapping active lease already exists"
      });
    }

    await pool.execute(
      `UPDATE leases
       SET property_id = ?, tenant_id = ?, start_date = ?,
           end_date = ?, monthly_rent = ?, status = ?
       WHERE lease_id = ?`,
      [
        nextPropertyId,
        nextTenantId,
        nextStartDate,
        nextEndDate,
        nextRent,
        nextStatus,
        req.params.id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Lease updated successfully"
    });

  } catch (error) {
    console.error("Update lease error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lease"
    });
  }
};

module.exports = {
  createLease,
  getLeases,
  getLeaseById,
  updateLease
};
