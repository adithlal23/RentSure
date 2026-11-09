
const { pool } = require("../config/db");

// ADD PROPERTY
const createProperty = async (req, res) => {
  try {
    const {
      property_name,
      address,
      city,
      property_type,
      total_units
    } = req.body;

    if (!property_name || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Property name, address and city are required."
      });
    }

    const units = Number(total_units ?? 1);

    if (!Number.isInteger(units) || units < 1) {
      return res.status(400).json({
        success: false,
        message: "Total units must be a positive integer."
      });
    }

    const [result] = await pool.query(
      `INSERT INTO properties
      (landlord_id, property_name, address, city, property_type, total_units)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        property_name.trim(),
        address.trim(),
        city.trim(),
        property_type || null,
        units
      ]
    );

    res.status(201).json({
      success: true,
      message: "Property added successfully!",
      property_id: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not create property."
    });
  }
};


// GET ALL OWN PROPERTIES
const getProperties = async (req, res) => {
  try {
    const [properties] = await pool.query(
      "SELECT * FROM properties WHERE landlord_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not retrieve properties."
    });
  }
};


// GET ONE PROPERTY
const getPropertyById = async (req, res) => {
  try {
    const [properties] = await pool.query(
      `SELECT * FROM properties
       WHERE property_id = ? AND landlord_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found."
      });
    }

    res.status(200).json({
      success: true,
      data: properties[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not retrieve property."
    });
  }
};


// UPDATE PROPERTY
const updateProperty = async (req, res) => {
  try {
    const {
      property_name,
      address,
      city,
      property_type,
      total_units
    } = req.body;

    const units = total_units === undefined ? undefined : Number(total_units);

    if (units !== undefined &&
        (!Number.isInteger(units) || units < 1)) {
      return res.status(400).json({
        success: false,
        message: "Total units must be a positive integer."
      });
    }

    const [result] = await pool.query(
      `UPDATE properties
       SET property_name = COALESCE(?, property_name),
           address = COALESCE(?, address),
           city = COALESCE(?, city),
           property_type = COALESCE(?, property_type),
           total_units = COALESCE(?, total_units)
       WHERE property_id = ? AND landlord_id = ?`,
      [
        property_name?.trim() || null,
        address?.trim() || null,
        city?.trim() || null,
        property_type ?? null,
        units ?? null,
        req.params.id,
        req.user.userId
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found or no changes made."
      });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not update property."
    });
  }
};


// DELETE PROPERTY
const deleteProperty = async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM properties
       WHERE property_id = ? AND landlord_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully."
    });

  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message: "This property has rental records and cannot be deleted."
      });
    }

    res.status(500).json({
      success: false,
      message: "Could not delete property."
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};
