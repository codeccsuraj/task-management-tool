import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 4,
        },

        user_group: {
            type: String,
            required: false,
        },

        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            default: null,
            index: true,
        },

        last_login: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before save
authSchema.pre("save", async function () {
    // Don't hash if password hasn't changed
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

/**
 * Compare plain password with hashed password
 */
authSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

authSchema.virtual("user", {
    ref: "UserDocument",
    localField: "_id",
    foreignField: "authId",
    justOne: true,
});
authSchema.set("toObject", { virtuals: true });
authSchema.set("toJSON", { virtuals: true });

const AuthModel = mongoose.model("Auth", authSchema);

export default AuthModel;