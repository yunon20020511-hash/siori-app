"use client";
// 星5段階の評価セレクター
import { useState } from "react";

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number | null) => void;
}

export default function RatingSelector({ value, onChange }: RatingSelectorProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  function handleClick(star: number) {
    // 同じ星をもう一度押すと解除
    onChange(value === star ? null : star);
  }

  const display = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="text-3xl transition-transform active:scale-90 hover:scale-110"
          aria-label={`${star}点`}
        >
          <span className={display !== null && star <= display ? "text-amber-400" : "text-stone-200"}>
            ★
          </span>
        </button>
      ))}
      {value !== null && (
        <span className="ml-2 text-sm text-stone-500">
          {value}/5
        </span>
      )}
      {value === null && (
        <span className="ml-2 text-sm text-stone-300">未評価</span>
      )}
    </div>
  );
}
