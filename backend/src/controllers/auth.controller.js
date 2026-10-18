const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET || "secret",
    );

    res.cookie("token", token);
    res.status(201).json({
      message: "user registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const identifier = username || email;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Username/Email and password are required" });
    }

    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET || "secret",
    );
    res.cookie("token", token);

    res.status(200).json({
      message: "user logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "user logged out successufully",
  });
}

module.exports = { registerUser, loginUser, logoutUser };
