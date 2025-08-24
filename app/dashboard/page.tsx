// app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-xl mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {session ? (
        <div className="space-y-2">
          <p>
            Signed in as <b>{session.user?.email}</b>
          </p>
          <p className="text-sm text-gray-500">
            This page is protected by middleware.
          </p>
          <div suppressHydrationWarning>
            <SignOutButton />
            </div>
        </div>
      ) : (
        <p className="text-red-600">Not signed in</p>
      )}
      
    </div>
  );
}
