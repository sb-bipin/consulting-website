"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitInquiry, type FormState } from "@/actions/public";

export default function ContactForm({
  defaultType = "CONTACT",
}: {
  defaultType?: "CONTACT" | "HIRE";
}) {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitInquiry,
    null
  );

  return (
    <div className="sw-card p-4 p-lg-5">
      <h3 className="h4 mb-1">{t("formTitle")}</h3>
      <p className="text-muted-sw mb-4">{t("formDesc")}</p>

      {state?.ok && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2" />
          {t("success")}
        </div>
      )}
      {state && !state.ok && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {t("error")}
        </div>
      )}

      <form action={action} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">{t("inquiryType")}</label>
          <select name="type" className="form-select" defaultValue={defaultType}>
            <option value="CONTACT">{t("jobSeeker")}</option>
            <option value="HIRE">{t("employer")}</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">{tc("name")}</label>
          <input name="name" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">{tc("email")}</label>
          <input name="email" type="email" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">{tc("phone")}</label>
          <input name="phone" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">{tc("subject")}</label>
          <input name="subject" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">{tc("message")}</label>
          <textarea name="message" rows={5} className="form-control" required />
        </div>
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary-sw btn-lg"
            disabled={pending}
          >
            {pending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {tc("submitting")}
              </>
            ) : (
              <>
                <i className="bi bi-send-fill me-2" />
                {tc("send")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
