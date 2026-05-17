"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが間違っています");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGuest() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      setError(`ゲストログインに失敗しました: ${error.message}`);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">ログイン</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-base"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <div className="mt-4">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-stone-200" />
          <span className="mx-3 text-xs text-stone-400">または</span>
          <div className="flex-grow border-t border-stone-200" />
        </div>
        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          className="mt-4 w-full py-3 border border-stone-300 rounded-2xl text-stone-600 text-sm font-medium hover:bg-stone-50 active:scale-95 transition-all disabled:opacity-50"
        >
          登録なしでゲストとして試す
        </button>
      </div>

      <p className="text-center text-sm text-stone-500 mt-6">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-amber-800 font-medium hover:underline">
          新規登録はこちら
        </Link>
      </p>
    </>
  );
}
