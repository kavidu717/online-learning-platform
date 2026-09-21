import { Router } from "express";
import { getCourseRecommendations } from "../controllers/ai.controller.js";
import {
    authenticate,
    authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/course-recommendations",

    getCourseRecommendations
);

export default router;