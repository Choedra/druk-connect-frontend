type WordmarkProps = {
  /** "light" for light backgrounds (ink + blue), "dark" for navy (white + light blue). */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The Bhutanese Marketplace text logo: "Bhutanese" in ink, "Marketplace" in brand blue.
 * Rendered as live text in Plus Jakarta Sans ExtraBold so it stays crisp and selectable.
 * The outlined SVG versions are in the brand files for use outside the app.
 */
export function Wordmark({ tone = "light", className = "" }: WordmarkProps) {
  return (
    <span
      className={`whitespace-nowrap font-landing text-[1.15rem] font-extrabold leading-none tracking-[-0.025em] ${className}`}
    >
      <span className={tone === "light" ? "text-[#14162a]" : "text-white"}>Bhutanese</span>{" "}
      <span className={tone === "light" ? "text-[#2f6fed]" : "text-[#6e9bf7]"}>Marketplace</span>
    </span>
  );
}
