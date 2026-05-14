"use client";
import { useState } from "react";
import type { TagId } from "@/types/database";

interface AiCommentBoxProps {
  tags: TagId[];
  memo: string;
  comment: string;
  onCommentGenerated: (comment: string) => void;
}

export default function AiCommentBox({
  tags,
  memo,
  comment,
  onCommentGenerated,
}: AiCommentBoxProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // メモがあればAIに渡す
        body: JSON.stringify({ tags, memo: memo || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setLimitReached(true);
        }
        setError(data.error ?? "生成に失敗しました");
        return;
      }

      onCommentGenerated(data.comment);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span>✨</span>
          <span className="text-sm font-bold text-amber-800">AI感想を生成</span>
          {memo && (
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              メモを反映
            </span>
          )}
        </div>
        {!limitReached && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-amber-800 text-white text-sm font-medium rounded-xl hover:bg-amber-900 active:scale-95 transition-all disabled:opacity-50"
          >
            {generating ? "生成中..." : comment ? "再生成" : "生成する"}
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-amber-800 bg-amber-100 rounded-xl p-3 mb-3">
          {error}
          {limitReached && (
            <a href="/api/stripe/create-checkout" className="block mt-2 font-bold underline">
              Proプランにアップグレード →
            </a>
          )}
        </div>
      )}

      {comment && !error && (
        <p className="text-stone-700 text-sm leading-relaxed italic">
          &ldquo;{comment}&rdquo;
        </p>
      )}

      {!comment && !error && !generating && (
        <p className="text-amber-700 text-xs">
          {memo
            ? "あなたのメモをもとにAIが感想を言語化します。"
            : "タグをもとにAIが詩的な感想を自動生成します。メモを書くとより精度が上がります。"}
        </p>
      )}
    </div>
  );
}
