const { pool } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const landlordId = req.user.userId;

    // PROPERTY COUNT
    const [[propertyStats]] = await pool.query(
      `SELECT COUNT(*) AS total_properties
       FROM properties
       WHERE landlord_id = ?`,
      [landlordId]
    );

    // TENANT AND ACTIVE LEASE COUNT
    const [[leaseStats]] = await pool.query(
      `SELECT
         COUNT(DISTINCT CASE
           WHEN l.status = 'active' THEN l.tenant_id
         END) AS total_tenants,
         SUM(CASE WHEN l.status = 'active' THEN 1 ELSE 0 END) AS active_leases
       FROM leases l
       JOIN properties p ON l.property_id = p.property_id
       WHERE p.landlord_id = ?`,
      [landlordId]
    );

    // RENT COLLECTION THIS MONTH
    const [[paymentStats]] = await pool.query(
      `SELECT
         COALESCE(SUM(CASE
           WHEN rp.payment_status = 'paid'
           AND rp.payment_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
           AND rp.payment_date < DATE_ADD(
             DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH
           )
           THEN rp.amount ELSE 0 END), 0) AS rent_collected,

         COALESCE(SUM(CASE
           WHEN rp.payment_status = 'pending'
           THEN rp.amount ELSE 0 END), 0) AS pending_amount,

         COALESCE(SUM(CASE
           WHEN rp.payment_status = 'pending'
           AND rp.due_date < CURDATE()
           THEN rp.amount ELSE 0 END), 0) AS overdue_amount
       FROM rent_payments rp
       JOIN leases l ON rp.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       WHERE p.landlord_id = ?`,
      [landlordId]
    );

    // SECURITY DEPOSITS HELD
    const [[depositStats]] = await pool.query(
      `SELECT COALESCE(SUM(d.initial_amount - d.deduction_amount), 0)
       AS total_deposits_held
       FROM security_deposits d
       JOIN leases l ON d.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       WHERE p.landlord_id = ? AND d.status != 'settled'`,
      [landlordId]
    );

    // OPEN MAINTENANCE REQUESTS
    const [[maintenanceStats]] = await pool.query(
      `SELECT COUNT(*) AS open_requests
       FROM maintenance_requests m
       JOIN leases l ON m.lease_id = l.lease_id
       JOIN properties p ON l.property_id = p.property_id
       WHERE p.landlord_id = ?
       AND m.status != 'resolved'`,
      [landlordId]
    );

    res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully.",
      data: {
        total_properties: Number(propertyStats.total_properties),
        total_tenants: Number(leaseStats.total_tenants),
        active_leases: Number(leaseStats.active_leases || 0),
        rent_collected_this_month: Number(paymentStats.rent_collected),
        pending_amount: Number(paymentStats.pending_amount),
        overdue_amount: Number(paymentStats.overdue_amount),
        total_deposits_held: Number(depositStats.total_deposits_held),
        open_maintenance_requests: Number(maintenanceStats.open_requests)
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({
      success: false,
      message: "Could not retrieve dashboard statistics."
    });
  }
};

module.exports = { getDashboardStats };