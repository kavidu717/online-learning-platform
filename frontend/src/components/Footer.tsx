import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpen
                                size={22}
                                className="text-gray-900 dark:text-white"
                            />

                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                LearnHub
                            </h2>
                        </div>

                        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-400">
                            An online learning platform where students can
                            discover courses and learn from instructors.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Quick Links
                        </h3>

                        <div className="mt-4 flex flex-col gap-3">
                            <Link
                                href="/courses"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Courses
                            </Link>

                            <Link
                                href="/login"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Project
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Online Learning Platform with AI-powered course
                            recommendations and assistance.
                        </p>

                        <a
                            href="https://github.com/kavidu717"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                        >

                            GitHub
                        </a>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        © {new Date().getFullYear()} LearnHub. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

