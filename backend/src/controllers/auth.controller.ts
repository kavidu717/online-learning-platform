import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../models/User.js";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";


export const register = async (req: Request, res: Response) => {
    try {

        const validationResult = registerSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.issues,
            });
        }

        const { firstName, lastName, email, password, invitationCode } = validationResult.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        let role: UserRole = "student";

        if (invitationCode) {
            if (
                invitationCode !==
                process.env.INSTRUCTOR_INVITATION_CODE
            ) {
                return res.status(403).json({
                    message: "Invalid instructor invitation code",
                });
            }

            role = "instructor";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,

                email: user.email,
                role: user.role
            }

        })

    } catch (error) {
        console.error("Error in register controller:", error);
        res.status(500).
            json(
                { message: "Internal server error" }
            );
    }

}

export const login = async (req: Request, res: Response) => {
    try {

        const validationResult = loginSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.issues,
            });
        }

        const { email, password } = validationResult.data;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password or email",
            });

        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            return res.status(500).json({
                message: "JWT secret is not defined",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role,
            },
            jwtSecret,
            {
                expiresIn: "1d",
            }
        );

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });


    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).
            json(
                { message: "Internal server error" }
            );
    }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const user = await User.findById(req.user.userId).select(
            "-password"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user,
        });




    } catch (error) {
        console.error("Error in getMe controller:", error);
        return res.status(500).
            json(
                { message: "Internal server error" }
            );

    }
}

export const logout = async (
    req: Request,
    res: Response
) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logout successful",
    });
};