"use client";
// 感情タグ選択コンポーネント（複数選択可）
import { BOOK_TAGS } from "@/types/database";
import type { TagId } from "@/types/database";

interface TagSelectorProps {
  selectedTags: TagId[];
  onChange: (tags: TagId[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  function toggleTag(tagId: TagId) {
    if (selectedTags.includes(tagId)) {
      // 選択解除
      onChange(selectedTags.filter((t) => t !== tagId));
    } else {
      // 選択追加
      onChange([...selectedTags, tagId]);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {BOOK_TAGS.map((tag) => {
        const isSelected = selectedTags.includes(tag.id);

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-medium
              transition-all active:scale-95
              ${
                isSelected
                  ? `${tag.color} border-current shadow-sm scale-105`
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
              }
            `}
          >
            <span className="text-xl">{tag.emoji}</span>
            <span>{tag.label}</span>
            {isSelected && <span className="text-xs">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
