import { NextResponse } from "next/server";

export function proxy(request) {
    console.info("PROXY RUNNING");
//     // 1. get token
    const hasAccessToken = request.cookies.get("accessToken")?.value;
    const hasRefreshToken = request.cookies.get("refreshToken")?.value;

    // check for both token
    const isLoggedIn = hasAccessToken || hasRefreshToken;
    // 2. current path
    const path = request.nextUrl.pathname;

    // 3. route groups
    const publicRoutes = ["/login", "/signup", "/forgot-password"];
    const protectedRoutes = ["/dashboard", "/profile", "/chat", "/settings"];

    // helper for nested routes
    const isProtectedRoute = protectedRoutes.some((route) =>path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    //  logged in user  block auth pages
    // if (token && isPublicRoute) {
    //     return NextResponse.redirect(new URL("/chat", request.url));
    // }

   //  not logged in  block protected pages
    // if (!token && isProtectedRoute) {
    //     const loginUrl = new URL("/login", request.url);

    //     // preserve redirect path (better UX)
    //     loginUrl.searchParams.set("redirect", path);

    //     return NextResponse.redirect(loginUrl);
    // }


    // if user is not logged in and accessing procted routes redirect to login
    if (!isLoggedIn && isProtectedRoute) {

        const loginUrl = new URL("/login", request.url);

        // preserve redirect path better ux
        loginUrl.searchParams.set("redirect", path);
        // return NextResponse.redirect(new URL("/login", request.url));

        return NextResponse.redirect(loginUrl);
    }

    // any trace of session with token
    if (isLoggedIn && isPublicRoute) {
        return NextResponse.redirect(new URL("/chat", request.url ));
    }

//     //  allow request
    return NextResponse.next();
}

// export const config = {
//     matcher: [
//         /*
//           Run on all routes except:
//           - /api (backend routes)
//           - Next.js internals
//           - static files
//         */
//         "/((?!api|_next/static|_next/image|favicon.ico).*)",
//     ],
// };
