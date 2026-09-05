interface RoomFallbackProps {
  variant?: "unsupported" | "error";
  onRetry?: () => void;
}

export function RoomFallback({
  variant = "unsupported",
  onRetry,
}: RoomFallbackProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-charcoal via-ink to-charcoal-soft text-paper px-6 text-center">
      <p className="font-display text-sm tracking-[0.3em] uppercase text-paper/60">
        SS Holdings
      </p>
      <p className="max-w-sm text-sm text-paper/70 leading-relaxed">
        {variant === "unsupported"
          ? "Your browser doesn't support the interactive 3D space. You can still explore our collections below."
          : "The interactive space couldn't be loaded. Please try again."}
      </p>
      {variant === "error" && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-full border border-paper/30 px-5 py-2 text-xs uppercase tracking-widest hover:bg-paper/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
