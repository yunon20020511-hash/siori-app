"use client";
// 本を削除するボタン（クライアントコンポーネント）
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (!error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="space-y-3">
        <p className="text-stone-600 text-sm text-center">
          本当に削除しますか？この操作は元に戻せません。
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 py-3 bg-stone-100 text-stone-600 font-medium rounded-xl hover:bg-stone-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full py-3 text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
    >
      この本を削除する
    </button>
  );
}
