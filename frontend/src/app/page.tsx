import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Brain,
    Users,
    Sparkles,
} from "lucide-react";

export default function Home() {
    return (
        <main className="bg-white dark:bg-gray-950">
            <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6 py-20">
                <div className="w-full">
                    <div className="max-w-4xl">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                            Online Learning Platform
                        </p>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                            Learn smarter.
                            <br />
                            Build your future.
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400 sm:text-xl">
                            Discover quality courses, learn at your own pace,
                            develop practical skills, and get personalized
                            learning recommendations powered by AI.
                        </p>

                        <div className="mt-9">
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3.5 font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Browse Courses
                                <ArrowRight size={19} />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <BookOpen
                                size={24}
                                className="text-gray-900 dark:text-white"
                            />

                            <h3 className="mt-5 font-semibold text-gray-900 dark:text-white">
                                Quality Courses
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Explore structured courses designed to help
                                you build useful knowledge and skills.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <Brain
                                size={24}
                                className="text-gray-900 dark:text-white"
                            />

                            <h3 className="mt-5 font-semibold text-gray-900 dark:text-white">
                                AI Assistance
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Get personalized course recommendations and
                                learning assistance with AI.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <Users
                                size={24}
                                className="text-gray-900 dark:text-white"
                            />

                            <h3 className="mt-5 font-semibold text-gray-900 dark:text-white">
                                Learn from Instructors
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Learn from instructors who create and manage
                                courses for students.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                            <Sparkles
                                size={24}
                                className="text-gray-900 dark:text-white"
                            />

                            <h3 className="mt-5 font-semibold text-gray-900 dark:text-white">
                                Learn at Your Pace
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                Choose the courses you need and continue your
                                learning journey at your own pace.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-t border-gray-200 dark:border-gray-800">
                <div className="mx-auto max-w-7xl px-6 py-20">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                Start Learning
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Everything you need to keep learning.
                            </h2>
                        </div>

                        <div>
                            <p className="text-base leading-8 text-gray-600 dark:text-gray-400">
                                Browse available courses, explore detailed
                                course content, enroll in the subjects that
                                interest you, and manage your learning journey
                                from one place. Instructors can create and
                                manage their own courses while students can
                                keep track of the courses they have enrolled
                                in.
                            </p>

                            <Link
                                href="/courses"
                                className="mt-6 inline-flex items-center gap-2 font-medium text-gray-900 hover:underline dark:text-white"
                            >
                                Explore all courses
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}