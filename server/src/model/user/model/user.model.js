import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema({
    authId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true, unique: true, index: true, },
    full_name: { type: String, trim: true },
    phone: { type: String, trim: true },
    profile_picture: { type: String },
    date_of_birth: { type: Date, default: null, },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "", },
    address: { type: String, trim: true, default: "", },
    bio: { type: String, trim: true },
    role: { type: String, trim: true, },
});

const UserModel = mongoose.model("UserDocument", userDocumentSchema);

export default UserModel;