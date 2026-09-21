"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Users,
    User,
    Mail,
    CalendarDays,
    AlertCircle,
} from "lucide-react";
import { API } from "@/service/axios";


interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Enrollment {
    _id: string;
    student: Student;
    createdAt: string;
}

interface Course {
    _id: string;
    title: string;
}

export default function CourseStudentsPage() {
    const params = useParams();



    const [course, setCourse] = useState<Course | null>(null);
    const [students, setStudents] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const courseId = params.id as string;

    useEffect(() => {


        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError("");

                const courseResponse = await API.get(
                    `/courses/${courseId}`
                );

                setCourse(courseResponse.data.course);

                const studentsResponse = await API.get(
                    `/courses/${courseId}/students`
                );

                setStudents(studentsResponse.data.students);
            } catch (error: any) {
                console.error("Course Students Error:", error);
                console.error("Status:", error.response?.status);
                console.error("Response:", error.response?.data);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch students"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [courseId]);

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Loading students...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/instructor/dashboard"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <Users
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Course Students
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {course?.title}
                            </h1>
                        </div>
                    </div>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Students currently enrolled in this course.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Students
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                        {students.length}
                    </p>
                </div>

                {students.length === 0 ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 text-center dark:border-gray-800 dark:bg-gray-900">
                        <Users
                            size={48}
                            className="mb-5 text-gray-400"
                        />

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No students yet
                        </h2>

                        <p className="mt-2 max-w-md text-gray-600 dark:text-gray-400">
                            No students have enrolled in this course yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Enrolled Students
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {students.map((enrollment) => (
                                <div
                                    key={enrollment._id}
                                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            <User
                                                size={20}
                                                className="text-gray-600 dark:text-gray-300"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {enrollment.student.firstName}{" "}
                                                {enrollment.student.lastName}
                                            </h3>

                                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Mail size={15} />
                                                {enrollment.student.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CalendarDays size={16} />

                                        <span>
                                            Enrolled{" "}
                                            {new Date(
                                                enrollment.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}