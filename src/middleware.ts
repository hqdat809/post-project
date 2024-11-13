import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "./lib/helpers";
import { verifyJWT } from "./lib/token";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

let redirectToLogin = false;

export async function middleware(req: NextRequest) {
  let token: string | undefined;

  // get token from header if cookie has not been set
  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }

  if (
    req.nextUrl.pathname.startsWith("/login") &&
    (!token || redirectToLogin)
  ) {
    return;
  }

  // Server
  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/users") ||
      req.nextUrl.pathname.startsWith("/api/auth/logout"))
  ) {
    return getErrorResponse(401, "You are not login. Please login");
  }

  const response = NextResponse.next();

  //   Check có token không? nếu không có hoặc ko valid thì redirect về login page
  try {
    if (token) {
      const { sub } = await verifyJWT<{ sub: string }>(token);
      response.headers.set("X-USER-ID", sub);
      (req as AuthenticatedRequest).user = { id: sub };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    redirectToLogin = true;
    if (req.nextUrl.pathname.startsWith("/api")) {
      return getErrorResponse(
        401,
        "Token is invalid or user doesn't exists",
        error
      );
    }

    return NextResponse.redirect(
      new URL(`/login?${new URLSearchParams({ error: "badauth" })}`, req.url)
    );
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (!authUser) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  // Redirect to login page if
  if (req.url.includes("/login") && authUser && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile", "/login", "/api/users/:path*", "/api/auth/logout"],
};
