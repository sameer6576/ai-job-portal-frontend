import CopyFromMenu from "./shared/CopyFromMenu";
import AddButton from "./shared/AddButton";
import { useState } from "react";

import SectionCard from "./shared/SectionCard";
import SectionDialog from "./shared/SectionDialog";
import FRow from "./shared/FRow";
import { Input } from "../../../components/ui/input";
import { Field } from "../../../components/ui/field";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import TagInput from "./shared/TagInput";
import DeleteConfirm from "./shared/DeleteConfirm";
import { useDispatch, useSelector } from "react-redux";
import AiPromptDialog from "../../../components/ai/AiPromptDialog";
import { generateExperienceBullets } from "../../../reduxt-store/ai/aiThunk";
import {
  addWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
} from "../../../reduxt-store/resume/resumeThunk";

const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "REMOTE",
];
const experienceData = {
  companyName: "",
  companyLogoUrl: "",
  jobTitle: "",
  employmentType: "FULL_TIME",
  location: "",
  startDate: "",
  endDate: "",
  isCurrentJob: false,
  description: "",
  technologies: ["react", "spring boot", "FastAPI", "AWS"],
};

const WorkExperienceSection = ({ resumeId, resume, otherResumes = [] }) => {
  const [open, setOpen] = useState(false);
  const [delItem, setDel] = useState(null);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(experienceData);
  const [isBulletsOpen, setIsBulletsOpen] = useState(false);
  const workExperienceData = resume.workExperiences || [];
  const dispatch = useDispatch();
  const { isGeneratingBullets } = useSelector((store) => store.ai);

  const openEdit = (item) => {
    setEdit(item);
    setForm(item);
    setOpen(true);
  };

  const openAdd = () => {
    setEdit(null);
    setOpen(true);
    setForm(experienceData);
  };

  const save = async () => {
    const payload = {
      ...form,
      endDate: form.isCurrentJob ? null : form.endDate || null,
    };
    const thunk = edit
      ? updateWorkExperience({
          resumeId,
          workExperienceId: edit.id,
          data: payload,
        })
      : addWorkExperience({ resumeId, data: payload });

    await dispatch(thunk).unwrap();
    setEdit(null);
  };
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleDelete = async () => {
    await dispatch(
      deleteWorkExperience({ resumeId, workExperienceId: delItem.id }),
    ).unwrap();
  };

  const handleGenerateBullets = async (prompt) => {
    if (!form.jobTitle?.trim() || !form.description?.trim()) {
      throw new Error(
        "Add a job title and a short description before generating bullets",
      );
    }

    const result = await dispatch(
      generateExperienceBullets({
        jobTitle: form.jobTitle,
        company: form.companyName || null,
        rawDescription: form.description,
        achievementsHint: prompt || null,
      }),
    ).unwrap();

    const bullets = result.bullets ?? [];
    if (bullets.length === 0) {
      throw new Error("The AI did not return any bullet points");
    }

    setForm((current) => ({
      ...current,
      description: bullets.map((bullet) => `• ${bullet}`).join("\n"),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CopyFromMenu resumes={otherResumes} />
        <AddButton onClick={openAdd} label="AddExperience" />
      </div>

      {workExperienceData.map((item) => (
        <SectionCard
          key={item.id}
          item={item}
          onEdit={openEdit}
          onDelete={setDel}
        >
          <p className="font-semibold text-slate-900">{item.jobTitle}</p>
          <p className="text-xs text-slate-600">
            {item.companyName}
            {item.location && `. ${item.location}`}
          </p>
          <p className="text-xs text-slate-600">
            {item.startDate} - {item.isCurrentJob ? "Present" : item.endDate}
          </p>
          {item.technologies?.length && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.technologies.map((t) => (
                <span
                  className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5"
                  key={t}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </SectionCard>
      ))}

      <SectionDialog
        onSave={save}
        open={open}
        onClose={() => setOpen(false)}
        title={edit ? "Edit Experience" : "Add Experience"}
      >
        <div className="grid grid-cols-2 gap-3">
          <FRow label={"Company *"}>
            <Input
              value={form.companyName}
              onChange={f("companyName")}
              placeholder="JobMate Technologies"
            />
          </FRow>

          <FRow label={"Job Title *"}>
            <Input
              value={form.jobTitle}
              onChange={f("jobTitle")}
              placeholder="Full Stack Developer"
            />
          </FRow>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FRow label={"Company *"}>
            <select
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              value={form.employmentType}
              onChange={f("employmentType")}
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FRow>

          <FRow label={"Location *"}>
            <Input
              value={form.location}
              onChange={f("location")}
              placeholder="City / Remote"
            />
          </FRow>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FRow label="Start Date *">
            <Input
              type="date"
              value={form.startDate}
              onChange={f("startDate")}
            />
          </FRow>
          <FRow label="End Date">
            <Input
              type="date"
              value={form.endDate}
              onChange={f("endDate")}
              disabled={form.isCurrentJob}
            />
          </FRow>
        </div>

        <Field orientation="horizontal">
          <Checkbox
            checked={form.isCurrentJob}
            onCheckedChange={(value) =>
              setForm({ ...form, isCurrentJob: value })
            }
          />
          <Label>Currently working here</Label>
        </Field>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Description</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsBulletsOpen(true)}
              disabled={isGeneratingBullets}
            >
              {isGeneratingBullets ? "Generating..." : "Generate Bullets"}
            </Button>
          </div>
          <Textarea
            value={form.description}
            onChange={f("description")}
            rows={3}
            placeholder="Key achievements and responsibilities…"
          />
        </div>

        <FRow label="Technologies">
          <TagInput
            tags={form.technologies}
            value={form.endDate}
            onChange={(value) => setForm({ ...form, technologies: value })}
          />
        </FRow>

        <FRow label="Company Logo URL *">
          <Input
            value={form.companyLogoUrl}
            onChange={f("companyLogoUrl")}
            placeholder="https://…"
          />
        </FRow>
      </SectionDialog>
      <DeleteConfirm
        open={!!delItem}
        onClose={() => setDel(null)}
        onConfirm={handleDelete}
        label={"Work Experience"}
      />
      <AiPromptDialog
        open={isBulletsOpen}
        onClose={() => setIsBulletsOpen(false)}
        onGenerate={handleGenerateBullets}
        title="Generate experience bullets"
        description="The job title, company and current description are sent automatically. Add achievements or instructions to steer the bullets."
        placeholder="e.g. Emphasise the 40% latency reduction and the migration to Kafka."
        generateLabel="Generate bullets"
      />
    </div>
  );
};

export default WorkExperienceSection;
