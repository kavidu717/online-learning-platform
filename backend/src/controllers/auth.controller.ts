import { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../models/User.js";


export const register=async (req: Request, res: Response) => {
    try{
         
        const validationResult = registerSchema.safeParse(req.body);

         if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.issues,
            });
        }

        const { firstName, lastName, email, password, invitationCode} = validationResult.data;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        let role:UserRole="student";

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

        const user=await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
        });
     
        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                
                email: user.email,
                role: user.role
            }
            
      }  )

    }catch(error){
        console.error("Error in register controller:", error);
        res.status(500).
        json(
            { message: "Internal server error" }
        );
    }

}