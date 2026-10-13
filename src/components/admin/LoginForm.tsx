"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={action}>
      {state && !state.ok && (
        <div className="alert alert-danger py-2 small">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {state.message}
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          name="email"
          type="email"
          className="form-control form-control-lg"
          placeholder="admin@swostik.com"
          defaultValue="admin@swostik.com"
          required
        />
      </div>
      <div className="mb-4">
        <label className="form-label">Password</label>
        <input
          name="password"
          type="password"
          className="form-control form-control-lg"
          placeholder="••••••••"
          required
        />
      </div>
      <SubmitButton className="btn btn-accent btn-lg w-100" pendingText="Signing in...">
        <i className="bi bi-box-arrow-in-right me-2" />
        Sign in
      </SubmitButton>
    </form>
  );
}
