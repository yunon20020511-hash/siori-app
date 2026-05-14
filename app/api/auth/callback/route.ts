// Supabase OAuth コールバックハンドラー
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ログイン成功後にユーザープロフィールを作成（存在しない場合）
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("users").upsert(
          {
            id: user.id,
            email: user.email!,
            plan: "free",
          },
          { onConflict: "id", ignoreDuplicates: true }
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // エラー時はログインページへ
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
