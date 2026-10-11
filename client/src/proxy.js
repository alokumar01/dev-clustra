import { NextResponse } from "next/server";

export function proxy(request) {
    const hasAccessToken = request.cookies.get("accessToken")?.value;
    const hasRefreshToken = request.cookies.get("refreshToken")?.value;

    const isLoggedIn = hasAccessToken || hasRefreshToken;
    const path = request.nextUrl.pathname;

    const publicRoutes = ["/login", "/signup", "/register", "/forgot-password"];
    const protectedRoutes = ["/dashboard", "/profile", "/chat", "/settings"];

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    if (!isLoggedIn && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL("/chat", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
          Run on all routes except:
          - /api (backend routes)
          - Next.js internals
          - static files
        */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
