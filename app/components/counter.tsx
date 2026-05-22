"use client";

import { useEffect, useRef, useState } from "react";

type Action = "increment" | "decrement" | "reset";

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const inFlightRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (inFlightRef.current > 0) return;
      try {
        const res = await fetch("/api/counter", { cache: "no-store" });
        const data = (await res.json()) as { value: number };
        if (!cancelled) setCount(data.value);
      } catch {
        /* ignore transient errors */
      }
    }

    load();
    const id = setInterval(load, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  async function send(action: Action) {
    inFlightRef.current += 1;
    setPending(true);
    setCount((c) => {
      if (c === null) return c;
      if (action === "increment") return c + 1;
      if (action === "decrement") return c - 1;
      return 0;
    });
    try {
      const res = await fetch("/api/counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await res.json()) as { value: number };
      setCount(data.value);
    } catch {
      /* leave optimistic value; next poll reconciles */
    } finally {
      inFlightRef.current -= 1;
      if (inFlightRef.current === 0) setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-12 sm:gap-16">
      <div className="text-[8rem] sm:text-9xl font-bold tabular-nums tracking-tight leading-none select-none">
        {count ?? "—"}
      </div>
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={() => send("decrement")}
          disabled={count === null}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-neutral-800 px-6 py-4 text-3xl font-semibold text-white transition active:scale-90 active:bg-neutral-700 disabled:opacity-40 select-none touch-manipulation"
          aria-label="Decrement"
        >
          −1
        </button>
        <button
          onClick={() => send("reset")}
          disabled={count === null}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-neutral-200 px-6 py-4 text-xl font-semibold text-neutral-900 transition active:scale-90 active:bg-neutral-300 disabled:opacity-40 dark:bg-neutral-700 dark:text-white dark:active:bg-neutral-600 select-none touch-manipulation"
          aria-label="Reset"
        >
          Reset
        </button>
        <button
          onClick={() => send("increment")}
          disabled={count === null}
          className="min-w-20 min-h-16 sm:min-w-24 sm:min-h-16 rounded-2xl bg-emerald-500 px-6 py-4 text-3xl font-semibold text-white transition active:scale-90 active:bg-emerald-400 disabled:opacity-40 select-none touch-manipulation"
          aria-label="Increment"
        >
          +1
        </button>
      </div>
      <div className="h-4 text-xs text-neutral-500">
        {pending ? "mentés…" : "élő · 2 mp-ként frissül"}
      </div>
    </div>
  );
}
