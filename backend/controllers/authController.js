
const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields."
      });
    }

    // Only tenant and landlord registration allowed
    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether email already exists
    const [existingUsers] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered."
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user in MySQL
    const [result] = await pool.query(
      `INSERT INTO users
      (full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?)`,
      [full_name.trim(), normalizedEmail, passwordHash, role]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        user_id: result.insertId,
        full_name: full_name.trim(),
        email: normalizedEmail,
        role
      }
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during registration."
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user in MySQL
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR DETAILS:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
