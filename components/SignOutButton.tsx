"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const callbackUrl = `${window.location.origin}/login`; // dynamically uses current host

  return (
    <button
      onClick={() => {
        console.log(`[LOGOUT] User logging out at ${new Date().toLocaleString()}`);
        signOut({ callbackUrl: "/login" });
      }}
      className="p-2 rounded bg-red-500 text-white"
    >
      Sign Out
    </button>
  );
}
