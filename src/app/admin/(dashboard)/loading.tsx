export default function AdminLoading() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "60vh" }}
    >
      <div className="spinner-border text-primary-sw" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
