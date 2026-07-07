import { NextResponse } from "next/server";

// export function proxy(request) {
//     console.info("PROXY RUNNING");
//     // 1. get token
//     const token = request.cookies.get("accessToken")?.value;

//     // 2. current path
//     const path = request.nextUrl.pathname;

//     // 3. route groups
//     const publicRoutes = ["/login", "/signup"];
//     const protectedRoutes = ["/dashboard", "/profile", "/chat", "/settings"];

//     // helper for nested routes
//     const isProtectedRoute = protectedRoutes.some((route) =>
//         path.startsWith(route)
//     );

//     const isPublicRoute = publicRoutes.includes(path);


//     //  logged in user → block auth pages
//     if (token && isPublicRoute) {
//         return NextResponse.redirect(new URL("/chat", request.url));
//     }

//     //  not logged in → block protected pages
//     if (!token && isProtectedRoute) {
//         const loginUrl = new URL("/login", request.url);

//         // optional: preserve redirect path (better UX)
//         loginUrl.searchParams.set("redirect", path);

//         return NextResponse.redirect(loginUrl);
//     }

//     //  allow request
//     return NextResponse.next();
// }

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
