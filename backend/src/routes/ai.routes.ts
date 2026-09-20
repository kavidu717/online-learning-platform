import { Router } from "express";
import { getCourseRecommendations } from "../controllers/ai.controller.js";
import {
    authenticate,
    authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/course-recommendations",
    authenticate,
    authorize("student"),
    getCourseRecommendations
);

export default router;