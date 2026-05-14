// Supabaseのデータベース型定義

export type Plan = "free" | "pro";

// 感情タグの定義
export const BOOK_TAGS = [
  { id: "interesting",  label: "面白かった",      emoji: "✨", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { id: "moved",        label: "刺さった",        emoji: "💘", color: "bg-rose-100 text-rose-800 border-rose-200" },
  { id: "cried",        label: "泣いた",          emoji: "😢", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { id: "excited",      label: "ワクワクした",    emoji: "🎢", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { id: "impressed",    label: "感動した",        emoji: "🥺", color: "bg-pink-100 text-pink-800 border-pink-200" },
  { id: "laughed",      label: "笑えた",          emoji: "😂", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { id: "healed",       label: "癒された",        emoji: "🌿", color: "bg-green-100 text-green-800 border-green-200" },
  { id: "thoughtful",   label: "考えさせられた",  emoji: "🤔", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "learned",      label: "勉強になった",    emoji: "📚", color: "bg-teal-100 text-teal-800 border-teal-200" },
  { id: "difficult",    label: "難しかった",      emoji: "🧠", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "heavy",        label: "重かった",        emoji: "🪨", color: "bg-stone-100 text-stone-700 border-stone-300" },
  { id: "scary",        label: "怖かった",        emoji: "😱", color: "bg-gray-100 text-gray-800 border-gray-300" },
  { id: "reread",       label: "また読みたい",    emoji: "🔁", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
] as const;

export type TagId = (typeof BOOK_TAGS)[number]["id"];

// ユーザープロフィール（public.usersテーブル）
export interface UserProfile {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: Plan;
  created_at: string;
}

// 本の記録（booksテーブル）
export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  read_at: string;
  tags: TagId[];
  memo: string | null;
  rating: number | null;
  ai_comment: string | null;
  created_at: string;
}

// AI使用回数（ai_usageテーブル）
export interface AiUsage {
  id: string;
  user_id: string;
  month: string; // YYYY-MM形式
  count: number;
}

// 無料プランの制限
export const FREE_PLAN_LIMITS = {
  AI_COMMENTS_PER_MONTH: 3,
  BOOKS_PER_MONTH: 5,
} as const;
