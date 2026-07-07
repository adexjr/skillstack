"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NetworkBackground } from "@/components/NetworkBackground";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          username: username || email.split("@")[0],
          xp: 0,
          streak: 0,
        });
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <NetworkBackground />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-base-700 bg-base-900 p-8">
        <h1 className="font-display text-2xl font-semibold text-ink-100">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {mode === "signin"
            ? "Pick up your streak where you left off."
            : "Start your first streak today."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-mint-400"
                placeholder="codercat"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-mint-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-300">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-ink-100 outline-none focus:border-mint-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-md border border-coral-500/30 bg-coral-500/10 px-3 py-2 text-xs text-coral-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-mint-400 py-2.5 font-display text-sm font-semibold text-base-950 transition hover:bg-mint-500 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-xs text-ink-500 hover:text-ink-300"
        >
          {mode === "signin"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
