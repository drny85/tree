import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { user } from "./convex/users";

// Define allowed public routes that won't trigger redirects
const publicRoutes = ["/", "/main", "/sign-in", "/sign-up", "/api(.*)"];
const isPublicRoute = createRouteMatcher(publicRoutes);

const isProtectedRoute = createRouteMatcher(["/owner", "/protected(.*)"]);
const isOwnerRoute = createRouteMatcher(["/owner(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // Allow public routes without redirection
  if (isPublicRoute(req)) {
    if (userId && sessionClaims?.metadata.role === "owner") {
      console.log("owner");
      const url = new URL("/owner", req.url);
      return NextResponse.redirect(url);
    }
    if (userId && sessionClaims?.metadata.role !== "owner") {
      console.log("user");
      const url = new URL("/protected", req.url);
      url.pathname = "/protected"; // Set the pathname to /protected
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
    console.log("protected");

    if (isOwnerRoute(req) && sessionClaims?.metadata.role !== "owner") {
      console.log("not owner");
      // Redirect to a different url
      const url = new URL("/main", req.url);
      return NextResponse.redirect(url);
    }

    // Owner is already on a protected route, no need to redirect to /owner
    console.log("URL: " + req.nextUrl.pathname);
    if (
      userId &&
      sessionClaims?.metadata.role === "owner" &&
      !req.nextUrl.pathname.startsWith("/owner")
    ) {
      const url = new URL("/owner", req.url);
      // Preserve the original search parameters
      url.pathname = "/owner"; // Set the pathname to /owner
      return NextResponse.redirect(url);
    }
  } else {
    console.log("not protected");
    // Only redirect if not already on the correct path
    if (
      userId &&
      sessionClaims?.metadata.role === "owner" &&
      !pathname.startsWith("/owner")
    ) {
      console.log("owner");
      const url = new URL("/owner", req.url);
      return NextResponse.redirect(url);
    }
    if (
      userId &&
      sessionClaims?.metadata.role !== "owner" &&
      !pathname.startsWith("/protected")
    ) {
      console.log("user");
      const url = new URL("/protected", req.url);
      url.pathname = "/protected"; // Set the pathname to /protected
      return NextResponse.redirect(url);
    }
  }

  // If no redirection needed, continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
