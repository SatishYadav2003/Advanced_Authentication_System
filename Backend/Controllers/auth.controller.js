import dotenv from 'dotenv'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url';
import Users from "../Models/user.model.js";
import bcryptjs from 'bcryptjs';
import { generateVerificationToken } from '../Utils/generateVerificationToken.js'
import { generateJsonWebTokenAndSetCookie } from "../Utils/generateJsonWebTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../Mailtrap/emailSender.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });



export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {

        if (!email || !password || !name) {
            throw new Error("All fields are requireds");
        }

        const user = await Users.findOne({ email: email });

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const newUser = new Users({
            email: email,
            password: hashedPassword,
            name: name,
            verificationToken: verificationToken,
            verificationTokenExpriresAt: Date.now() + 24 * 60 * 60 * 1000,
        })

        await newUser.save();

        generateJsonWebTokenAndSetCookie(res, newUser._id);

        await sendVerificationEmail(newUser.email, verificationToken)


        res.status(201).json({
            success: true,
            userDetails: {
                ...newUser._doc,
                password: undefined

            }
        });




    } catch (error) {

        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { verificationCodeProvidedByUser } = req.body;

    try {

        const user = await Users.findOne({
            verificationToken: verificationCodeProvidedByUser,
            verificationTokenExpriresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Exprired Verification Code" })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpriresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true, message: "Greeting Email Sent Succussefully",
            userDetails: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {

    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const isUserPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isUserPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        generateJsonWebTokenAndSetCookie(res, user._id);

        user.lastLogin = Date.now();
        await user.save();


        res.status(200).json({
            success: true, message: "Logged in Successfully",
            userDetails:
                { ...user._doc, password: undefined }
        });

    } catch (error) {
        console.log("Some error occurred in login: ", error);
        res.status(200).json({ success: false, message: `Some error occurred in login : ${error.message}` });
    }
}


export const forgotPassword = async (req, res) => {

    const { email } = req.body;


    try {
        const user = await Users.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Email does not exist" });
        }



        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;


        await user.save();



        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URI}/reset-password/${resetPasswordToken}`);

        res.status(200).json({ success: true, message: "Forgot password Email sent successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Some error occurred in Senting reset Email" })
    }
}


export const resetPassword = async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await Users.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successfully" })

    } catch (error) {

        res.status(400).json({ success: false, message: "Password reset failed" })
    }

}


export const logout = async (req, res) => {
    res.clearCookie("authentication_token");
    res.status(200).json({ success: true, message: "User logged out successfully" });
}


export const checkAuth = async (req, res) => {
    try {
        const user = await Users.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true, userDetails: {
                ...user._doc
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


