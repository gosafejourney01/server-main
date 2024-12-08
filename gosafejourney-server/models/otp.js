import { Schema, model } from "mongoose";

const Otp = model("Otp", Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    }
}, { timestamps: true }))

export default Otp;