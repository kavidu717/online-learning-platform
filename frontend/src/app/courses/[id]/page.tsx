"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, User, CheckCircle, AlertCircle } from "lucide-react";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";

interface Instructor {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    content: string;
    instructor: Instructor;
    createdAt: string;
    updatedAt: string;
}

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const { token, user } = useAuthStore();

    const [course, setCourse] = useState<Course | null>(null);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const courseId = params.id as string;

    useEffect(() => {
        if (!token || !courseId) {
            return;
        }

        const fetchCourse = async () => {
            try {
                setLoading(true);
                setError("");

                const courseResponse = await API.get(`/courses/${courseId}`);

                setCourse(courseResponse.data.course);

                if (user?.role === "student") {
                    const statusResponse = await API.get(
                        `/enrollments/${courseId}/status`
                    );

                    setEnrolled(statusResponse.data.enrolled);
                }
            } catch (error: any) {
                console.error("Course Details Error:", error);
                console.error("Status:", error.response?.status);
                console.error("Response:", error.response?.data);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch course"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [token, courseId, user?.role]);

    const handleEnroll = async () => {
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setEnrolling(true);
            setError("");
            setSuccess("");

            await API.post(`/enrollments/${courseId}`, {});

            setEnrolled(true);
            setSuccess("You have successfully enrolled in this course.");
        } catch (error: any) {
            console.error("Enrollment Error:", error);
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to enroll in course"
            );
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-5xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading course...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error && !course) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-5xl">
                    <div className="flex min-h-[400px] flex-col items-center justify-center">
                        <AlertCircle
                            size={40}
                            className="mb-4 text-red-500"
                        />

                        <p className="mb-6 text-center text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <Link
                            href="/courses"
                            className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Back to Courses
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/courses"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Courses
                </Link>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex h-56 items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <BookOpen
                            size={72}
                            className="text-gray-400 dark:text-gray-500"
                        />
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                {course.title}
                            </h1>

                            <p className="text-base leading-7 text-gray-600 dark:text-gray-400">
                                {course.description}
                            </p>
                        </div>

                        <div className="mb-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                                <div className="mb-3 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <User size={18} />
                                    <span className="text-sm font-medium">
                                        Instructor
                                    </span>
                                </div>

                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {course.instructor.firstName}{" "}
                                    {course.instructor.lastName}
                                </p>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {course.instructor.email}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                                <div className="mb-3 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <BookOpen size={18} />
                                    <span className="text-sm font-medium">
                                        Course
                                    </span>
                                </div>

                                <p className="font-semibold text-gray-900 dark:text-white">
                                    Online Learning
                                </p>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Self-paced learning
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                Course Content
                            </h2>

                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                                <p className="whitespace-pre-line leading-7 text-gray-700 dark:text-gray-300">
                                    {course.content}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                                <CheckCircle size={18} />
                                {success}
                            </div>
                        )}

                        {user?.role === "student" && (
                            <div>
                                {enrolled ? (
                                    <div className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white">
                                        <CheckCircle size={20} />
                                        Enrolled
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    >
                                        {enrolling
                                            ? "Enrolling..."
                                            : "Enroll in Course"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}