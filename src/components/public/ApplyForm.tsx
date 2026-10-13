"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitApplication, type FormState } from "@/actions/public";

export default function ApplyForm({
  jobSlug,
  jobTitle,
}: {
  jobSlug?: string;
  jobTitle?: string;
}) {
  const t = useTranslations("apply");
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitApplication,
    null
  );

  const errorText = (code?: string) => {
    if (code === "INVALID_FILE_TYPE")
      return "Invalid file type. Please upload PDF, DOC or DOCX.";
    if (code === "FILE_TOO_LARGE")
      return "File is too large. Maximum allowed size is 5MB.";
    return t("error");
  };

  return (
    <div className="sw-card p-4 p-lg-5">
      {jobTitle && (
        <div className="alert alert-info d-flex align-items-center">
          <i className="bi bi-briefcase-fill me-2" />
          <span>
            {t("title")} <strong>{jobTitle}</strong>
          </span>
        </div>
      )}

      {state?.ok && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2" />
          {t("success")}
        </div>
      )}
      {state && !state.ok && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {state.message === "MISSING_FIELDS"
            ? "Please fill in all required fields."
            : errorText(state.message)}
        </div>
      )}

      <h3 className="h4 mb-4">{t("personalInfo")}</h3>

      <form action={action} className="row g-3">
        {jobSlug && <input type="hidden" name="jobSlug" value={jobSlug} />}

        <div className="col-md-6">
          <label className="form-label">
            {t("fullName")} <span className="text-danger">*</span>
          </label>
          <input name="fullName" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            {t("email")} <span className="text-danger">*</span>
          </label>
          <input name="email" type="email" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            {t("phone")} <span className="text-danger">*</span>
          </label>
          <input name="phone" className="form-control" required />
        </div>
        <div className="col-md-6">
          <label className="form-label">{t("dob")}</label>
          <input name="dob" type="date" className="form-control" />
        </div>
        <div className="col-md-4">
          <label className="form-label">{t("gender")}</label>
          <select name="gender" className="form-select" defaultValue="">
            <option value="">—</option>
            <option value="Male">{t("male")}</option>
            <option value="Female">{t("female")}</option>
            <option value="Other">{t("other")}</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">{t("nationality")}</label>
          <input
            name="nationality"
            className="form-control"
            defaultValue="Nepali"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">{t("passportNo")}</label>
          <input name="passportNo" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">{t("address")}</label>
          <input name="address" className="form-control" />
        </div>
        <div className="col-12">
          <label className="form-label">{t("experience")}</label>
          <textarea
            name="experience"
            rows={3}
            className="form-control"
            placeholder={t("experiencePlaceholder")}
          />
        </div>
        <div className="col-12">
          <label className="form-label">{t("coverLetter")}</label>
          <textarea
            name="coverLetter"
            rows={3}
            className="form-control"
            placeholder={t("coverLetterPlaceholder")}
          />
        </div>
        <div className="col-12">
          <label className="form-label">{t("resume")}</label>
          <input
            name="resume"
            type="file"
            className="form-control"
            accept=".pdf,.doc,.docx"
          />
          <div className="form-text">{t("resumeHint")}</div>
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
                {t("submitting")}
              </>
            ) : (
              <>
                <i className="bi bi-send-fill me-2" />
                {t("submit")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
