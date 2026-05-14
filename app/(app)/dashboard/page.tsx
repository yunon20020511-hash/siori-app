// ダッシュボード：読書統計と最近の本を表示
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import { FREE_PLAN_LIMITS } from "@/types/database";
import type { Book, UserProfile } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // ユーザープロフィール・本の一覧・今月のAI使用回数を並行取得
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthStart = `${currentMonth}-01`;

  const [profileResult, booksResult, aiUsageResult, monthlyBooksResult] =
    await Promise.all([
      supabase.from("users").select("*").eq("id", user.id).single(),
      supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("ai_usage")
        .select("count")
        .eq("user_id", user.id)
        .eq("month", currentMonth)
        .single(),
      supabase
        .from("books")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", thisMonthStart),
    ]);

  const profile = profileResult.data as UserProfile | null;
  const books = (booksResult.data ?? []) as Book[];
  const aiUsageCount = aiUsageResult.data?.count ?? 0;
  const monthlyBooksCount = monthlyBooksResult.data?.length ?? 0;
  const isPro = profile?.plan === "pro";

  return (
    <div className="space-y-6">
      {/* ウェルカムメッセージ */}
      <div>
        <h1 className="text-2xl font-bold text-stone-800">マイ本棚 📚</h1>
        <p className="text-stone-500 text-sm mt-1">
          {books.length === 0
            ? "最初の一冊を記録しましょう"
            : `${books.length}冊の本を記録中`}
        </p>
      </div>

      {/* 今月の利用状況 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="今月の記録"
          value={monthlyBooksCount}
          limit={isPro ? null : FREE_PLAN_LIMITS.BOOKS_PER_MONTH}
          unit="冊"
        />
        <StatCard
          label="AI感想（今月）"
          value={aiUsageCount}
          limit={isPro ? null : FREE_PLAN_LIMITS.AI_COMMENTS_PER_MONTH}
          unit="回"
        />
      </div>

      {/* Proアップグレードバナー（無料プランのみ） */}
      {!isPro && (
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Proにアップグレード ✨</p>
              <p className="text-amber-100 text-sm mt-1">
                記録・AI感想が無制限に
              </p>
            </div>
            <Link
              href="/api/stripe/create-checkout"
              className="px-4 py-2 bg-white text-amber-800 rounded-xl text-sm font-bold hover:bg-amber-50 transition-colors flex-shrink-0"
            >
              ¥480/月
            </Link>
          </div>
        </div>
      )}

      {/* 本を追加ボタン */}
      <Link
        href="/books/new"
        className="flex items-center justify-center gap-2 w-full py-4 bg-amber-800 text-white font-bold rounded-2xl hover:bg-amber-900 active:scale-95 transition-all shadow-md shadow-amber-200"
      >
        <span className="text-xl">+</span>
        本を記録する
      </Link>

      {/* 本の一覧 */}
      {books.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-4">📖</div>
          <p className="font-medium">まだ本が登録されていません</p>
          <p className="text-sm mt-1">上のボタンから最初の一冊を記録しよう！</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-bold text-stone-700 text-sm uppercase tracking-wide">
            最近読んだ本
          </h2>
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

// 統計カードコンポーネント
function StatCard({
  label,
  value,
  limit,
  unit,
}: {
  label: string;
  value: number;
  limit: number | null;
  unit: string;
}) {
  const isNearLimit = limit !== null && value >= limit * 0.8;
  const isAtLimit = limit !== null && value >= limit;

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-4">
      <p className="text-xs text-stone-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          isAtLimit
            ? "text-red-500"
            : isNearLimit
            ? "text-amber-600"
            : "text-stone-800"
        }`}
      >
        {value}
        {limit !== null && (
          <span className="text-sm font-normal text-stone-400">
            /{limit}{unit}
          </span>
        )}
        {limit === null && (
          <span className="text-sm font-normal text-stone-400"> {unit}</span>
        )}
      </p>
      {isAtLimit && (
        <p className="text-xs text-red-500 mt-1">上限に達しました</p>
      )}
    </div>
  );
}
