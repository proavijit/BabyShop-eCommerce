import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already exists, Try login")
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        address: [],
    })

    if (user) {
        res.status(201)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            avatar: user.avatar,
        });
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})


export { registerUser }