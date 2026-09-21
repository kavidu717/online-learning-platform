"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun, User, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Helper component for mobile links to auto-close menu
    const MobileLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
        <Link
            href={href}
            className={`block px-4 py-3 text-base font-medium transition-colors ${className}`}
            onClick={closeMobileMenu}
        >
            {children}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                    onClick={closeMobileMenu}
                >
                    LearnHub
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-5">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                href="/courses"
                                className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                            >
                                Courses
                            </Link>

                            <Link
                                href="/ai-recommendations"
                                className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                            >
                                AI Recommendations
                            </Link>

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
                                        href="/ai-recommendations"
                                        className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                    >
                                        AI Recommendations
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

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-4">
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
                    
                    <button
                        type="button"
                        onClick={toggleMobileMenu}
                        className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
                    <div className="flex flex-col space-y-1">
                        {!isAuthenticated ? (
                            <>
                                <MobileLink href="/courses" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                    Courses
                                </MobileLink>
                                <MobileLink href="/ai-recommendations" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                    AI Recommendations
                                </MobileLink>
                                <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
                                <MobileLink href="/login" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                    Login
                                </MobileLink>
                                <MobileLink href="/register" className="mt-2 text-center rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                                    Register
                                </MobileLink>
                            </>
                        ) : (
                            <>
                                {user?.role === "student" && (
                                    <>
                                        <MobileLink href="/courses" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                            Courses
                                        </MobileLink>
                                        <MobileLink href="/ai-recommendations" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                            AI Recommendations
                                        </MobileLink>
                                        <MobileLink href="/my-courses" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                            My Courses
                                        </MobileLink>
                                    </>
                                )}

                                {user?.role === "instructor" && (
                                    <>
                                        <MobileLink href="/instructor/dashboard" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                            Dashboard
                                        </MobileLink>
                                        <MobileLink href="/instructor/courses" className="text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                            My Courses
                                        </MobileLink>
                                    </>
                                )}
                                
                                <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
                                
                                <MobileLink href="/profile" className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg">
                                    <User size={18} />
                                    Profile
                                </MobileLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}