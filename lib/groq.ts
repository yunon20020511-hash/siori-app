// Groq APIを使ったAI感想生成
// クライアントは呼び出し時に初期化（ビルド時エラー防止）
import Groq from "groq-sdk";

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function generateBookComment(
  tags: string[],
  memo?: string
): Promise<string> {
  const tagText = tags.join("、");
  const userContent = memo
    ? `この本を読んだ感想タグ: ${tagText}\n自分のメモ: ${memo}`
    : `この本を読んだ感想タグ: ${tagText}`;

  const chat = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "あなたは読書の感想を詩的かつ知的に言語化するアシスタントです。" +
          "ユーザーが本を読んで感じたことをタグとメモで教えてくれます。" +
          "それらをもとに、2〜3文の洗練されたひと言感想を日本語で生成してください。" +
          "メモがある場合はその言葉のエッセンスを活かしてください。" +
          "SNSでシェアしたくなるような、知的で少し詩的な文体を心がけてください。",
      },
      {
        role: "user",
        content: userContent,
      },
    ],
    max_tokens: 200,
  });

  return chat.choices[0]?.message?.content ?? "";
}
