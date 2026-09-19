"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";

interface ProfileUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "student" | "instructor";
}

export default function ProfilePage() {
    const router = useRouter();

    const { user, token, logout } = useAuthStore();

    const [profile, setProfile] = useState<ProfileUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await API.get("/auth/me");

                setProfile(response.data.user);
            } catch (error: any) {
                console.error("Error fetching profile:", error);

                if (error.response?.status === 401) {
                    logout();
                    router.push("/login");
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, router, logout]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!token || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white mx-auto" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-gray-900">
                    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                        Something went wrong
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-200 px-6 py-8 dark:border-gray-800">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                <User size={36} />
                            </div>

                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {profile.firstName} {profile.lastName}
                                </h1>

                                <p className="mt-1 text-gray-500 dark:text-gray-400">
                                    {profile.email}
                                </p>

                                <span className="mt-3 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
                            Personal Information
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                        <User
                                            size={18}
                                            className="text-gray-700 dark:text-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            First Name
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                            {profile.firstName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                        <User
                                            size={18}
                                            className="text-gray-700 dark:text-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Last Name
                                        </p>

                                        <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                            {profile.lastName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                        <Mail
                                            size={18}
                                            className="text-gray-700 dark:text-gray-300"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Email
                                        </p>

                                        <p className="mt-1 truncate font-medium text-gray-900 dark:text-white">
                                            {profile.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                        <Shield
                                            size={18}
                                            className="text-gray-700 dark:text-gray-300"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Account Role
                                        </p>

                                        <p className="mt-1 font-medium capitalize text-gray-900 dark:text-white">
                                            {profile.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}