"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    Users,
    AlertCircle,
} from "lucide-react";
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

export default function InstructorDashboardPage() {
    const { token, user } = useAuthStore();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get("/courses/my-courses");

                setCourses(response.data.courses);
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
    }, [token]);

    const handleDelete = async (courseId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(courseId);
            setError("");

            await API.delete(`/courses/${courseId}`);

            setCourses((currentCourses) =>
                currentCourses.filter(
                    (course) => course._id !== courseId
                )
            );
        } catch (error: any) {
            console.error("Delete Course Error:", error);
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to delete course"
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading dashboard...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Welcome back
                        </p>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage your courses and students.
                        </p>
                    </div>

                    <Link
                        href="/instructor/courses/create"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        <Plus size={18} />
                        Create Course
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <BookOpen
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Courses
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                            {courses.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <Users
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Role
                        </p>

                        <p className="mt-1 text-3xl font-bold capitalize text-gray-900 dark:text-white">
                            {user?.role}
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            My Courses
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Courses created by you.
                        </p>
                    </div>
                </div>

                {courses.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center dark:border-gray-800 dark:bg-gray-900">
                        <BookOpen
                            size={48}
                            className="mb-5 text-gray-400"
                        />

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No courses yet
                        </h3>

                        <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
                            Create your first course to start teaching
                            students.
                        </p>

                        <Link
                            href="/instructor/courses/create"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            <Plus size={18} />
                            Create Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="flex h-40 items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <BookOpen
                                        size={56}
                                        className="text-gray-400 dark:text-gray-500"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                                        {course.title}
                                    </h3>

                                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        {course.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/instructor/courses/${course._id}/edit`}
                                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(course._id)
                                            }
                                            disabled={
                                                deletingId === course._id
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                                        >
                                            <Trash2 size={16} />
                                            {deletingId === course._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>

                                    <Link
                                        href={`/instructor/courses/${course._id}/students`}
                                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <Users size={16} />
                                        View Students
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