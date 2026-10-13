"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "@/actions/auth";
import SubmitButton from "./SubmitButton";

export default function ChangePasswordForm() {
  const [state, action] = useActionState<PasswordState, FormData>(
    changePassword,
    null
  );

  return (
    <form action={action} className="row g-3">
      {state && (
        <div className="col-12">
          <div
            className={`alert py-2 small mb-0 ${
              state.ok ? "alert-success" : "alert-danger"
            }`}
          >
            <i
              className={`bi ${
                state.ok
                  ? "bi-check-circle-fill"
                  : "bi-exclamation-triangle-fill"
              } me-2`}
            />
            {state.message}
          </div>
        </div>
      )}
      <div className="col-12">
        <label className="form-label">Current Password</label>
        <input
          name="current"
          type="password"
          className="form-control"
          placeholder="••••••••"
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">New Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="At least 6 characters"
          minLength={6}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Confirm New Password</label>
        <input
          name="confirm"
          type="password"
          className="form-control"
          placeholder="Repeat new password"
          minLength={6}
          required
        />
      </div>
      <div className="col-12">
        <SubmitButton className="btn btn-primary-sw" pendingText="Updating...">
          <i className="bi bi-shield-lock me-1" />
          Update Password
        </SubmitButton>
      </div>
    </form>
  );
}
