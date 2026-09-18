export default function Home() {
    return (
        <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-6">
            <div className="max-w-3xl">
                <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Online Learning Platform
                </p>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Learn smarter.
                    <br />
                    Build your future.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
                    Discover courses, build your skills, and get personalized
                    course recommendations with AI.
                </p>

                <div className="mt-8 flex gap-4">
                    <a
                        href="/register"
                        className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Get Started
                    </a>

                    <a
                        href="/login"
                        className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                    >
                        Login
                    </a>
                </div>
            </div>
        </section>
    );
}