"use client";
// アプリ内ナビゲーションヘッダー
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface NavigationProps {
  userEmail: string;
}

export default function Navigation({ userEmail }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/dashboard" className="text-xl font-bold text-amber-900">
          栞
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" current={pathname === "/dashboard"}>
            本棚
          </NavLink>
          <NavLink href="/books/new" current={pathname === "/books/new"}>
            + 記録
          </NavLink>
        </nav>

        {/* ユーザーメニュー */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 hidden sm:block truncate max-w-32">
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {signingOut ? "..." : "ログアウト"}
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
        current
          ? "bg-amber-100 text-amber-800"
          : "text-stone-600 hover:text-stone-800 hover:bg-stone-100"
      }`}
    >
      {children}
    </Link>
  );
}
