"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem" }}>Something went wrong</h1>
          <p style={{ color: "#666" }}>
            केही त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।
          </p>
          {error.digest && (
            <p style={{ color: "#999", fontSize: ".8rem" }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              marginTop: "1rem",
              padding: ".6rem 1.2rem",
              borderRadius: 8,
              border: "none",
              background: "#0B2C5E",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
