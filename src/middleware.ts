import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "./lib/helpers";
import { verifyJWT } from "./lib/token";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

export async function middleware(req: NextRequest) {
  const token: string[] = [];

  // get token from header if cookie has not been set
  if (req.cookies.has("token")) {
    token.push(req.cookies.get("token")?.value || "");
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token.push(req.headers.get("Authorization")?.substring(7) || "");
  }

  if (req.nextUrl.pathname.startsWith("/login") && !token[0]) {
    return;
  }

  const response = NextResponse.next();

  //   Check có token và có valid không? nếu không có hoặc ko valid thì redirect về login page?
  try {
    if (token[0]) {
      const { sub } = await verifyJWT<{ sub: string }>(token[0]);
      response.headers.set("X-USER-ID", sub);
      (req as AuthenticatedRequest).user = { id: sub };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return getErrorResponse(
        401,
        "Token is invalid or user doesn't exists",
        error
      );
    }

    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  // Server
  if (
    !token[0] &&
    (req.nextUrl.pathname.startsWith("/api/users") ||
      req.nextUrl.pathname.startsWith("/api/auth/logout"))
  ) {
    return getErrorResponse(401, "You are not login. Please login");
  }

  const authUser = (req as AuthenticatedRequest).user;

  if (!authUser) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  // Redirect to login page if
  if (req.url.includes("/login") && authUser && token[0]) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile", "/login", "/api/users/:path*", "/api/auth/logout"],
};
