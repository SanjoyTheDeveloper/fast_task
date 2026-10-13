import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const authProxy = auth(async (req: NextRequest) => {
  try {
    return await updateSession(req);
  } catch (error) {
    console.warn("Proxy session error:", error);
    return NextResponse.next({ request: req });
  }
});

export const proxy = authProxy;
export default authProxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images & static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
