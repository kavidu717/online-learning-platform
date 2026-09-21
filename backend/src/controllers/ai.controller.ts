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
            .select("_id title description content instructor")
            .populate("instructor", "firstName lastName")
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
Content: ${course.content}
Instructor: ${course.instructor &&
                        typeof course.instructor === "object" &&
                        "firstName" in course.instructor &&
                        "lastName" in course.instructor
                        ? `${course.instructor.firstName} ${course.instructor.lastName}`
                        : "Unknown"
                    }`

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
            "instructor": "instructor name",
            "reason": "short explanation why this course is relevant"
        }
    ],
    "suggestions": [
        "suggestion 1",
        "suggestion 2"
    ],
    "learningPath": [
        "learning step 1",
        "learning step 2",
        "learning step 3"
    ]
}

Rules:
- Recommend only courses from the provided course list.
- Do not invent courses.
- Do not invent course IDs.
- Return between 0 and 5 recommendations.
- Only recommend a course if it is genuinely relevant to the student's goal.
- If none of the available courses are relevant, return an empty recommendations array.
- Use the instructor name exactly as provided in the course data.
- Do not invent or modify instructor names.
- Provide 1 to 3 suggestions for useful course topics that could support the student's goal.
- Provide a short learning path with 2 to 5 steps related to the student's goal.
`,
        });

        const result = response.output_text;

        if (!result) {
            return res.status(500).json({
                message: "AI returned an empty response",
            });
        }

        interface AIRecommendationResult {
            recommendations: {
                courseId: string;
                title: string;
                instructor: string;
                reason: string;
            }[];
            suggestions: string[];
            learningPath: string[];
        }

        let parsedResult: AIRecommendationResult;

        try {
            parsedResult = JSON.parse(result);
        } catch {
            console.error("Invalid JSON returned by AI:", result);

            return res.status(500).json({
                message: "Failed to process AI recommendations",
            });
        }

        if (
            !Array.isArray(parsedResult.recommendations) ||
            !Array.isArray(parsedResult.suggestions) ||
            !Array.isArray(parsedResult.learningPath)
        ) {
            return res.status(500).json({
                message: "Invalid recommendation format received from AI",
            });
        }
        return res.status(200).json({
            message:
                Array.isArray(parsedResult.recommendations) &&
                    parsedResult.recommendations.length > 0
                    ? "Course recommendations generated successfully"
                    : "No relevant courses found for the learning goal",
            recommendations: parsedResult.recommendations,
            suggestions: parsedResult.suggestions,
            learningPath: parsedResult.learningPath,
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