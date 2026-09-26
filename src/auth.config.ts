import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isOnAuth =
        pathname.startsWith("/login") || pathname.startsWith("/register");
      const isPublicApi = pathname.startsWith("/api/auth");
      const isVerifyEmail = pathname.startsWith("/verify-email");
      const isLanding = pathname === "/";

      // Public APIs and email verification are always public
      if (isPublicApi || isVerifyEmail) return true;

      // Public Home / Landing page: strictly public route, unauthenticated users are never blocked or redirected to /login
      if (isLanding) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Auth pages (login, register): redirect logged-in users to /dashboard
      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protected routes: Only internal dashboard, kanban, schedule, and task routes require authentication
      const isProtectedRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/kanban") ||
        pathname.startsWith("/schedule") ||
        pathname.startsWith("/task");

      if (isProtectedRoute && !isLoggedIn) {
        let from = nextUrl.pathname;
        if (nextUrl.search) from += nextUrl.search;
        return Response.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl)
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [], // Initialized in src/auth.ts
} satisfies NextAuthConfig;
