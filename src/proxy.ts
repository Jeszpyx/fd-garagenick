import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/auth/login")
  ) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
