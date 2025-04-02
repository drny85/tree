import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/owner", "/protected"]);
const isOwnerRoute = createRouteMatcher(["/owner(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  if (isProtectedRoute(req)) {
    auth.protect();

    if (isOwnerRoute(req) && sessionClaims?.metadata.role !== "owner") {
      console.log("not owner");
      // Redirect to a different ur
      const url = new URL("/main", req.url);
      return NextResponse.redirect(url);
    }
    if (!sessionClaims?.metadata.role) {
      console.log("no role");
      const url = new URL("/main", req.url);
      return NextResponse.redirect(url);
    }
    if (
      sessionClaims?.metadata.role === "owner" &&
      !req.nextUrl.pathname.startsWith("/owner")
    ) {
      console.log("owner");
      const url = new URL("/owner", req.url);
      return NextResponse.redirect(url);
    }
  } else {
    console.log("not protected");
    if (
      userId &&
      sessionClaims?.metadata.role === "owner" &&
      !req.nextUrl.pathname.startsWith("/owner")
    ) {
      console.log("owner");
      const url = new URL("/owner", req.url);
      const newPath = url.pathname;
      console.log(newPath);
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
    if (userId && sessionClaims?.metadata.role !== "owner") {
      console.log("user");
      const url = new URL("/protected", req.url);
      const newPath = url.pathname;
      console.log(newPath);
      url.pathname = newPath;
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
