"use client";

import { useEffect, useState } from "react";
import SubmitButton from "./SubmitButton";
import { saveTeamMember } from "@/actions/admin";

type Props = {
  edit?: {
    id: string;
    name: string;
    designation: string;
    contact: string;
    email: string | null;
    imageUrl: string | null;
    order: number;
    isActive: boolean;
  } | null;
};

export default function TeamMemberForm({ edit }: Props) {
  const [imageUrl, setImageUrl] = useState(edit?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setImageUrl(edit?.imageUrl ?? "");
    setError("");
  }, [edit?.id, edit?.imageUrl]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/team", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setImageUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <form action={saveTeamMember} key={edit?.id ?? "new"} className="row g-3">
      {edit && <input type="hidden" name="id" value={edit.id} />}
      <div className="col-12">
        <label className="form-label">Name *</label>
        <input name="name" className="form-control" defaultValue={edit?.name} required />
      </div>
      <div className="col-12">
        <label className="form-label">Designation *</label>
        <input name="designation" className="form-control" defaultValue={edit?.designation} required />
      </div>
      <div className="col-12">
        <label className="form-label">Contact *</label>
        <input name="contact" className="form-control" defaultValue={edit?.contact} placeholder="Phone number" required />
      </div>
      <div className="col-12">
        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-control" defaultValue={edit?.email ?? ""} placeholder="name@example.com" />
      </div>
      <div className="col-12">
        <label className="form-label">Photo</label>
        <input type="hidden" name="imageUrl" value={imageUrl} />
        <div className="d-flex flex-column gap-2">
          {imageUrl ? (
            <div className="position-relative" style={{ width: 120, height: 120 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="rounded w-100 h-100" style={{ objectFit: "cover" }} />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                onClick={() => setImageUrl("")}
                title="Remove image"
              >
                <i className="bi bi-x" />
              </button>
            </div>
          ) : null}
          <div>
            <input
              type="file"
              className="form-control"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/gif"
              onChange={handleUpload}
              disabled={uploading}
            />
            <small className="text-muted-sw">JPG, PNG, WebP, AVIF, GIF • Max 5MB • Square preferred</small>
          </div>
          {uploading && <div className="small text-muted-sw">Uploading...</div>}
          {error && <div className="small text-danger">{error}</div>}
        </div>
      </div>
      <div className="col-6">
        <label className="form-label">Order</label>
        <input name="order" type="number" className="form-control" defaultValue={edit?.order ?? 0} />
      </div>
      <div className="col-6 d-flex align-items-end justify-content-end">
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" name="isActive" defaultChecked={edit ? edit.isActive : true} />
          <label className="form-check-label">Active</label>
        </div>
      </div>
      <div className="col-12">
        <SubmitButton>
          <i className="bi bi-save me-1" />
          {edit ? "Update" : "Create"}
        </SubmitButton>
      </div>
    </form>
  );
}
