// 本の詳細ページ
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { BOOK_TAGS } from "@/types/database";
import type { Book } from "@/types/database";
import DeleteBookButton from "./DeleteBookButton";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 本の詳細を取得（自分の本のみ）
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !book) notFound();

  const bookData = book as Book;

  // タグ情報を取得
  const tags = BOOK_TAGS.filter((t) => bookData.tags.includes(t.id));

  // 読了日をフォーマット
  const readDate = new Date(bookData.read_at).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* 本の情報カード */}
      <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* 本のアイコン */}
          <div className="w-16 h-20 bg-amber-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            📕
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-stone-800 leading-tight">
              {bookData.title}
            </h1>
            <p className="text-stone-500 mt-1">{bookData.author}</p>
            <p className="text-stone-400 text-sm mt-2">読了日: {readDate}</p>
            {bookData.rating !== null && bookData.rating !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-lg ${s <= bookData.rating! ? "text-amber-400" : "text-stone-200"}`}>★</span>
                ))}
                <span className="text-sm text-stone-500 ml-1">{bookData.rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 感情タグ */}
      <div>
        <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">
          感想タグ
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${tag.color}`}
            >
              {tag.emoji} {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* 自分のメモ */}
      {bookData.memo && (
        <div>
          <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">
            メモ
          </h2>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
              {bookData.memo}
            </p>
          </div>
        </div>
      )}

      {/* AI生成感想 */}
      {bookData.ai_comment && (
        <div>
          <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wide mb-3">
            AI感想
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-amber-700">
              <span>✨</span>
              <span className="text-xs font-bold uppercase tracking-wide">
                AI Generated
              </span>
            </div>
            <p className="text-stone-700 leading-relaxed italic">
              &ldquo;{bookData.ai_comment}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* 削除ボタン */}
      <div className="pt-4 pb-8 border-t border-stone-100">
        <DeleteBookButton bookId={bookData.id} />
      </div>
    </div>
  );
}
