# 栞セットアップガイド

## 1. 環境変数の設定

`.env.local` に以下の値を設定してください：

```
NEXT_PUBLIC_SUPABASE_URL=         # SupabaseプロジェクトのURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabaseの匿名キー
SUPABASE_SERVICE_ROLE_KEY=        # SupabaseのService Roleキー（Webhook用）
GROQ_API_KEY=                     # Groq APIキー
STRIPE_SECRET_KEY=                # Stripeのシークレットキー
STRIPE_WEBHOOK_SECRET=            # StripeのWebhookシークレット
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripeの公開キー
STRIPE_PRO_PRICE_ID=              # Proプランの価格ID（Stripe上で作成）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Supabase DBセットアップ

Supabaseのダッシュボード → SQL Editor で以下を実行：

```sql
-- ユーザープロフィールテーブル
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 本の記録テーブル
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  read_at DATE NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  ai_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI使用回数テーブル
CREATE TABLE public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL,  -- YYYY-MM形式
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, month)
);

-- RLS（Row Level Security）を有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- RLSポリシー：自分のデータのみアクセス可能
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own books" ON public.books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books" ON public.books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own books" ON public.books
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ai_usage" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id);

-- AI使用回数のインクリメント関数（RPC）
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID, p_month TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO public.ai_usage (user_id, month, count)
  VALUES (p_user_id, p_month, 1)
  ON CONFLICT (user_id, month)
  DO UPDATE SET count = ai_usage.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時にプロフィールを自動作成するトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, plan)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 3. Supabase Auth設定

- Supabase Dashboard → Authentication → Providers でGoogleを有効化
- Site URL: `http://localhost:3000`（本番は実際のURL）
- Redirect URLs: `http://localhost:3000/api/auth/callback`

## 4. Stripe設定

1. [Stripeダッシュボード](https://dashboard.stripe.com) でアカウント作成
2. 商品を作成: 名前「栞 Proプラン」、価格「¥480/月」
3. 価格IDを `STRIPE_PRO_PRICE_ID` に設定
4. Webhookエンドポイントを追加: `https://あなたのドメイン/api/stripe/webhook`
   - イベント: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Webhook Signing Secretを `STRIPE_WEBHOOK_SECRET` に設定

## 5. 開発サーバーの起動

```bash
npm run dev
```

## 6. PWAアイコンの準備

`public/icons/` に以下のファイルを配置：
- `icon-192.png` (192×192px)
- `icon-512.png` (512×512px)

## 7. Vercelデプロイ

```bash
# Vercel CLIでデプロイ
npx vercel --prod

# 環境変数をVercelに設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ...（全環境変数を同様に追加）
```
