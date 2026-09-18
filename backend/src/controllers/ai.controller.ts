import { Response } from "express";
import Course from "../models/Course.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import openai from "../config/openai.js";

export const getCourseRecommendations = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const { goal } = req.body;

        if (!goal || typeof goal !== "string" || !goal.trim()) {
            return res.status(400).json({
                message: "Goal is required",
            });
        }

        const courses = await Course.find()
            .select("_id title description content")
            .lean();

        if (courses.length === 0) {
            return res.status(404).json({
                message: "No courses available",
            });
        }

        const courseData = courses
            .map(
                (course) =>
                    `Course ID: ${course._id}
Title: ${course.title}
Description: ${course.description}
Content: ${course.content}`
            )
            .join("\n\n");

        const response = await openai.responses.create({
            model: "gpt-5.6",
            input: `
You are an AI course recommendation assistant.

A student has the following career or learning goal:

"${goal.trim()}"

Available courses:

${courseData}

Recommend the most relevant courses for this student.

Return ONLY valid JSON in this exact format:

{
  "recommendations": [
    {
      "courseId": "course id",
      "title": "course title",
      "reason": "short explanation"
    }
  ]
}

Do not recommend courses that are not in the available courses.
`,
        });

        const result = response.output_text;

        let recommendations;

        try {
            recommendations = JSON.parse(result);
        } catch {
            return res.status(500).json({
                message: "Failed to process AI recommendations",
            });
        }

        return res.status(200).json({
            message: "Course recommendations generated successfully",
            recommendations: recommendations.recommendations,
        });
    } catch (error) {
        console.error(
            "Course recommendation error:",
            error
        );

        return res.status(500).json({
            message: "Failed to generate course recommendations",
        });
    }
};
