"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, BookOpen, Sparkles } from "lucide-react";
import { AxiosError } from "axios";
import { API } from "@/service/axios";

interface Recommendation {
    courseId: string;
    title: string;
    instructor: string;
    reason: string;
}

interface RecommendationResponse {
    message: string;
    recommendations: Recommendation[];
    suggestions: string[];
    learningPath: string[];
    requestCount: number;
    remainingRequests: number;
}

interface ApiErrorResponse {
    message?: string;
}

export default function AIRecommendationsPage() {
    const [goal, setGoal] = useState("");
    const [recommendations, setRecommendations] = useState<
        Recommendation[]
    >([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [learningPath, setLearningPath] = useState<string[]>([]);
    const [requestCount, setRequestCount] = useState<number | null>(null);
    const [remainingRequests, setRemainingRequests] = useState<number | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!goal.trim()) {
            setError("Please enter your learning goal.");
            return;
        }

        setLoading(true);
        setError("");
        setRecommendations([]);
        setSuggestions([]);
        setLearningPath([]);

        try {
            const response = await API.post<RecommendationResponse>(
                "/ai/course-recommendations",
                {
                    goal: goal.trim(),
                }
            );

            setRecommendations(response.data.recommendations);
            setSuggestions(response.data.suggestions);
            setLearningPath(response.data.learningPath);
            setRequestCount(response.data.requestCount);
            setRemainingRequests(response.data.remainingRequests);
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ApiErrorResponse>;

            setError(
                axiosError.response?.data?.message ||
                "Failed to generate course recommendations."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/courses"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Courses
                </Link>

                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white dark:bg-white dark:text-black">
                        <Bot size={32} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        AI Course Recommendations
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
                        Tell us about your learning goal and our AI will
                        recommend the most relevant courses available on
                        LearnHub.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="goal"
                            className="mb-3 block text-sm font-semibold text-gray-900 dark:text-white"
                        >
                            What do you want to learn?
                        </label>

                        <textarea
                            id="goal"
                            value={goal}
                            onChange={(event) => setGoal(event.target.value)}
                            placeholder="Example: I want to become a software engineer. What courses should I follow?"
                            rows={5}
                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white/10"
                        />

                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Ask about your career goal, skills, or learning
                                path.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                <Sparkles size={18} />

                                {loading
                                    ? "Generating..."
                                    : "Get Recommendations"}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                            {error}
                        </div>
                    )}
                </div>

                {(recommendations.length > 0 ||
                    suggestions.length > 0 ||
                    learningPath.length > 0) && (
                        <section className="mt-10">
                            {recommendations.length > 0 && (
                                <div>
                                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Recommended Courses
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                Courses selected based on your
                                                learning goal.
                                            </p>
                                        </div>

                                        {requestCount !== null &&
                                            remainingRequests !== null && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    AI requests: {requestCount} / 250
                                                    <span className="mx-2">•</span>
                                                    Remaining: {remainingRequests}
                                                </div>
                                            )}
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        {recommendations.map((course) => (
                                            <div
                                                key={course.courseId}
                                                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                                            >
                                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
                                                    <BookOpen size={24} />
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {course.title}
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Instructor: {course.instructor}
                                                </p>

                                                <div className="mt-4 flex-1">
                                                    <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                        Why this course?
                                                    </p>

                                                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                        {course.reason}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/courses/${course.courseId}`}
                                                    className="mt-6 inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                                >
                                                    View Course
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {suggestions.length > 0 && (
                                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        AI Suggestions
                                    </h2>

                                    <div className="mt-4 space-y-3">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {learningPath.length > 0 && (
                                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Suggested Learning Path
                                    </h2>

                                    <div className="mt-5 space-y-4">
                                        {learningPath.map((step, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-4"
                                            >
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white dark:bg-white dark:text-black">
                                                    {index + 1}
                                                </div>

                                                <p className="pt-1 text-sm text-gray-700 dark:text-gray-300">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {requestCount !== null &&
                                remainingRequests !== null &&
                                recommendations.length === 0 && (
                                    <div className="mt-6 text-right text-xs text-gray-500 dark:text-gray-400">
                                        AI requests: {requestCount} / 250
                                        <span className="mx-2">•</span>
                                        Remaining: {remainingRequests}
                                    </div>
                                )}
                        </section>
                    )}
            </div>
        </main>
    );
}