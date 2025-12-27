import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Address sub-schema (now includes "default")
const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    default: { type: Boolean, default: false }, // FIXED
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        role: {
            type: String,
            enum: ["user", "admin", "proavijit"],
            default: "user",
        },
        status: {
            type: String,
            enum: ["active", "suspended"],
            default: "active",
        },
        address: [addressSchema], // FIXED
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Password Hashing

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//   Ensure Only One Default Address

userSchema.pre("save", function (next) {
    if (this.isModified("address")) {
        let foundDefault = false;

        this.address = this.address.map((addr) => {
            if (addr.default) {
                if (!foundDefault) {
                    foundDefault = true;
                } else {
                    addr.default = false;
                }
            }
            return addr;
        });
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
