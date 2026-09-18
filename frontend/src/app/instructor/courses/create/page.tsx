"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";

export default function CreateCoursePage() {
    const router = useRouter();
    const { token } = useAuthStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await API.post(
                "/courses",
                {
                    title,
                    description,
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                response.data?.message || "Course created successfully."
            );

            setTitle("");
            setDescription("");
            setContent("");

            setTimeout(() => {
                router.push("/instructor/dashboard");
            }, 1000);
        } catch (error: any) {
            console.error("Create Course Error:", error);
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to create course"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/instructor/dashboard"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-8">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <BookOpen
                                size={24}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Create Course
                        </h1>

                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Create a new course for your students.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
                            <CheckCircle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                required
                                minLength={5}
                                maxLength={100}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                            />
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
                                required
                                minLength={10}
                                maxLength={500}
                                rows={5}
                                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                            />
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
                                placeholder="Enter the course content"
                                required
                                minLength={20}
                                rows={10}
                                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Link
                                href="/instructor/dashboard"
                                className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                {loading
                                    ? "Creating Course..."
                                    : "Create Course"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}