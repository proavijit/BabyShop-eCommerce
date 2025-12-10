import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

//
// REGISTER USER
//
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists, please log in.");
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password, // hashed in model
        role,
        address: [],
    });

    if (!user) {
        res.status(400);
        throw new Error("Invalid user data");
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        avatar: user.avatar,
        token: generateToken(user._id),
    });
});


//
// LOGIN USER
//
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(400);
        throw new Error("Invalid email or password");
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address || [],
        avatar: user.avatar,
        token: generateToken(user._id),
    });
});


//
// GET USER PROFILE
//
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address || [],
        avatar: user.avatar,
    });
});

//
// LOGOUT USER
//
const logoutUser = asyncHandler(async (req, res) => {
    res.json({ message: "Logout successful" });
});

export { registerUser, loginUser, getUserProfile, logoutUser };
