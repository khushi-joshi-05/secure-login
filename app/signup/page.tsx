"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to sign up");
      return;
    }
    // Redirect to login after successful signup
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-12 border rounded-2xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="border rounded px-3 py-2 w-full" placeholder="Password (min 6)" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="border rounded px-4 py-2 w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
      </form>
    </div>
  );
}
