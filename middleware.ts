import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    PublicRoutes,
    AuthRoutes,
} from "@/config/routes";

import authConfig from "@/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = PublicRoutes.includes(pathname);
    const isAuthRoute = AuthRoutes.includes(pathname);

    // Allow API auth routes and static assets
    if (isApiAuthRoute) return null;

    // If an authenticated user navigates to auth pages (login/signup), redirect to default
    if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // Protect /dashboard routes: only allow access when authenticated
    // but allow access to auth routes (login/signup)
    if (pathname.startsWith("/dashboard") && !isLoggedIn && !isAuthRoute) {
        return Response.redirect(new URL("/dashboard/signup", nextUrl));
    }

    // Allow public routes
    if (isPublicRoute) return null;

    return null;
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next (Next.js internal routes including server actions)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next|favicon.ico).*)",
    ],
};





