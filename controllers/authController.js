const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendVerificationEmail = async (user, req, res) => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
    user.verificationOtp = otp;
    user.verificationOtpExpires = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Crime Portal" <${process.env.EMAIL_USER}>`, // Add a display name
      to: user.email,
      subject: 'Verify Your Email - Crime Portal',
      html: `
        <p>Dear ${user.name},</p>
        <p>Thank you for signing up for Crime Portal. Your 4-digit verification code is:</p>
        <h2>${otp}</h2>
        <p>Please enter this code on the signup page to verify your email address. This code is valid for 1 hour.</p>
        <p>If you did not sign up for Crime Portal, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The Crime Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent. Please check your email.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Error sending verification email' });
  }
};


const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registration request received:', { name, email, password }); // Log the raw password

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email); // Log if the user already exists
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user (password will be hashed by the pre-save middleware)
    const user = new User({ name, email, password });
    await user.save();

    console.log('User registered successfully:', user); // Log the registered user
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Log any unexpected errors
    res.status(500).json({ error: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the entered password with the hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Error with Google Login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const googleSignup = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        password: '', // No password for Google accounts
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Error with Google Signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a new OTP
    user.verificationOtp = otp;
    user.verificationOtpExpires = Date.now() + 3600000; // OTP valid for 1 hour
    await user.save(); // Ensure this does not re-hash the password

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Crime Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP resent successfully!' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
  }
};

module.exports = { registerUser, loginUser, googleLogin, googleSignup, resendOtp };