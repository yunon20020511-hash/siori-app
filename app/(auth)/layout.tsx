// 認証ページの共通レイアウト
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* ロゴ */}
      <Link href="/" className="text-3xl font-bold text-amber-900 mb-8">
        栞
      </Link>

      {/* コンテンツエリア */}
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
