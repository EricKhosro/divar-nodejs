const { Schema, model } = require("mongoose");

const OTPSchema = new Schema({
  code: { type: String, required: false },
  expiresIn: { type: Number },
});

const UserSchema = new Schema(
  {
    fullName: { type: String, required: false, default: undefined },
    mobile: { type: String, required: true, unique: true },
    otp: OTPSchema,
    verifiedMobile: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const UserModel = model("user", UserSchema);

module.exports = UserModel;
