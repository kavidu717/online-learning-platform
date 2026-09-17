import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { Response } from "express";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";



export const enrollInCourse = async (req: AuthenticatedRequest, res: Response) => {
    try{

        if (!req.user) {
            return res.status(401)
            .json(
                {
                     message: "Unauthorized" 
                    }
                );
        }

        const { courseId } = req.params;

        if (!courseId || Array.isArray(courseId)) {
            return res.status(400)
            .json(
                {
                     message: "Invalid course ID" 
                    }
                );
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400)
            .json(
                {
                     message: "Invalid course ID" 
                    }
                );
        }

        const course=await Course.findById(courseId);

        if (!course) {
            return res.status(404)
            .json(
                {
                     message: "Course not found" 
                    }
                );
        }

        const existingEnrollment = await Enrollment.findOne({
            student: req.user.userId,
            course: courseId,
        });

        if (existingEnrollment) {
            return res.status(400)
            .json(
                {
                     message: "You are already enrolled in this course" 
                    }
                );
        }

        const enrollment = await Enrollment.create({
            student: req.user.userId,
            course: courseId,
        });

       return res.status(201)
        .json(
            {
                    message: "Enrolled in course successfully",
                    enrollment
                }
        );





    }catch (error) {
        console.error("Error enrolling in course:", error);
        res.
        status(500)
        .json(
            { message: "Internal server error" 

            }
        );
    }
};

export const getMyEnrolledCourses = async (req: AuthenticatedRequest, res: Response) => {
    try{

        if (!req.user) {
            return res.status(401)
            .json(
                {
                        message: "Unauthorized"
                    }
                    );
                }
         
               const enrollments = await Enrollment.find({
            student: req.user.userId,
        })
            .populate({
                path: "course",
                populate: {
                    path: "instructor",
                    select: "firstName lastName email",
                },
            })
            .sort({ createdAt: -1 });  

            return res.status(200)
            .json(
                {
                    message: "Enrolled courses fetched successfully",
                    enrollments
                }
            );



    }catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res
        .status(500)
        .json(
            { message: "Internal server error"
    }
        );
    }
}

export const getEnrollmentStatus = async (req: AuthenticatedRequest, res: Response) => {
    try{

        if (!req.user) {
            return res.status(401)
            .json(
                {
                    message: "Unauthorized"
                }
            );
        }

        const { courseId } = req.params;

        if (!courseId || Array.isArray(courseId)) {
            return res.status(400)
            .json(
                {
                    message: "Invalid course ID"
                }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400)
            .json(
                {
                    message: "Invalid course ID"
                }
            );
        }

        const enrollment = await Enrollment.findOne({
            student: req.user.userId,
            course: courseId,
        });

             return res.status(200).json({
            enrolled: Boolean(enrollment),
        });
        
    }catch (error) {
        console.error("Error fetching enrolled courses:", error);
        res
        .status(500)
        .json(
            { message: "Internal server error"
    }
        );
    }
}