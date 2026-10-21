"use client";

import { useState } from "react";
import { pillClass } from "./pill";

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
      className={pillClass(false)}
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
