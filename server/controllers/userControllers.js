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


// @desc    Add address
// @route   POST /api/users/:id/address
// @access  Private

const addAddress = asyncHandler(async (req, res) => {
    console.log(`addAddress called - Method: ${req.method}`);

    // Use req.params.id to find the target user (allows Admin to add for others)
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check permissions: Admin or Self
    // req.user is the logged-in user
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'proavijit');
    const isSelf = req.user && req.user._id.toString() === user._id.toString();

    if (!isAdmin && !isSelf) {
        res.status(403);
        throw new Error("Not authorized to add address for this user");
    }

    const { street, city, state, zip, country, isDefault } = req.body;

    // Validate required fields (based on User request params)
    if (!street || !city || !state || !zip || !country) {
        res.status(400);
        throw new Error("All fields are required");
    }

    // If this address is marked as default, clear all others
    if (isDefault === true) {
        user.address.forEach((address) => {
            address.default = false;
        });
    }

    // Check for duplicate address
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

    // If no address exists, automatically set as default
    const makeDefault = user.address.length === 0 ? true : isDefault || false;

    user.address.push({
        street,
        city,
        county: state, // Map state -> county
        postalCode: zip, // Map zip -> postalCode
        country,
        default: makeDefault,
    });

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address added successfully",
        addresses: user.address,
    });
});



// updateAddress
const updateAddress = asyncHandler(async (req, res) => {
    console.log(`updateAddress called - Method: ${req.method}`);

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // only allow user to modify their own address or admin
    if (req.user.id !== user.id && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to modify this address");
    }

    const { street, city, state, zip, country, isDefault } = req.body;

    if (!street || !city || !state || !zip || !country) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const addressIndex = user.address.findIndex((addr) =>
        addr.street === street &&
        addr.city === city &&
        addr.county === state &&
        addr.postalCode === zip &&
        addr.country === country
    );

    if (addressIndex !== -1) {
        user.address[addressIndex].default = isDefault;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.address,
        });
    }

    const addressId = req.params.addressId;
    const addressToUpdate = user.address.id(addressId);

    if (!addressToUpdate) {
        res.status(404);
        throw new Error("Address not found");
    }

    addressToUpdate.street = street || addressToUpdate.street;
    addressToUpdate.city = city || addressToUpdate.city;
    addressToUpdate.county = state || addressToUpdate.county; // Correct mapping
    addressToUpdate.postalCode = zip || addressToUpdate.postalCode; // Correct mapping
    addressToUpdate.country = country || addressToUpdate.country;
    if (isDefault !== undefined) addressToUpdate.default = isDefault;

    if (isDefault === true) {
        user.address.forEach((addr) => {
            if (addr._id.toString() !== addressId) {
                addr.default = false;
            }
        });
    }

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        addresses: user.address,
    });
});

// deleteAddress
const deleteAddress = asyncHandler(async (req, res) => {
    console.log(`deleteAddress called - Method: ${req.method}`);

    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // only allow user to modify their own address or admin
    if (req.user.id !== user.id && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to modify this address");
    }

    const addressId = req.params.addressId;
    const addressIndex = user.address.findIndex((address) => address._id.toString() === addressId);
    if (addressIndex === -1) {
        res.status(404);
        throw new Error("Address not found");
    }

    user.address.splice(addressIndex, 1);
    await user.save();

    return res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        addresses: user.address,  // optional: useful for frontend
    });
});



export { getAllUsers, createUser, getUserById, updateUser, deleteUser, addAddress, updateAddress, deleteAddress };
