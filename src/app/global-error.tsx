"use client";

/**
 * Top-level error boundary. Also stands in for Next's internal
 * `_global-error` fallback, which fails to prerender in this setup.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#efeae3",
          color: "#23211f",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          SS Holdings
        </p>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Something went wrong.
        </h1>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            borderRadius: "999px",
            border: "1px solid rgba(35,33,31,0.3)",
            padding: "0.5rem 1.25rem",
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
