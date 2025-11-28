const bcrypt = require("bcrypt");  // used to salt the password 10 rounds 
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const checkDBConnection = () => {
    if (mongoose.connection.readyState !== 1) {
        const states = { 0: 'DISCONNECTED', 1: 'CONNECTED', 2: 'CONNECTING', 3: 'DISCONNECTING' };
        console.error('MongoDB is not connected. Connection state:', states[mongoose.connection.readyState] || 'UNKNOWN');
        return {
            error: true,
            message: "Database is not available. MongoDB server is not running.",
            details: "Please start MongoDB server or check your MONGODB_URI in .env file. See MONGODB_SETUP.md for instructions."
        };
    }
    return { error: false };
};

const handleDBError = (dbError, res) => {
    console.error('Database query error:', dbError);
    if (dbError.name === 'MongoServerSelectionError' || dbError.name === 'MongoNetworkError') {
        return res.status(503).json({
            message: "Database connection error. Please check if MongoDB is running.",
            error: "Database unavailable"
        });
    }
    throw dbError;
};

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        const userRole = role || 'student'; // Default to student if no role provided

        if (!trimmedEmail || !trimmedName) {
            return res.status(400).json({
                message: "Name and email are required",
            });
        }
        const dbCheck = checkDBConnection();
        if (dbCheck.error) {
            return res.status(503).json({
                message: dbCheck.message,
                error: "MongoDB not connected",
                details: dbCheck.details
            });
        }
        let user;
        try {
            user = await userModel.findOne({ email: trimmedEmail }).maxTimeMS(5000);
        } catch (dbError) {
            return handleDBError(dbError, res);
        }
        if (user) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }
        const usermodel = new userModel({
            name: trimmedName,
            email: trimmedEmail,
            password: password,
            role: userRole
        });
        usermodel.password = await bcrypt.hash(password, 10);
        await usermodel.save();

        // Generate token for auto-login after signup
        const token = jwt.sign(
            { email: usermodel.email, _id: usermodel._id, role: usermodel.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            token,
            user: {
                name: usermodel.name,
                email: usermodel.email,
                _id: usermodel._id,
                role: usermodel.role
            }
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
            return res.status(503).json({
                message: "Database connection error. Please try again later.",
                success: false,
                error: "Database unavailable"
            });
        }
        if (err.code === 11000 || err.message && err.message.includes('duplicate')) {
            return res.status(400).json({
                message: "User with this email already exists",
                success: false
            });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', '),
                success: false
            });
        }
        return res.status(500).json({
            message: "An error occurred during registration. Please try again.",
            success: false,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({
                message: "Server configuration error. Please contact administrator.",
                success: false,
                error: "JWT_SECRET not configured"
            });
        }
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                message: "Invalid input format",
                success: false
            });
        }
        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }
        const dbCheck = checkDBConnection();
        if (dbCheck.error) {
            return res.status(503).json({
                message: dbCheck.message,
                success: false,
                error: "MongoDB not connected",
                details: dbCheck.details
            });
        }
        let user;
        try {
            user = await userModel.findOne(
                {
                    email: trimmedEmail
                }
            ).maxTimeMS(5000);
        } catch (dbError) {
            return handleDBError(dbError, res);
        }
        if (!user) {
            return res.status(403).json({
                message: "Invalid email or password",
                success: false
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid email or password",
                success: false
            });
        }
        let token;
        try {
            token = jwt.sign(
                { email: user.email, _id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        } catch (jwtError) {
            console.error('JWT signing error:', jwtError);
            return res.status(500).json({
                message: "Authentication failed. Please try again.",
                success: false,
                error: "Token generation failed"
            });
        }
        console.log(`User ${user.email} logged in successfully`);
        res.status(200).json({
            message: "Login Successful",
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email,
                _id: user._id,
                role: user.role || 'student'
            }
        });
    }
    catch (err) {
        console.error('Login error:', err);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        if (err.name === 'MongoNetworkError' ||
            err.name === 'MongoTimeoutError' ||
            err.name === 'MongoServerSelectionError' ||
            err.message && err.message.includes('MongoServerSelectionError')) {
            return res.status(503).json({
                message: "Database connection error. Please check if MongoDB is running.",
                success: false,
                error: "Database unavailable",
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid request data",
                success: false
            });
        }
        const isDevelopment = process.env.NODE_ENV !== 'production';
        return res.status(500).json({
            message: "An error occurred during login. Please try again.",
            success: false,
            error: isDevelopment ? err.message : undefined,
            errorName: isDevelopment ? err.name : undefined
        });
    }
}

module.exports = { signup, login };