import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

const getAllUsers = asyncHandler(async (req, res) => {
    console.log(`getAllUsers called - Method: ${req.method}`);
    const users = await User.find({}).select("-password");
    res.status(200).json({
        success: true,
        users
    });
})


// createUser
const createUser = asyncHandler(async (req, res) => {
    console.log(`createUser called - Method: ${req.method}`);
    const { name, email, password, role, address } = req.body || {};

    // Check for missing body
    if (!req.body) {
        console.log("Error: req.body is undefined");
        res.status(400);
        throw new Error("Request body is missing");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,
        role,
        address: address || [],
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            avatar: user.avatar,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});


export { getAllUsers, createUser }