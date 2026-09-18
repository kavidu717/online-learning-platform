
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, User, AlertCircle } from "lucide-react";
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

export default function CoursesPage() {
    const { token } = useAuthStore();



    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError("");


                const response = await API.get("/courses");

                setCourses(response.data.courses);
            } catch (error: any) {


                setError(
                    error.response?.data?.message ||
                    "Failed to fetch courses"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [token]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading courses...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl">
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
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <div className="mb-3 flex items-center gap-3">
                        <BookOpen
                            size={30}
                            className="text-gray-900 dark:text-white"
                        />

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Courses
                        </h1>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400">
                        Explore our available courses and start learning.
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400">
                            No courses available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex h-40 items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <BookOpen
                                        size={48}
                                        className="text-gray-400 dark:text-gray-500"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                                        {course.title}
                                    </h2>

                                    <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        {course.description}
                                    </p>

                                    <div className="mb-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <User size={16} />

                                        <span>
                                            {course.instructor.firstName}{" "}
                                            {course.instructor.lastName}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/courses/${course._id}`}
                                        className="w-full rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                    >
                                        View Course
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

