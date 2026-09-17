import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { enrollInCourse, getEnrollmentStatus, getMyEnrolledCourses } from "../controllers/enrollment.controller.js";



const router = Router();



router.post(
    "/:courseId",
    authenticate,
    authorize("student"),
    enrollInCourse
);

router.get(
    "/my-courses",
    authenticate,
    authorize("student"),
    getMyEnrolledCourses
);

router.get(
    "/:courseId/status",
    authenticate,
    authorize("student"),
    getEnrollmentStatus
);


export default router;