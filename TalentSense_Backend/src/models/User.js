import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    passwordHash:{
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
   },
    { timestamps: true }
);

export default mongoose.model("User", userShema);