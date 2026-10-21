// The pill control's look, shared by links (Pill in sections.tsx) and buttons (AskTyreeButton).
export const pillClass = (primary: boolean) =>
  "inline-flex items-center rounded-full px-6 py-3 text-[17px] font-medium no-underline transition-[background-color,transform] duration-200 ease-out-expo active:scale-[0.97] " +
  (primary ? "bg-accent text-white hover:bg-accent-bright" : "bg-graphite text-ink hover:bg-hairline");
