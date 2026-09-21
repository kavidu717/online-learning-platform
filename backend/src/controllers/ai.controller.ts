import openai from "../config/openai.js";
import { canMakeAIRequest, incrementAIRequestCounter, getAIRequestCount, getRemainingAIRequests } from "../config/aiRequestCounter.js";
import { Response, Request } from 'express'

import Course from "../models/Course.js";

export const getCourseRecommendations = async (
    req: Request,
    res: Response
) => {
    try {


        const { goal } = req.body;

        if (
            typeof goal !== "string" ||
            !goal.trim()
        ) {
            return res.status(400).json({
                message: "Learning goal is required",
            });
        }

        if (!canMakeAIRequest()) {
            return res.status(429).json({
                message: "AI request limit has been reached",
                requestCount: getAIRequestCount(),
                remainingRequests: 0,
            });
        }

        const courses = await Course.find()
            .select("_id title description content")
            .lean();

        if (courses.length === 0) {
            return res.status(404).json({
                message: "No courses are available for recommendation",
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

        incrementAIRequestCounter();

        const response = await openai.responses.create({
            model: "gpt-5.6",
            input: `
You are an AI learning advisor for an online learning platform.

A student has provided the following learning goal:

"${goal.trim()}"

Below are the courses currently available on the platform:

${courseData}

Based ONLY on the available courses, recommend the most relevant courses for the student's goal.

Return ONLY valid JSON in this exact structure:

{
    "recommendations": [
        {
            "courseId": "course id",
            "title": "course title",
            "reason": "short explanation why this course is relevant"
        }
    ]
}

Rules:
- Recommend only courses from the provided course list.
- Do not invent courses.
- Do not invent course IDs.
- Return between 1 and 5 recommendations.
- Prioritize courses that are most relevant to the student's goal.
`,
        });

        const result = response.output_text;

        if (!result) {
            return res.status(500).json({
                message: "AI returned an empty response",
            });
        }

        let parsedResult: unknown;

        try {
            parsedResult = JSON.parse(result);
        } catch {
            console.error("Invalid JSON returned by AI:", result);

            return res.status(500).json({
                message: "Failed to process AI recommendations",
            });
        }

        if (
            typeof parsedResult !== "object" ||
            parsedResult === null ||
            !("recommendations" in parsedResult)
        ) {
            return res.status(500).json({
                message: "Invalid recommendation format received from AI",
            });
        }

        return res.status(200).json({
            message: "Course recommendations generated successfully",
            recommendations: parsedResult.recommendations,
            requestCount: getAIRequestCount(),
            remainingRequests: getRemainingAIRequests(),
        });
    } catch (error: unknown) {
        console.error("Course recommendation error:", error);

        return res.status(500).json({
            message: "Failed to generate course recommendations",
        });
    }
};