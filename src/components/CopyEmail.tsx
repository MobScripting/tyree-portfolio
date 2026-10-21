"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2400);
  }

  const label =
    state === "copied"
      ? "Copied"
      : state === "failed"
        ? "Copy blocked, select the address instead"
        : "Copy email";

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full bg-graphite px-5 py-2.5 text-[15px] font-medium text-ink transition-colors duration-200 ease-out-expo hover:bg-hairline active:scale-[0.97]"
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
