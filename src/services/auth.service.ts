import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.model";
import Otp from "../models/otp.model";
import sendEmail from "../utils/sendEmail";
import createToken from "../utils/createToken";
import { BadRequest, NotFound } from "../errors/httpErrors";

class AuthService {
    async register({ username, email, password }: { username: string; email: string; password: string }) {
        const userExists = await User.findOne({ email });
        if (userExists) throw BadRequest("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, isVerified: false });

        const code = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.create({ email, code, expiresAt });
        await sendEmail(email, `Hello user, your verification code is: ${code}`);

        return user;
    }

    async createUser({ username, email, password }: { username: string; email: string; password: string }) {
        const userExists = await User.findOne({ email });
        if (userExists) throw BadRequest("User already exists");

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        return user;
    }

    async login({ email, password }: { email: string; password: string }) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        throw BadRequest("Invalid email or password");
        }

        return user;
    }

    async requestOtp(email: string) {
        const user = await User.findOne({ email });
        if (!user) throw NotFound("User not found.");
        if (user.isVerified) throw BadRequest("User already verified.");

        const code = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.deleteMany({ email });
        await Otp.create({ email, code, expiresAt });
        await sendEmail(email, `Your verification code is: ${code}`);
    }

    // async verifyOtp(email: string, code: string) {
    //     const otpRecord = await Otp.findOne({ email, code });

    //     if (!otpRecord || otpRecord.expiresAt < new Date()) {
    //         if (otpRecord) await otpRecord.deleteOne();
    //         throw BadRequest("Invalid or expired OTP.");
    //     }

    //     const user = await User.findOne({ email });
    //     if (!user) throw NotFound("User not found.");

    //     user.isVerified = true;
    //     await user.save();
    //     await otpRecord.deleteOne();
    // }
    async verifyOtp(email: string, code: string) {
        const otpRecord = await Otp.findOne({ email, code });
    
        if (!otpRecord) {
            throw BadRequest("Invalid or expired OTP.");
        }
    
        const isExpired = otpRecord.expiresAt.getTime() < Date.now();
        if (isExpired) {
            await otpRecord.deleteOne();
            throw BadRequest("OTP has expired.");
        }
    
        const user = await User.findOne({ email });
        if (!user) throw NotFound("User not found.");
    
        user.isVerified = true;
        await user.save();
        await otpRecord.deleteOne();
    }    
}

export default new AuthService();