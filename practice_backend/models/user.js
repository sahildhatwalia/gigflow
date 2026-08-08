import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },

    address: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
    isVerified: {
    type: Boolean,
    default: false,
},

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    role: {
      type: String,
      enum: ["Client", "Freelancer"],
      default: "Freelancer",
      required: true,
    },

emailOtp: {
    type: String,
    default: "",
},

emailOtpExpiry: {
    type: Date,
},

twoFactorEnabled: {
    type: Boolean,
    default: false,
},

resetPasswordCode: {
    type: String,
    default: "",
},

resetPasswordExpiry: {
    type: Date,
},
  },
  {
    timestamps: true,
  }

);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;