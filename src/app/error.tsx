"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section">
      <div className="container text-center py-5">
        <i className="bi bi-exclamation-triangle-fill display-4 text-danger" />
        <h1 className="h3 mt-3">Something went wrong</h1>
        <p className="text-muted-sw">केही त्रुटि भयो। कृपया फेरि प्रयास गर्नुहोस्।</p>
        {error.digest && (
          <p className="small text-muted-sw">Ref: {error.digest}</p>
        )}
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <button className="btn btn-primary-sw btn-lg" onClick={() => reset()}>
            <i className="bi bi-arrow-clockwise me-1" />
            Try again
          </button>
          <Link href="/" className="btn btn-outline-primary-sw btn-lg">
            <i className="bi bi-house-door me-1" />
            Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
