import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {


    const users = await User.find({}).select("-password");

    return res.status(200).json({
        success: true,
        users,
    });
});


// @desc    Create new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {

    const { name, email, password, role, address } = req.body || {};

    // Validate body
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email and password are required");
    }

    // Check duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || "user",
        address: address || [],
    });

    if (user) {
        return res.status(201).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                avatar: user.avatar,
            },
        });
    }

    res.status(400);
    throw new Error("Invalid user data");
});


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    return res.status(200).json({
        success: true,
        user,
    });
});


// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or Self
// updateUser
const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        console.log(`[DEBUG] User not found with ID: ${req.params.id}`);
        res.status(404);
        throw new Error("User not found");
    }

    // Check permissions: Admin or Self
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'proavijit');
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        console.log(`[DEBUG] Authorization Failed. IsAdmin: ${isAdmin}, IsSelf: ${isSelf}`);
        res.status(403);
        throw new Error("Not authorized to update this user");
    }

    // Update fields
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    // Only admin can update role
    if (req.body.role && isAdmin) {
        user.role = req.body.role;
    }

    console.log(`[DEBUG] User state before save:`, user);

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            address: updatedUser.address,
            avatar: updatedUser.avatar,
        }
    });
});


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    console.log(`deleteUser called - Method: ${req.method}`);

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();

    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
