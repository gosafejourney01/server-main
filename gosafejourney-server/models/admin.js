import { Schema, model } from "mongoose";

const Admin = model("Admin", Schema({
    key: {
        type: String,
        required: true,
        default: "secretkey"
    },
    comission: {
        type: Number,
        required: true
    },
}))

export default Admin;