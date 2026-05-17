// アプリ内ページの共通レイアウト（ナビゲーション付き）
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import GuestBanner from "@/components/GuestBanner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインならログインページへ（ミドルウェアのバックアップ）
  if (!user) {
    redirect("/login");
  }

  const isAnonymous = user.is_anonymous ?? false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation userEmail={user.email ?? ""} />
      {isAnonymous && <GuestBanner />}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
