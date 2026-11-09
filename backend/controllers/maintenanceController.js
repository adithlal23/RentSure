
const { pool } = require("../config/db");

// Create a maintenance request
const createMaintenance = async (req, res) => {
  try {
    const leaseId = req.body.lease_id || req.body.leaseId;
    const { title, description, priority = "medium" } = req.body;

    if (!leaseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Lease ID and title are required"
      });
    }

    if (!["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority"
      });
    }

    // Check that this lease belongs to the logged-in user
    let ownershipQuery;
    let ownershipParams;

    if (req.user.role === "tenant") {
      ownershipQuery = `
        SELECT lease_id
        FROM leases
        WHERE lease_id = ? AND tenant_id = ?
      `;
      ownershipParams = [leaseId, req.user.userId];
    } else {
      ownershipQuery = `
        SELECT l.lease_id
        FROM leases l
        JOIN properties p ON l.property_id = p.property_id
        WHERE l.lease_id = ? AND p.landlord_id = ?
      `;
      ownershipParams = [leaseId, req.user.userId];
    }

    const [leases] = await pool.execute(
      ownershipQuery,
      ownershipParams
    );

    if (leases.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this lease"
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO maintenance_requests
       (lease_id, reported_by, title, description, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [
        leaseId,
        req.user.userId,
        title,
        description || null,
        priority
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Maintenance request created successfully",
      request_id: result.insertId
    });

  } catch (error) {
    console.error("Create maintenance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create maintenance request"
    });
  }
};


// Get maintenance requests belonging to the logged-in user
const getMaintenance = async (req, res) => {
  try {
    let query = `
      SELECT
        m.*,
        l.tenant_id,
        t.full_name AS tenant_name,
        p.property_name,
        p.address,
        reporter.full_name AS reported_by_name
      FROM maintenance_requests m
      JOIN leases l ON m.lease_id = l.lease_id
      JOIN properties p ON l.property_id = p.property_id
      JOIN users t ON l.tenant_id = t.user_id
      JOIN users reporter ON m.reported_by = reporter.user_id
    `;

    if (req.user.role === "tenant") {
      query += ` WHERE l.tenant_id = ?`;
    } else {
      query += ` WHERE p.landlord_id = ?`;
    }

    query += ` ORDER BY m.created_at DESC`;

    const [requests] = await pool.execute(query, [
      req.user.userId
    ]);

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });

  } catch (error) {
    console.error("Get maintenance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch maintenance requests"
    });
  }
};


// Landlord updates maintenance request status
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid maintenance status"
      });
    }

    const [result] = await pool.execute(
      `UPDATE maintenance_requests m
       JOIN leases l ON m.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       SET m.status = ?
       WHERE m.request_id = ? AND p.landlord_id = ?`,
      [status, id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Maintenance status updated successfully"
    });

  } catch (error) {
    console.error("Update maintenance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update maintenance request"
    });
  }
};

module.exports = {
  createMaintenance,
  getMaintenance,
  updateMaintenance
};
