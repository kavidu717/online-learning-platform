"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    User,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import { API } from "@/service/axios";


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

interface Enrollment {
    _id: string;
    course: Course;
    createdAt: string;
}

export default function MyCoursesPage() {


    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {


        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get(
                    "/enrollments/my-courses",);

                setEnrollments(response.data.enrollments);
            } catch (error: any) {
                console.error("My Courses Error:", error);
                console.error("Status:", error.response?.status);
                console.error("Response:", error.response?.data);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch your courses"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading your courses...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[400px] flex-col items-center justify-center">
                        <AlertCircle
                            size={40}
                            className="mb-4 text-red-500"
                        />

                        <p className="text-center text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Courses
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Courses you have enrolled in.
                    </p>
                </div>

                {enrollments.length === 0 ? (
                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center dark:border-gray-800 dark:bg-gray-900">
                        <BookOpen
                            size={48}
                            className="mb-5 text-gray-400"
                        />

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No enrolled courses
                        </h2>

                        <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
                            You have not enrolled in any courses yet.
                        </p>

                        <Link
                            href="/courses"
                            className="mt-6 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enrollment) => (
                            <div
                                key={enrollment._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex h-40 items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <BookOpen
                                        size={56}
                                        className="text-gray-400 dark:text-gray-500"
                                    />
                                </div>

                                <div className="p-6">
                                    <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                                        {enrollment.course.title}
                                    </h2>

                                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        {enrollment.course.description}
                                    </p>

                                    <div className="mb-5 flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            <User
                                                size={17}
                                                className="text-gray-500 dark:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Instructor
                                            </p>

                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {
                                                    enrollment.course
                                                        .instructor
                                                        .firstName
                                                }{" "}
                                                {
                                                    enrollment.course
                                                        .instructor
                                                        .lastName
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/courses/${enrollment.course._id}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    >
                                        View Course
                                        <ArrowRight size={17} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}