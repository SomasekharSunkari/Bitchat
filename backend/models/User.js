import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }
}, {
    timestamps: true
})

UserModel.methods.matchpassword = async function (passwordEnterd) {
    return await bcrypt.compare(passwordEnterd, this.password);
}
UserModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = new mongoose.model("User", UserModel);

export default User;