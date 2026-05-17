"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GuestBanner() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser(
      { email, password },
      { emailRedirectTo: `${window.location.origin}/api/auth/callback` }
    );

    if (error) {
      setError("登録に失敗しました。もう一度お試しください");
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-green-50 border-b border-green-200 px-4 py-3 text-center">
        <p className="text-green-700 text-sm">
          <span className="font-medium">{email}</span>{" "}
          に確認メールを送りました。リンクをクリックすると登録完了です。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      {!open ? (
        <div className="flex items-center justify-between max-w-2xl mx-auto gap-3">
          <p className="text-amber-800 text-sm">
            ゲストモード中 — 記録したデータはメール登録で保存できます
          </p>
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-1.5 bg-amber-800 text-white text-xs font-medium rounded-lg hover:bg-amber-900 transition-colors flex-shrink-0"
          >
            登録して保存
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpgrade} className="max-w-2xl mx-auto space-y-2">
          <p className="text-amber-800 text-sm font-medium">
            登録するとゲスト中のデータがそのまま引き継がれます
          </p>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2 flex-wrap">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              className="flex-1 min-w-[160px] px-3 py-1.5 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード（8文字以上）"
              required
              className="flex-1 min-w-[160px] px-3 py-1.5 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-amber-800 text-white text-sm font-medium rounded-lg hover:bg-amber-900 disabled:opacity-50 transition-colors"
            >
              {loading ? "登録中..." : "登録する"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-amber-700 text-sm hover:text-amber-900 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
