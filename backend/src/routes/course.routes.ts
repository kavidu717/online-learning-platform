import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { createCourse, deleteCourse, getAllCourses, getCourseById, getMyCourses, updateCourse, getCoursesStudents } from "../controllers/course.controller.js";





const router = Router();


router.post(
    "/",
    authenticate,
    authorize("instructor"),
    createCourse
);

router.get(
    "/",

    getAllCourses
);

router.get(
    "/my-courses",
    authenticate,
    authorize("instructor"),
    getMyCourses
);

router.get(
    "/:courseId/students",
    authenticate,
    authorize("instructor"),
    getCoursesStudents
);




router.get(
    "/:id",

    getCourseById
);

router.put(
    "/:id",
    authenticate,
    authorize("instructor"),
    updateCourse
);

router.delete(
    "/:id",
    authenticate,
    authorize("instructor"),
    deleteCourse
);




export default router;