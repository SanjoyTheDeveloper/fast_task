import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req: NextRequest) => {
  return await updateSession(req);
});

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
