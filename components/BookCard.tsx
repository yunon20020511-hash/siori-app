// 本棚の各本を表示するカードコンポーネント
import Link from "next/link";
import { BOOK_TAGS } from "@/types/database";
import type { Book } from "@/types/database";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  // タグ情報を解決
  const tags = BOOK_TAGS.filter((t) => book.tags.includes(t.id));

  // 読了日をフォーマット（日本語）
  const readDate = new Date(book.read_at).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-2xl border border-stone-100 p-4 hover:border-amber-200 hover:shadow-md transition-all active:scale-98 cursor-pointer">
        <div className="flex items-start gap-3">
          {/* 本のアイコン */}
          <div className="w-10 h-14 bg-amber-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            📕
          </div>

          <div className="flex-1 min-w-0">
            {/* タイトルと著者 */}
            <h3 className="font-bold text-stone-800 text-sm leading-tight truncate">
              {book.title}
            </h3>
            <p className="text-stone-500 text-xs mt-0.5 truncate">{book.author}</p>
            {book.rating !== null && book.rating !== undefined && (
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-xs ${s <= book.rating! ? "text-amber-400" : "text-stone-200"}`}>★</span>
                ))}
              </div>
            )}

            {/* 感情タグ */}
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`text-xs px-2 py-0.5 rounded-full border ${tag.color}`}
                >
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>

            {/* AI感想のプレビュー */}
            {book.ai_comment && (
              <p className="text-xs text-stone-400 mt-2 italic line-clamp-2">
                &ldquo;{book.ai_comment}&rdquo;
              </p>
            )}
          </div>

          {/* 読了日 */}
          <div className="text-right flex-shrink-0">
            <span className="text-xs text-stone-400">{readDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
