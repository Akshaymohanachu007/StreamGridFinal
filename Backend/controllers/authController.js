import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendOTP } from "../services/emailService.js";

export const registerUser = async (req, res) => {


    try {

        const {
            username,
            email,
            password

        } = req.body;



        const exists =
            await User.findOne({ email });


        if (exists) {

            return res.status(400).json({

                message: "User exists"

            });

        }



        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();



        const salt =
            await bcrypt.genSalt(10);


        const passwordHash =
            await bcrypt.hash(
                password,
                salt
            );



        await User.create({

            username,

            email,

            passwordHash,

            otp,

            otpExpires:
                Date.now() + 10 * 60 * 1000

        });



        await sendOTP(email, otp);



        res.json({

            success: true,

            message: "OTP sent to email"

        });


    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password",
            });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        if (
            user.otp !== otp ||
            user.otpExpires < Date.now()
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });

        }


        user.isVerified = true;

        user.otp = undefined;

        user.otpExpires = undefined;


        await user.save();


        res.json({

            success: true,

            token: generateToken(user._id),

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }

        });


    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};