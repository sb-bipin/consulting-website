"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  className = "btn btn-primary-sw",
  pendingText = "Saving...",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
