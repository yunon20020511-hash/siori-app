import Link from "next/link";

const DEMO_BOOKS = [
  {
    title: "嫌われる勇気",
    author: "岸見一郎・古賀史健",
    readAt: "5月12日",
    rating: 5,
    tags: [
      { label: "刺さった", emoji: "💘", color: "bg-rose-100 text-rose-800 border-rose-200" },
      { label: "考えさせられた", emoji: "🤔", color: "bg-purple-100 text-purple-800 border-purple-200" },
    ],
    aiComment: "人生の主語を「他者」から「自分」へ。課題の分離という刃は、やさしくあなたの枷を断ち切る。",
  },
  {
    title: "三体",
    author: "劉慈欣",
    readAt: "4月28日",
    rating: 4,
    tags: [
      { label: "面白かった", emoji: "✨", color: "bg-amber-100 text-amber-800 border-amber-200" },
      { label: "ワクワクした", emoji: "🎢", color: "bg-orange-100 text-orange-800 border-orange-200" },
    ],
    aiComment: "宇宙の暗闇に潜む沈黙の理由を知ったとき、人類の孤独が、突如として祝福に変わる。",
  },
  {
    title: "ハーバード流 交渉術",
    author: "ロジャー・フィッシャー",
    readAt: "4月10日",
    rating: 4,
    tags: [
      { label: "勉強になった", emoji: "📚", color: "bg-teal-100 text-teal-800 border-teal-200" },
    ],
    aiComment: "「勝つ」ではなく「解く」。対立を問題に変える瞬間、交渉は対話になる。",
  },
];

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
            description="「面白かった」「刺さった」など13種のタグから選ぶだけ。テキスト入力不要。"
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

      {/* デモプレビュー */}
      <section className="px-6 py-12 bg-amber-50/60">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full mb-3">
              登録なしで体験
            </span>
            <h2 className="text-2xl font-bold text-stone-900">
              実際の画面を見てみる
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              これがあなたの本棚になります
            </p>
          </div>

          {/* モック本棚画面 */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            {/* モックヘッダー */}
            <div className="px-5 pt-5 pb-3 border-b border-stone-100">
              <p className="font-bold text-stone-800">マイ本棚 📚</p>
              <p className="text-stone-400 text-xs mt-0.5">3冊の本を記録中</p>
            </div>

            {/* モック本カード */}
            <div className="p-4 space-y-3">
              {DEMO_BOOKS.map((book) => (
                <div
                  key={book.title}
                  className="bg-white rounded-2xl border border-stone-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-14 bg-amber-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      📕
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-stone-800 text-sm leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-stone-500 text-xs mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`text-xs ${s <= book.rating ? "text-amber-400" : "text-stone-200"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={`text-xs px-2 py-0.5 rounded-full border ${tag.color}`}
                          >
                            {tag.emoji} {tag.label}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-stone-400 mt-2 italic line-clamp-2">
                        &ldquo;{book.aiComment}&rdquo;
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 flex-shrink-0">
                      {book.readAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* タグ選択プレビュー */}
            <div className="px-5 pb-5 border-t border-stone-100 pt-4">
              <p className="text-xs font-medium text-stone-500 mb-3">
                ↑ タグはこの中から選ぶだけ
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "面白かった", emoji: "✨", color: "bg-amber-100 text-amber-800 border-amber-200" },
                  { label: "刺さった", emoji: "💘", color: "bg-rose-100 text-rose-800 border-rose-200" },
                  { label: "感動した", emoji: "🥺", color: "bg-pink-100 text-pink-800 border-pink-200" },
                  { label: "勉強になった", emoji: "📚", color: "bg-teal-100 text-teal-800 border-teal-200" },
                  { label: "ワクワクした", emoji: "🎢", color: "bg-orange-100 text-orange-800 border-orange-200" },
                ].map((tag) => (
                  <span
                    key={tag.label}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium ${tag.color}`}
                  >
                    {tag.emoji} {tag.label}
                  </span>
                ))}
                <span className="text-xs px-3 py-1.5 rounded-xl border border-stone-200 text-stone-400">
                  +8つのタグ
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-amber-800 text-white font-bold rounded-2xl hover:bg-amber-900 active:scale-95 transition-all shadow-md shadow-amber-200"
            >
              自分の本棚を作る（無料）
            </Link>
          </div>
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
