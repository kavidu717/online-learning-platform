"use client";

import Link from "next/link";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuthStore();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };


    return (
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                >
                    LearnHub
                </Link>

                <div className="flex items-center gap-5">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {user?.role === "student" && (
                                <>
                                    <Link
                                        href="/courses"
                                        className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Courses
                                    </Link>

                                    <Link
                                        href="/my-courses"
                                        className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    >
                                        My Courses
                                    </Link>
                                </>
                            )}

                            {user?.role === "instructor" && (
                                <>
                                    <Link
                                        href="/instructor/dashboard"
                                        className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/instructor/courses"
                                        className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    >
                                        My Courses
                                    </Link>
                                </>
                            )}

                            <Link
                                href="/profile"
                                className="rounded-full border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                aria-label="Profile"
                            >
                                <User size={18} />
                            </Link>


                        </>
                    )}

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
}