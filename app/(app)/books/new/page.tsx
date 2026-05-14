"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TagSelector from "@/components/TagSelector";
import AiCommentBox from "@/components/AiCommentBox";
import RatingSelector from "@/components/RatingSelector";
import { FREE_PLAN_LIMITS } from "@/types/database";
import type { TagId } from "@/types/database";

export default function NewBookPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [readAt, setReadAt] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTags, setSelectedTags] = useState<TagId[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [memo, setMemo] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  async function handleSave() {
    if (!title.trim()) { setError("タイトルを入力してください"); return; }
    if (!author.trim()) { setError("著者名を入力してください"); return; }
    if (selectedTags.length === 0) { setError("タグを1つ以上選択してください"); return; }

    setSaving(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // プランと今月の登録冊数を確認
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthStart = `${currentMonth}-01`;

    const [{ data: profile }, { count: monthlyCount }] = await Promise.all([
      supabase.from("users").select("plan").eq("id", user.id).single(),
      supabase.from("books").select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", thisMonthStart),
    ]);

    // 無料プランで上限に達している場合は誘導
    if (profile?.plan !== "pro" && (monthlyCount ?? 0) >= FREE_PLAN_LIMITS.BOOKS_PER_MONTH) {
      setLimitReached(true);
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase.from("books").insert({
      user_id: user.id,
      title: title.trim(),
      author: author.trim(),
      read_at: readAt,
      tags: selectedTags,
      memo: memo.trim() || null,
      rating: rating,
      ai_comment: aiComment || null,
    });

    if (saveError) {
      setError(`保存に失敗しました: ${saveError.message}`);
      setSaving(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // 上限到達時の画面
  if (limitReached) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="text-6xl">📚</div>
        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            今月の登録上限に達しました
          </h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            無料プランでは月{FREE_PLAN_LIMITS.BOOKS_PER_MONTH}冊まで記録できます。
            <br />
            Proプランにアップグレードすると無制限に記録できます。
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <Link
            href="/api/stripe/create-checkout"
            className="flex flex-col items-center w-full py-4 px-6 bg-amber-800 text-white font-bold rounded-2xl hover:bg-amber-900 active:scale-95 transition-all shadow-lg shadow-amber-200"
          >
            <span>Proプランにアップグレード</span>
            <span className="text-amber-200 text-sm font-normal mt-0.5">¥480/月・記録無制限</span>
          </Link>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 text-stone-500 text-sm hover:text-stone-700 transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">本を記録する 📖</h1>
        <p className="text-stone-500 text-sm mt-1">読んだ本の情報を入力してください</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            タイトル <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base"
            placeholder="本のタイトルを入力"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            著者 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-base"
            placeholder="著者名を入力"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            読了日
          </label>
          <input
            type="date"
            value={readAt}
            onChange={(e) => setReadAt(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            評価 <span className="text-stone-400 font-normal">（任意）</span>
          </label>
          <RatingSelector value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            この本の感想タグ <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-stone-400 mb-3">当てはまるものをタップ（複数可）</p>
          <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            メモ <span className="text-stone-400 font-normal">（任意）</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="input-base resize-none"
            rows={3}
            placeholder="印象に残ったこと、気づきなど自由に..."
          />
          <p className="text-xs text-stone-400 mt-1">
            メモを書くとAIがそれを活かした感想を生成します
          </p>
        </div>

        {selectedTags.length > 0 && (
          <AiCommentBox
            tags={selectedTags}
            memo={memo}
            comment={aiComment}
            onCommentGenerated={setAiComment}
          />
        )}
      </div>

      <div className="pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "確認中..." : "本棚に追加する"}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full py-3 text-stone-500 text-sm mt-2 hover:text-stone-700 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
