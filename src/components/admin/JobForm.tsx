import { saveJob } from "@/actions/admin";
import SubmitButton from "./SubmitButton";

type JobFormData = {
  id: string;
  slug: string;
  titleEn: string;
  titleNe: string;
  descriptionEn: string;
  descriptionNe: string;
  requirementsEn: string | null;
  requirementsNe: string | null;
  benefitsEn: string | null;
  benefitsNe: string | null;
  company: string | null;
  countryId: string;
  categoryId: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  vacancies: number;
  workingHours: string | null;
  contractDuration: string | null;
  accommodation: boolean;
  food: boolean;
  overtime: boolean;
  deadline: Date | null;
  interviewDate: Date | null;
  imageUrl: string | null;
  status: string;
  isFeatured: boolean;
};

const toDate = (d: Date | null | undefined) =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

export default function JobForm({
  job,
  countries,
  categories,
}: {
  job?: JobFormData | null;
  countries: { id: string; nameEn: string }[];
  categories: { id: string; nameEn: string }[];
}) {
  return (
    <form action={saveJob} className="row g-3">
      {job && <input type="hidden" name="id" value={job.id} />}

      <div className="col-12">
        <h6 className="text-muted-sw text-uppercase small">Basic Information</h6>
        <hr className="mt-1" />
      </div>
      <div className="col-md-6">
        <label className="form-label">
          Title (English) <span className="text-danger">*</span>
        </label>
        <input
          name="titleEn"
          className="form-control"
          defaultValue={job?.titleEn}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Title (Nepali)</label>
        <input name="titleNe" className="form-control" defaultValue={job?.titleNe} />
      </div>
      <div className="col-md-4">
        <label className="form-label">Slug</label>
        <input
          name="slug"
          className="form-control"
          defaultValue={job?.slug}
          placeholder="auto-generated if empty"
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Company</label>
        <input name="company" className="form-control" defaultValue={job?.company ?? ""} />
      </div>
      <div className="col-md-4">
        <label className="form-label">Image URL</label>
        <input name="imageUrl" className="form-control" defaultValue={job?.imageUrl ?? ""} />
      </div>

      <div className="col-md-6">
        <label className="form-label">
          Country <span className="text-danger">*</span>
        </label>
        <select
          name="countryId"
          className="form-select"
          defaultValue={job?.countryId ?? ""}
          required
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameEn}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">
          Category <span className="text-danger">*</span>
        </label>
        <select
          name="categoryId"
          className="form-select"
          defaultValue={job?.categoryId ?? ""}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Salary Min</label>
        <input
          name="salaryMin"
          type="number"
          className="form-control"
          defaultValue={job?.salaryMin ?? ""}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Salary Max</label>
        <input
          name="salaryMax"
          type="number"
          className="form-control"
          defaultValue={job?.salaryMax ?? ""}
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Currency</label>
        <input
          name="currency"
          className="form-control"
          defaultValue={job?.currency ?? "NPR"}
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Vacancies</label>
        <input
          name="vacancies"
          type="number"
          className="form-control"
          defaultValue={job?.vacancies ?? 1}
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Status</label>
        <select
          name="status"
          className="form-select"
          defaultValue={job?.status ?? "ACTIVE"}
        >
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Working Hours</label>
        <input
          name="workingHours"
          className="form-control"
          defaultValue={job?.workingHours ?? ""}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Contract Duration</label>
        <input
          name="contractDuration"
          className="form-control"
          defaultValue={job?.contractDuration ?? ""}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Deadline</label>
        <input
          name="deadline"
          type="date"
          className="form-control"
          defaultValue={toDate(job?.deadline)}
        />
      </div>
      <div className="col-md-3">
        <label className="form-label">Interview Date</label>
        <input
          name="interviewDate"
          type="date"
          className="form-control"
          defaultValue={toDate(job?.interviewDate)}
        />
      </div>

      <div className="col-12 d-flex flex-wrap gap-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="accommodation"
            id="accommodation"
            defaultChecked={job?.accommodation}
          />
          <label className="form-check-label" htmlFor="accommodation">
            Accommodation
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="food"
            id="food"
            defaultChecked={job?.food}
          />
          <label className="form-check-label" htmlFor="food">
            Food
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="overtime"
            id="overtime"
            defaultChecked={job?.overtime}
          />
          <label className="form-check-label" htmlFor="overtime">
            Overtime
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            defaultChecked={job?.isFeatured}
          />
          <label className="form-check-label" htmlFor="isFeatured">
            Featured (show on home)
          </label>
        </div>
      </div>

      <div className="col-12">
        <h6 className="text-muted-sw text-uppercase small mt-3">Content</h6>
        <hr className="mt-1" />
      </div>
      <div className="col-md-6">
        <label className="form-label">Description (English)</label>
        <textarea
          name="descriptionEn"
          rows={4}
          className="form-control"
          defaultValue={job?.descriptionEn}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Description (Nepali)</label>
        <textarea
          name="descriptionNe"
          rows={4}
          className="form-control"
          defaultValue={job?.descriptionNe}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Requirements (English)</label>
        <textarea
          name="requirementsEn"
          rows={4}
          className="form-control"
          defaultValue={job?.requirementsEn ?? ""}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Requirements (Nepali)</label>
        <textarea
          name="requirementsNe"
          rows={4}
          className="form-control"
          defaultValue={job?.requirementsNe ?? ""}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Benefits (English)</label>
        <textarea
          name="benefitsEn"
          rows={3}
          className="form-control"
          defaultValue={job?.benefitsEn ?? ""}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Benefits (Nepali)</label>
        <textarea
          name="benefitsNe"
          rows={3}
          className="form-control"
          defaultValue={job?.benefitsNe ?? ""}
        />
      </div>

      <div className="col-12 d-flex gap-2 mt-3">
        <SubmitButton className="btn btn-primary-sw">
          <i className="bi bi-save me-1" />
          {job ? "Update Job" : "Create Job"}
        </SubmitButton>
      </div>
    </form>
  );
}
