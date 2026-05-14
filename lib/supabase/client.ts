// ブラウザ用Supabaseクライアント（Client Components用）
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // ビルド時にプレースホルダーURLでエラーにならないようフォールバックを設定
  // 実運用時は .env.local に正しい値を設定すること
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient(url, key);
}
