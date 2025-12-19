import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

/**
 * @desc    Get all users (excluding passwords)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    return res.status(200).json({ success: true, users });
});

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, address, avatar } = req.body || {};

    // Validate required fields
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Name, email, and password are required");
    }

    // Check if user already exists
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
        avatar,
    });

    if (!user) {
        res.status(400);
        throw new Error("Invalid user data");
    }

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
});

/**
 * @desc    Get a user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    return res.status(200).json({ success: true, user });
});

/**
 * @desc    Update user details
 * @route   PUT /api/users/:id
 * @access  Private/Admin or Self
 */
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "proavijit");
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        res.status(403);
        throw new Error("Not authorized to update this user");
    }

    // Update allowed fields
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.password && req.body.password.trim() !== '') user.password = req.body.password;
    if (req.body.status !== undefined) user.status = req.body.status;

    // Only admin can update role
    if (req.body.role && isAdmin) user.role = req.body.role;

    const updatedUser = await user.save();

    return res.status(200).json({
        success: true,
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            address: updatedUser.address,
            avatar: updatedUser.avatar,
        },
    });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    await user.deleteOne();

    return res.status(200).json({ success: true, message: "User deleted successfully" });
});

/**
 * @desc    Add address for a user
 * @route   POST /api/users/:id/address
 * @access  Private (Admin or Self)
 */
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "proavijit");
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        res.status(403);
        throw new Error("Not authorized to add address for this user");
    }

    const { street, city, state, zip, country, isDefault } = req.body;

    if (!street || !city || !state || !zip || !country) {
        res.status(400);
        throw new Error("All address fields are required");
    }

    // Prevent duplicate address
    const duplicateAddress = user.address.find((addr) =>
        addr.street === street &&
        addr.city === city &&
        addr.county === state &&
        addr.postalCode === zip &&
        addr.country === country
    );

    if (duplicateAddress) {
        res.status(400);
        throw new Error("Address already exists");
    }

    // If first address or marked default, clear other defaults
    if (isDefault === true || user.address.length === 0) {
        user.address.forEach(addr => (addr.default = false));
    }

    user.address.push({
        street,
        city,
        county: state,
        postalCode: zip,
        country,
        default: isDefault === true || user.address.length === 0,
    });

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address added successfully",
        addresses: user.address,
    });
});

/**
 * @desc    Update an address
 * @route   PUT /api/users/:id/address/:addressId
 * @access  Private (Admin or Self)
 */
const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "proavijit");
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        res.status(403);
        throw new Error("Not authorized to modify this address");
    }

    const { street, city, state, zip, country, isDefault } = req.body;
    if (!street || !city || !state || !zip || !country) {
        res.status(400);
        throw new Error("All address fields are required");
    }

    const addressId = req.params.addressId;
    const addressToUpdate = user.address.id(addressId);

    if (!addressToUpdate) {
        res.status(404);
        throw new Error("Address not found");
    }

    // Update address fields
    addressToUpdate.street = street || addressToUpdate.street;
    addressToUpdate.city = city || addressToUpdate.city;
    addressToUpdate.county = state || addressToUpdate.county;
    addressToUpdate.postalCode = zip || addressToUpdate.postalCode;
    addressToUpdate.country = country || addressToUpdate.country;
    if (isDefault !== undefined) addressToUpdate.default = isDefault;

    // Ensure only one default address
    if (isDefault === true) {
        user.address.forEach(addr => {
            if (addr._id.toString() !== addressId) addr.default = false;
        });
    }

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        addresses: user.address,
    });
});

/**
 * @desc    Delete an address
 * @route   DELETE /api/users/:id/address/:addressId
 * @access  Private (Admin or Self)
 */
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isAdmin = req.user && (req.user.role === "admin" || req.user.role === "proavijit");
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        res.status(403);
        throw new Error("Not authorized to modify this address");
    }

    const addressId = req.params.addressId;
    const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);

    if (addressIndex === -1) {
        res.status(404);
        throw new Error("Address not found");
    }

    user.address.splice(addressIndex, 1);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        addresses: user.address,
    });
});

export {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
};
