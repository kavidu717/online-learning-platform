"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/auth/login", {
                email,
                password,
            });

            const { token, user } = response.data;

            login(user, token);

            if (user.role === "instructor") {
                router.push("/instructor/dashboard");
            } else {
                router.push("/courses");
            }
        } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (responseData?.errors?.length > 0) {
            setError(responseData.errors[0].message);
        } else {
            setError(
                responseData?.message ||
                "Something went wrong. Please try again."
            );
        }
    } else {
        setError("Something went wrong. Please try again.");
    }
}finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Login to your account
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </main>
    );
}