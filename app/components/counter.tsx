"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-12 sm:gap-16">
      <div className="text-[8rem] sm:text-9xl font-bold tabular-nums tracking-tight leading-none select-none">
        {count}
      </div>
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-neutral-800 px-6 py-4 text-3xl font-semibold text-white transition active:scale-90 active:bg-neutral-700 select-none touch-manipulation"
          aria-label="Decrement"
        >
          −1
        </button>
        <button
          onClick={() => setCount(0)}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-neutral-200 px-6 py-4 text-xl font-semibold text-neutral-900 transition active:scale-90 active:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:active:bg-neutral-600 select-none touch-manipulation"
          aria-label="Reset"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-emerald-500 px-6 py-4 text-3xl font-semibold text-white transition active:scale-90 active:bg-emerald-400 select-none touch-manipulation"
          aria-label="Increment"
        >
          +1
        </button>
      </div>
    </div>
  );
}
