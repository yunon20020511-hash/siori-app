// Stripe Webhookハンドラー：課金状態の変更をDBに反映
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

// App RouterではBody Parsingは自動では行われないため、rawBodyを使用
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // イベント種別に応じてDBを更新
  switch (event.type) {
    case "checkout.session.completed": {
      // 決済完了：ユーザーをProプランに変更
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;

      if (userId) {
        await supabase
          .from("users")
          .update({ plan: "pro" })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      // サブスクリプション解除：無料プランに戻す
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );

      if (!("deleted" in customer) && customer.metadata?.supabase_user_id) {
        await supabase
          .from("users")
          .update({ plan: "free" })
          .eq("id", customer.metadata.supabase_user_id);
      }
      break;
    }

    case "invoice.payment_failed": {
      // 支払い失敗：ユーザーに通知（今後実装）
      console.log("Payment failed for customer:", (event.data.object as Stripe.Invoice).customer);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
