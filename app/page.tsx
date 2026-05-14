// ランディングページ：栞のトップページ
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-amber-900">栞</div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-amber-900 hover:text-amber-700 font-medium"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm bg-amber-800 text-white rounded-xl hover:bg-amber-900 font-medium transition-colors"
          >
            無料で始める
          </Link>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-8xl mb-6">📖</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4 leading-tight">
            読んだ本が、
            <br />
            <span className="text-amber-800">知性になる。</span>
          </h1>
          <p className="text-stone-500 text-lg mb-8 leading-relaxed">
            タグを選ぶだけでAIが感想を言語化。
            <br />
            あなたの知的な軌跡を美しく記録します。
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-amber-800 text-white font-bold text-lg rounded-2xl hover:bg-amber-900 active:scale-95 transition-all shadow-lg shadow-amber-200"
          >
            3分で始める →
          </Link>
          <p className="text-stone-400 text-sm mt-4">
            無料で月5冊・AI感想3回まで利用可能
          </p>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="px-6 py-12 bg-white/50">
        <div className="max-w-lg mx-auto grid gap-6">
          <FeatureCard
            emoji="🏷️"
            title="タグで感想を選ぶだけ"
            description="「面白かった」「刺さった」など5つのタグから選ぶだけ。テキスト入力不要。"
          />
          <FeatureCard
            emoji="✨"
            title="AIが詩的な感想を生成"
            description="選んだタグをもとに、SNSでシェアしたくなる洗練された感想をAIが自動生成。"
          />
          <FeatureCard
            emoji="📚"
            title="知的な本棚を育てる"
            description="読んだ本が蓄積され、あなただけの知的な本棚が完成していく。"
          />
        </div>
      </section>

      {/* 料金プラン */}
      <section className="px-6 py-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            シンプルな料金プラン
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <PlanCard
              name="無料プラン"
              price="¥0"
              features={["月5冊まで記録", "AI感想月3回まで"]}
            />
            <PlanCard
              name="Proプラン"
              price="¥480"
              period="/月"
              features={["記録無制限", "AI感想無制限"]}
              isPro
            />
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="text-center py-6 text-stone-400 text-sm border-t border-stone-100">
        © 2025 栞 - 知的ライフログ
      </footer>
    </main>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-100">
      <div className="text-3xl flex-shrink-0">{emoji}</div>
      <div>
        <h3 className="font-bold text-stone-800 mb-1">{title}</h3>
        <p className="text-stone-500 text-sm">{description}</p>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  features,
  isPro,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  isPro?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl border-2 ${
        isPro
          ? "border-amber-800 bg-amber-800 text-white"
          : "border-stone-200 bg-white"
      }`}
    >
      <div className="text-sm font-medium mb-1 opacity-80">{name}</div>
      <div className="text-3xl font-bold mb-1">
        {price}
        {period && <span className="text-base font-normal">{period}</span>}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="text-sm flex items-center gap-2">
            <span>{isPro ? "✅" : "✓"}</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
