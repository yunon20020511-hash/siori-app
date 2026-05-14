// AI感想生成APIエンドポイント
import { createClient } from "@/lib/supabase/server";
import { generateBookComment } from "@/lib/groq";
import { NextResponse } from "next/server";
import { FREE_PLAN_LIMITS, BOOK_TAGS } from "@/types/database";
import type { TagId } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未認証チェック
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tags, memo } = await request.json();

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ error: "タグを選択してください" }, { status: 400 });
  }

  // ユーザープランを確認
  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", user.id)
    .single();

  const isPro = profile?.plan === "pro";

  // 無料プランの場合、今月の使用回数をチェック
  if (!isPro) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage } = await supabase
      .from("ai_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .single();

    const currentCount = usage?.count ?? 0;

    if (currentCount >= FREE_PLAN_LIMITS.AI_COMMENTS_PER_MONTH) {
      return NextResponse.json(
        {
          error: `今月のAI感想生成回数（${FREE_PLAN_LIMITS.AI_COMMENTS_PER_MONTH}回）の上限に達しました。Proプランにアップグレードすると無制限に使えます。`,
          limitReached: true,
        },
        { status: 403 }
      );
    }
  }

  // タグIDから日本語ラベルに変換
  const tagLabels = (tags as TagId[]).map(
    (tagId) => BOOK_TAGS.find((t) => t.id === tagId)?.label ?? tagId
  );

  // Groq APIでAI感想を生成
  let comment: string;
  try {
    comment = await generateBookComment(tagLabels, memo || undefined);
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { error: "AI感想の生成に失敗しました。しばらく後でお試しください。" },
      { status: 500 }
    );
  }

  // 使用回数をインクリメント（無料プランのみカウント、Proは不要だがログとして記録）
  const currentMonth = new Date().toISOString().slice(0, 7);
  await supabase.rpc("increment_ai_usage", {
    p_user_id: user.id,
    p_month: currentMonth,
  });

  return NextResponse.json({ comment });
}
