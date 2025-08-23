import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Secure Login System",
  description: "Next.js + NextAuth + Prisma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <header className="border-b">
            <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
              <Link href="/" className="font-semibold">Secure Login</Link>
              <nav className="space-x-4 text-sm">
                <Link href="/signup" className="hover:underline">Sign up</Link>
                <Link href="/login" className="hover:underline">Log in</Link>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </nav>
            </div>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
