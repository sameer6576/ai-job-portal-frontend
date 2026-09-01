import { Button } from "../../../components/ui/button";
import CopyFromMenu from "./shared/CopyFromMenu";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateResumeSummary } from "../../../reduxt-store/resume/resumeThunk";
import { generateResumeSummary } from "../../../reduxt-store/ai/aiThunk";
import { useEffect } from "react";
import { toast } from "sonner";
import AiPromptDialog from "../../../components/ai/AiPromptDialog";
import FRow from "./shared/FRow";

const buildSummaryPayload = (resume, targetJobTitle, additionalContext) => {
  const workExperiences = (resume?.workExperiences ?? []).map((experience) => ({
    jobTitle: experience.jobTitle,
    companyName: experience.companyName,
    description: experience.description,
  }));

  const educations = (resume?.educations ?? []).map((education) => ({
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    institutionName: education.institutionName,
  }));

  const yearsOfExperience = (resume?.skills ?? []).reduce(
    (max, skill) => Math.max(max, Number(skill.yearsOfExperience) || 0),
    0,
  );

  return {
    targetJobTitle:
      targetJobTitle?.trim() ||
      resume?.personalInfo?.headline ||
      workExperiences[0]?.jobTitle ||
      "",
    workExperiences,
    educations,
    skills: (resume?.skills ?? []).map((skill) => skill.skillName).filter(Boolean),
    yearsOfExperience,
    additionalContext: additionalContext || null,
  };
};

const SummarySection = ({ resumeId, resume, otherResumes = [] }) => {
  const [text, setText] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const dispatch = useDispatch();
  const { isGeneratingResumeSummary } = useSelector((store) => store.ai);
  const { isActionLoading } = useSelector((store) => store.resume);

  const handleSave = async () => {
    try {
      await dispatch(updateResumeSummary({ resumeId, summary: text })).unwrap();
      toast.success("Summary saved");
    } catch (error) {
      toast.error(error || "Failed to save summary");
    }
  };

  const handleGenerate = async (prompt) => {
    const payload = buildSummaryPayload(resume, targetJobTitle, prompt);
    const result = await dispatch(generateResumeSummary(payload)).unwrap();
    setText(result.content ?? "");
    toast.success("Summary generated — review it before saving");
  };

  useEffect(() => {
    if (resume.summary) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(resume.summary);
    }
  }, [resume]);
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Write a compelling 2–4 sentence overview of your career, key skills, and
        career goals.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-blue-200 text-primary "
          onClick={() => setIsAiOpen(true)}
          disabled={isGeneratingResumeSummary}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isGeneratingResumeSummary ? "Generating..." : "Generate With Ai"}
        </Button>
        <CopyFromMenu resumes={otherResumes} />
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} />
      <p className="text-xs text-slate-400">{text.length} characters</p>

      <Button onClick={handleSave} disabled={isActionLoading}>
        <Check className="h-4 w-4 mr-1.5" />
        {isActionLoading ? "Saving..." : "Save Summary"}
      </Button>

      <AiPromptDialog
        open={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onGenerate={handleGenerate}
        title="Generate professional summary"
        description="Your work experience, skills and education are sent automatically. Add a target role and instructions to steer the tone and focus."
        fields={
          <FRow label="Target job title">
            <Input
              value={targetJobTitle}
              onChange={(event) => setTargetJobTitle(event.target.value)}
              placeholder="e.g. Senior Backend Engineer"
            />
          </FRow>
        }
      />
    </div>
  );
};

export default SummarySection;
