"use client";

import { pillClass } from "./pill";

// Opens the Ask Tyree panel from anywhere on the page. The panel (Assistant.tsx) owns its
// own state and listens for this event.
export const OPEN_ASK_TYREE = "ask-tyree:open";

export function AskTyreeButton({ children, primary = false }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <button type="button" data-ask-tyree onClick={() => window.dispatchEvent(new Event(OPEN_ASK_TYREE))} className={pillClass(primary)}>
      {children}
    </button>
  );
}
