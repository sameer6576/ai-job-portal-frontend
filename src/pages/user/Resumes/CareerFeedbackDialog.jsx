import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { getCareerFeedback } from "../../../reduxt-store/ai/aiThunk";

const buildResumeContent = (resume) => {
  const personalInfo = resume?.personalInfo ?? {};
  const lines = [
    `Title: ${resume?.title ?? ""}`,
    `Name: ${[personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(" ")}`,
    `Headline: ${personalInfo.headline ?? ""}`,
    `Summary: ${resume?.summary ?? ""}`,
  ];

  if (resume?.workExperiences?.length) {
    lines.push("Work experience:");
    resume.workExperiences.forEach((experience) => {
      lines.push(
        `- ${experience.jobTitle} at ${experience.companyName}: ${experience.description ?? ""}`,
      );
    });
  }

  if (resume?.educations?.length) {
    lines.push("Education:");
    resume.educations.forEach((education) => {
      lines.push(
        `- ${education.degree} in ${education.fieldOfStudy ?? ""} from ${education.institutionName ?? ""}`,
      );
    });
  }

  if (resume?.skills?.length) {
    lines.push(
      `Skills: ${resume.skills.map((skill) => skill.skillName).filter(Boolean).join(", ")}`,
    );
  }

  if (resume?.projects?.length) {
    lines.push("Projects:");
    resume.projects.forEach((project) => {
      lines.push(`- ${project.title}: ${project.description ?? ""}`);
    });
  }

  return lines.filter(Boolean).join("\n");
};

const CareerFeedbackDialog = ({ open, onClose, resume }) => {
  const dispatch = useDispatch();
  const { isGettingCareerFeedback, careerFeedback } = useSelector(
    (store) => store.ai,
  );
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    try {
      await dispatch(
        getCareerFeedback({
          resumeContent: buildResumeContent(resume),
          targetJobTitle: targetJobTitle.trim() || null,
          additionalContext: prompt.trim() || null,
        }),
      ).unwrap();
      toast.success("Career feedback ready");
    } catch (error) {
      toast.error(error || "Failed to get career feedback");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI career feedback
          </DialogTitle>
          <DialogDescription>
            Your resume content is sent automatically. Add a target role and
            instructions to focus the review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Target job title</Label>
            <Input
              value={targetJobTitle}
              onChange={(event) => setTargetJobTitle(event.target.value)}
              placeholder="e.g. Senior Java Developer"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">
              Additional instructions for the AI
            </Label>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              placeholder="e.g. Focus on microservices experience and be blunt about gaps for product companies."
            />
          </div>

          {careerFeedback && (
            <div className="space-y-4 rounded-lg border border-slate-200 p-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Profile strength
                  </span>
                  <span>{careerFeedback.profileStrength}%</span>
                </div>
                <Progress value={careerFeedback.profileStrength} />
              </div>

              {careerFeedback.overallSummary && (
                <p className="text-sm text-slate-700">
                  {careerFeedback.overallSummary}
                </p>
              )}

              {careerFeedback.shortListingIssues?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Why recruiters may skip you
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {careerFeedback.shortListingIssues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {careerFeedback.improvements?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Improvements
                  </p>
                  {careerFeedback.improvements.map((improvement) => (
                    <div
                      key={`${improvement.area}-${improvement.issue}`}
                      className="rounded-md bg-slate-50 p-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{improvement.area}</Badge>
                        <Badge variant="secondary">{improvement.priority}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-700">
                        {improvement.issue}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {improvement.action}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {careerFeedback.targetJobs?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Roles to target
                  </p>
                  {careerFeedback.targetJobs.map((job) => (
                    <p key={job.jobTitle} className="text-sm text-slate-700">
                      <span className="font-medium">{job.jobTitle}</span> —{" "}
                      {job.reason}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGettingCareerFeedback}
          >
            Close
          </Button>
          <Button onClick={handleGenerate} disabled={isGettingCareerFeedback}>
            {isGettingCareerFeedback ? "Analyzing..." : "Get feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CareerFeedbackDialog;
