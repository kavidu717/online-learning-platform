"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";

interface Course {
    _id: string;
    title: string;
    description: string;
    content: string;
}

interface CourseResponse {
    course: Course;
}

interface ApiErrorResponse {
    message?: string;
}

interface AxiosErrorLike {
    response?: {
        data?: ApiErrorResponse;
    };
}

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const axiosError = error as AxiosErrorLike;

        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
    }

    return fallback;
};

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();

    const { user, isAuthenticated } = useAuthStore();

    const [course, setCourse] = useState<Course | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const courseId = params.id as string;

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (user?.role !== "instructor") {
            router.push("/courses");
            return;
        }

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get<CourseResponse>(
                    `/courses/${courseId}`
                );

                const fetchedCourse = response.data.course;

                setCourse(fetchedCourse);
                setTitle(fetchedCourse.title);
                setDescription(fetchedCourse.description);
                setContent(fetchedCourse.content);
            } catch (error: unknown) {
                console.error("Error fetching course:", error);

                setError(
                    getErrorMessage(error, "Failed to load course")
                );
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, isAuthenticated, user, router]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Course title is required");
            return;
        }

        if (!description.trim()) {
            setError("Course description is required");
            return;
        }

        if (!content.trim()) {
            setError("Course content is required");
            return;
        }

        try {
            setUpdating(true);

            await API.put(`/courses/${courseId}`, {
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
            });

            setSuccess("Course updated successfully");

            setTimeout(() => {
                router.push("/instructor/courses");
            }, 1000);
        } catch (error: unknown) {
            console.error("Error updating course:", error);

            setError(
                getErrorMessage(error, "Failed to update course")
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Loading course...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!course) {
        return (
            <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
                <div className="mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-gray-900">
                        <p className="text-red-600 dark:text-red-400">
                            {error || "Course not found"}
                        </p>

                        <Link
                            href="/instructor/courses"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            <ArrowLeft size={18} />
                            Back to My Courses
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-12 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <Link
                        href="/instructor/courses"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back to My Courses
                    </Link>

                    <h1 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Course
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Update your course information and content.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                            {success}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Course Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Enter course title"
                                disabled={updating}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                            />

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                5-100 characters
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Enter course description"
                                rows={5}
                                disabled={updating}
                                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                            />

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                10-500 characters
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="content"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Course Content
                            </label>

                            <textarea
                                id="content"
                                value={content}
                                onChange={(event) =>
                                    setContent(event.target.value)
                                }
                                placeholder="Enter course content"
                                rows={12}
                                disabled={updating}
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white"
                            />

                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                Minimum 20 characters
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                        <Link
                            href="/instructor/courses"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={updating}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            <Save size={18} />

                            {updating
                                ? "Updating..."
                                : "Update Course"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}