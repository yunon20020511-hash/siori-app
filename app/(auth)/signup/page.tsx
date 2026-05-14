"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError("登録に失敗しました。もう一度お試しください");
      setLoading(false);
      return;
    }

    setDone(true);
  }

  // メール確認待ち画面
  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-lg font-bold text-stone-800 mb-2">
          確認メールを送りました
        </h2>
        <p className="text-stone-500 text-sm">
          <span className="font-medium">{email}</span> に届いたメールの
          リンクをクリックすると登録完了です。
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">新規登録</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
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
            パスワード（8文字以上）
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
          {loading ? "登録中..." : "アカウントを作成"}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-amber-800 font-medium hover:underline">
          ログインはこちら
        </Link>
      </p>
    </>
  );
}
