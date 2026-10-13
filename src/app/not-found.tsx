import Link from "next/link";

export default function RootNotFound() {
  return (
    <section className="section">
      <div className="container text-center py-5">
        <div
          className="display-1 fw-bold text-primary-sw"
          style={{ letterSpacing: "-2px" }}
        >
          404
        </div>
        <h1 className="h2 mt-2">Page not found / पृष्ठ भेटिएन</h1>
        <p className="text-muted-sw mx-auto" style={{ maxWidth: 520 }}>
          The page you are looking for is unavailable. The page may have been
          removed or renamed.
        </p>
        <Link href="/" className="btn btn-primary-sw btn-lg mt-3">
          <i className="bi bi-house-door me-1" />
          Back to homepage
        </Link>
      </div>
    </section>
  );
}
