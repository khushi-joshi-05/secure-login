"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const router = useRouter();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) alert(res.error);
    else router.push(callbackUrl);
  }

  return (
    <div className="max-w-md mx-auto mt-12 border rounded-2xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="border rounded px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="border rounded px-4 py-2 w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-500">Or</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <div className="grid gap-2">
        <button onClick={() => signIn("google", { callbackUrl })} className="border rounded px-4 py-2">Continue with Google</button>
        <button onClick={() => signIn("github", { callbackUrl })} className="border rounded px-4 py-2">Continue with GitHub</button>
      </div>
    </div>
  );
}
