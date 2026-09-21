"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/service/axios";
import {
    User, Mail, Lock, Eye, EyeOff, Briefcase,
    GraduationCap, Key, AlertCircle, ArrowRight, UserPlus
} from "lucide-react";
import { toast } from "sonner";

type AccountType = "student" | "instructor";

interface ValidationIssue {
    message: string;
    path: string[];
}

interface RegisterResponse {
    message: string;
    errors?: ValidationIssue[];
}

export default function RegisterPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState<AccountType>("student");
    const [invitationCode, setInvitationCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAccountTypeChange = (type: AccountType) => {
        setAccountType(type);
        setErrors({});
        setGeneralError("");
        if (type === "student") setInvitationCode("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setGeneralError("");
        setLoading(true);

        try {
            const requestData: {
                firstName: string;
                lastName: string;
                username: string;
                email: string;
                password: string;
                invitationCode?: string;
            } = { firstName, lastName, username, email, password };

            if (accountType === "instructor") {
                requestData.invitationCode = invitationCode;
            }

            const response = await API.post("/auth/register", requestData);

            if (response.status === 201) {
                toast.success("Account created successfully!");
                router.push("/login");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError<RegisterResponse>(error)) {
                const responseData = error.response?.data;

                if (responseData?.errors?.length) {
                    const fieldErrors: Record<string, string> = {};
                    responseData.errors.forEach((issue) => {
                        const field = issue.path[0];
                        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
                    });
                    setErrors(fieldErrors);
                    toast.error("Please fix the errors in the form.");
                } else {
                    const msg = responseData?.message || "Something went wrong. Please try again.";
                    setGeneralError(msg);
                    toast.error(msg);
                }
            } else {
                setGeneralError("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
            {/* Left Column - Form */}
            <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <div className="mx-auto w-full max-w-[440px]">

                    {/* Header Section */}
                    <div className="mb-8 flex flex-col items-start">
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                            Create an account
                        </h1>
                        <p className="mt-2 text-base text-muted-foreground">
                            Join our platform today and start your journey.
                        </p>
                    </div>

                    {/* General Error Alert */}
                    {generalError && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p className="font-medium">{generalError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name Grid */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="space-y-2.5">
                                <label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="John"
                                        required
                                        className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.firstName ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input focus:border-primary'}`}
                                    />
                                </div>
                                {errors.firstName && <p className="text-sm font-medium text-destructive mt-1.5">{errors.firstName}</p>}
                            </div>

                            <div className="space-y-2.5">
                                <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Doe"
                                        required
                                        className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.lastName ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input focus:border-primary'}`}
                                    />
                                </div>
                                {errors.lastName && <p className="text-sm font-medium text-destructive mt-1.5">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium text-foreground"
                            >
                                Username
                            </label>

                            <div className="relative group">
                                <User
                                    className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
                                />

                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe"
                                    required
                                    className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.username
                                        ? "border-destructive focus:border-destructive focus:ring-destructive/10"
                                        : "border-input focus:border-primary"
                                        }`}
                                />
                            </div>

                            {errors.username && (
                                <p className="text-sm font-medium text-destructive mt-1.5">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2.5">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input focus:border-primary'}`}
                                />
                            </div>
                            {errors.email && <p className="text-sm font-medium text-destructive mt-1.5">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-2.5">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 pr-12 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input focus:border-primary'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm font-medium text-destructive mt-1.5">{errors.password}</p>}
                        </div>

                        {/* Account Type Selector */}
                        <div className="space-y-3 pt-2">
                            <p className="text-sm font-medium text-foreground">I want to join as a:</p>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all ${accountType === "student" ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/50" : "border-input bg-background hover:bg-muted/50 hover:border-primary/50 text-muted-foreground"}`}>
                                    <input type="radio" name="accountType" className="sr-only" value="student" checked={accountType === "student"} onChange={() => handleAccountTypeChange("student")} />
                                    <GraduationCap className={`h-6 w-6 transition-colors ${accountType === "student" ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className="text-sm font-semibold">Student</span>
                                </label>
                                <label className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all ${accountType === "instructor" ? "border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/50" : "border-input bg-background hover:bg-muted/50 hover:border-primary/50 text-muted-foreground"}`}>
                                    <input type="radio" name="accountType" className="sr-only" value="instructor" checked={accountType === "instructor"} onChange={() => handleAccountTypeChange("instructor")} />
                                    <Briefcase className={`h-6 w-6 transition-colors ${accountType === "instructor" ? "text-primary" : "text-muted-foreground"}`} />
                                    <span className="text-sm font-semibold">Instructor</span>
                                </label>
                            </div>
                        </div>

                        {/* Instructor Code (Conditional) */}
                        {accountType === "instructor" && (
                            <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="invitationCode" className="text-sm font-medium text-foreground">Instructor Invitation Code</label>
                                <div className="relative group">
                                    <Key className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input
                                        id="invitationCode"
                                        type="text"
                                        value={invitationCode}
                                        onChange={(e) => setInvitationCode(e.target.value)}
                                        placeholder="Enter your access code"
                                        required
                                        className={`w-full rounded-xl border bg-background px-4 py-3.5 pl-11 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-primary/50 ${errors.invitationCode ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : 'border-input focus:border-primary'}`}
                                    />
                                </div>
                                {errors.invitationCode && <p className="text-sm font-medium text-destructive mt-1.5">{errors.invitationCode}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative mt-4 w-full overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all"
                        >
                            Sign in instead
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
                            🚀 Start your journey today
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4 text-white">
                            Learn, grow, and teach with the best.
                        </h2>
                        <p className="text-lg text-zinc-300">
                            Whether you're looking to acquire new skills or share your expertise with the world, our platform gives you the tools you need to succeed.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}