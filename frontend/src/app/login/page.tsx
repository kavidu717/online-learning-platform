"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/service/axios";
import { useAuthStore } from "@/store/authStore";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            toast.success("Login successful!");

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
                    toast.error(responseData.errors[0].message);
                } else {
                    const msg = responseData?.message || "Something went wrong. Please try again.";
                    setError(msg);
                    toast.error(msg);
                }
            } else {
                setError("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
            {/* Left Column - Form */}
            <div className="flex w-full flex-col justify-center px-6 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <div className="mx-auto w-full max-w-[420px]">

                    {/* Header Section */}
                    <div className="mb-10 flex flex-col items-start">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Sign in to your account to continue your learning journey.
                        </p>
                    </div>

                    {/* Inline Error Message (Added for better UX) */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2.5">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <button type="button" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-all">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-xl border border-input bg-background px-4 py-3.5 pl-11 pr-12 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative mt-2 w-full overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in to account</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account yet?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Premium Graphic */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/doujmzgn3/image/upload/v1789715707/brett-jordan-w7sIj-M5Xyc-unsplash_hxnh9j.jpg')] bg-cover bg-center transition-transform duration-1000 hover:scale-105"></div>

                {/* Gradient Overlays for readability and premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent"></div>
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>

                {/* Overlay Content */}
                <div className="relative z-10 flex w-full flex-col justify-end p-16 text-white pb-24">
                    <div className="max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                        <div className="mb-6 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20">
                            ✨ Join 10,000+ Students
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4 text-white">
                            Master new skills and advance your career.
                        </h2>
                        <p className="text-lg text-zinc-300">
                            Access world-class courses from industry experts. Start learning today and unlock your full potential.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}