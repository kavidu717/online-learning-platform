import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { Response } from "express";
import { createCourseSchema } from "../validations/course.validation.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";


export const createCourse=async (req: AuthenticatedRequest, res: Response) => {

    try{

        const validationResult = createCourseSchema.safeParse(req.body);


        if(!validationResult.success){
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.issues,
            });
        }

        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

         const course=await Course.create({
            ...validationResult.data,
            instructor: req.user.userId
         });

       return res.status(201).json({
            message: "Course created successfully",
            course
         });
         

        }catch(error){
         
            console.error(error);
          return res.status(500)
            .json(
                { message: "Internal server error" }
            );
        }

}

export const getAllCourses=async (req: AuthenticatedRequest, res: Response) => {
    try{

        const courses=await Course.find().populate("instructor", "firstName lastName email")

        .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Courses fetched successfully",
            courses
        });




    }catch(error){
        console.error(error);
       return res.status(500)
        .json(
            { message: "Internal server error" }
        );

    }
}


export const getCourseById=async (req: AuthenticatedRequest, res: Response) => {

    try{

        const {id}=req.params;

        if (!id || Array.isArray(id)) {
    return res.status(400).json({
        message: "Invalid course ID",
    });
}

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid course id"
            });
        }

        const course=await Course.findById(id).populate("instructor", "firstName lastName email");

        if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        }

        return res.status(200).json({
            message: "Course fetched successfully",
            course
        });

    }catch(error){
        console.error(error);
         return res.status(500)
        .json(
            { message: "Internal server error" }
        );
    }

}


export const getMyCourses=async (req: AuthenticatedRequest, res: Response) => {

    try{

        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const courses=await Course.find({instructor: req.user.userId}).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "My courses fetched successfully",
            courses
        });


    }catch(error){
        console.error(error);
        return res.status(500)
        .json(
            { message: "Internal server error" }
        );

    }
}

export const updateCourse=async (req: AuthenticatedRequest, res: Response) => {
    try{

        const {id}=req.params;

        if (!id || Array.isArray(id)) {
    return res.status(400).json({
        message: "Invalid course ID",
        });
     
    }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid course id"
            });
        }

        const validationResult = createCourseSchema.safeParse(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                message: "Invalid course data",
                errors: validationResult.error.issues,
            });
        }

        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
                });
        
        }

        const course=await Course.findById(id);

        if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        
        }

        if(course.instructor.toString()!==req.user.userId){
            return res.status(403).json({
                message: "You are not authorized to update this course"
                });
        
            }

        const updatedCourse=await Course.findByIdAndUpdate(id, validationResult.data, {new: true, runValidators: true});


        return res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse

        });


    }
    catch(error){
        console.error(error);
        return res.status(500)
        .json(
            { message: "Internal server error" }
        );
    }
}


export const deleteCourse=async (req: AuthenticatedRequest, res: Response) => {
    try{

        const {id}=req.params;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                message: "Invalid course id"
            });
        }

        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const course=await Course.findById(id);

        if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if(course.instructor.toString()!==req.user.userId){
            return res.status(403).json({
                message: "You are not authorized to delete this course"
            });
        }

        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Course deleted successfully"
        });

    }catch(error){
        console.error(error);
        return res.status(500)
        .json(
            { message: "Internal server error" }
        );
    }
}

export const getCoursesStudents=async (req: AuthenticatedRequest, res: Response) => {
    try{

        if(!req.user){
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const {courseId}=req.params;

        if (!courseId || Array.isArray(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid course id"
            });
        }

        const course=await Course.findById(courseId)

         if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if(course.instructor.toString()!==req.user.userId){
            return res.status(403).json({
                message: "You are not authorized to view students of this course"
            });
        }

        const enrollments=await Enrollment.find({course: courseId}).populate("student", "firstName lastName email");

        return res.status(200).json({
            message: "Students fetched successfully",
            students: enrollments
        });


    }catch(error){
        console.error(error);
        return res.status(500)
        .json(
            { message: "Internal server error" }
        );
    }
}