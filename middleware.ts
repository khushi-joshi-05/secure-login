import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  // redirect to this page if not logged in
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
