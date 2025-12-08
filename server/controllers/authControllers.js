import asyncHandler from "express-async-handler";

export const registerUser = asyncHandler(async (req, res) => {
    console.log("Register is working", req.body)
    res.status(200).json({ message: "Register is working" })
})


