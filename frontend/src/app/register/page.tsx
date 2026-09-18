
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API } from "@/service/axios";

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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState<AccountType>("student");
    const [invitationCode, setInvitationCode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

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
                email: string;
                password: string;
                invitationCode?: string;
            } = { firstName, lastName, email, password };

            if (accountType === "instructor") {
                requestData.invitationCode = invitationCode;
            }

            const response = await API.post("/auth/register", requestData);

            if (response.status === 201) {
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
                } else {
                    setGeneralError(responseData?.message || "Something went wrong. Please try again.");
                }
            } else {
                setGeneralError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">Create Account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Register for the Online Learning Platform</p>
                </div>
                {generalError && (
                    <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">{generalError}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="firstName" className="mb-2 block text-sm font-medium">First Name</label>
                        <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" required className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
                        {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="mb-2 block text-sm font-medium">Last Name</label>
                        <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" required className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
                        {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <div>
                        <p className="mb-3 text-sm font-medium">Account Type</p>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                                <input type="radio" name="accountType" value="student" checked={accountType === "student"} onChange={() => handleAccountTypeChange("student")} />
                                <span className="text-sm">Student</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                                <input type="radio" name="accountType" value="instructor" checked={accountType === "instructor"} onChange={() => handleAccountTypeChange("instructor")} />
                                <span className="text-sm">Instructor</span>
                            </label>
                        </div>
                    </div>
                    {accountType === "instructor" && (
                        <div>
                            <label htmlFor="invitationCode" className="mb-2 block text-sm font-medium">Instructor Invitation Code</label>
                            <input id="invitationCode" type="text" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} placeholder="Enter invitation code" required className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
                            {errors.invitationCode && <p className="mt-1 text-sm text-red-500">{errors.invitationCode}</p>}
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => router.push("/login")} className="font-medium text-primary hover:underline">Login</button>
                </p>
            </div>
        </main>
    );
}

