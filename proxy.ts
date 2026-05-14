// 認証プロキシ：未ログインユーザーをログインページへリダイレクト
// Next.js 16からmiddleware.tsはproxy.tsに変更、エクスポート名もproxyになった
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // ビルド時にプレースホルダーURLでエラーにならないようフォールバックを設定
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // セッションを更新（重要：これを必ず呼ぶこと）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 認証が必要なページへの未ログインアクセスをリダイレクト
  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/books")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ログイン済みユーザーが認証ページへアクセスしたらダッシュボードへ
  if ((pathname === "/login" || pathname === "/signup") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  // 静的ファイルとAPIルートを除く全ページに適用
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|api).*)",
  ],
};
