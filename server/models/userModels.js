import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    role: {
        type: String,
        enum: ["user", "admin", "proavijit"],
        default: "user"
    },
    // address
    address: [
        // street , city, county, postalCode,

        {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            county: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            }
        }

    ]

    // wishlist
    // cart
    // orders

}, {
    timestamps: true
})


const User = mongoose.model("user", userSchema);

export default User;
