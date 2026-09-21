import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
    "/profile",
    "/my-courses",
    "/instructor",
];

const authRoutes = [
    "/login",
    "/register",
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("access_token")?.value;

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    const isAuthRoute = authRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set(
            "redirect",
            pathname
        );

        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(
            new URL("/courses", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/my-courses/:path*",
        "/instructor/:path*",
        "/login",
        "/register",
    ],
};