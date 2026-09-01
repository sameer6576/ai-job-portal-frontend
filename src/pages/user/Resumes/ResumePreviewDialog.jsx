import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { fetchResumeById } from "../../../reduxt-store/resume/resumeThunk";

const Block = ({ title, children }) => (
  <section className="space-y-2">
    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {title}
    </h3>
    {children}
  </section>
);

const ResumePreviewDialog = ({ open, onClose, resumeId }) => {
  const dispatch = useDispatch();
  const { currentResume } = useSelector((store) => store.resume);
  const resume = currentResume?.id === Number(resumeId) ? currentResume : null;

  useEffect(() => {
    if (open && resumeId) {
      dispatch(fetchResumeById(resumeId));
    }
  }, [dispatch, open, resumeId]);

  const personalInfo = resume?.personalInfo ?? {};
  const fullName = [personalInfo.firstName, personalInfo.lastName]
    .filter(Boolean)
    .join(" ");
  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    [personalInfo.city, personalInfo.country].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resume?.title ?? "Resume preview"}</DialogTitle>
        </DialogHeader>

        {!resume ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading resume...
          </p>
        ) : (
          <div className="space-y-5">
            <header className="space-y-1">
              <p className="text-lg font-semibold text-slate-900">
                {fullName || "Unnamed candidate"}
              </p>
              {personalInfo.headline && (
                <p className="text-sm text-slate-600">{personalInfo.headline}</p>
              )}
              {contactLine && (
                <p className="text-xs text-slate-500">{contactLine}</p>
              )}
            </header>

            <Separator />

            {resume.summary && (
              <Block title="Summary">
                <p className="text-sm text-slate-700">{resume.summary}</p>
              </Block>
            )}

            {resume.workExperiences?.length > 0 && (
              <Block title="Work experience">
                {resume.workExperiences.map((experience) => (
                  <div key={experience.id} className="mb-3">
                    <p className="text-sm font-medium text-slate-900">
                      {experience.jobTitle} — {experience.companyName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {experience.startDate} –{" "}
                      {experience.isCurrentJob ? "Present" : experience.endDate}
                    </p>
                    {experience.description && (
                      <p className="mt-1 text-sm text-slate-700">
                        {experience.description}
                      </p>
                    )}
                  </div>
                ))}
              </Block>
            )}

            {resume.educations?.length > 0 && (
              <Block title="Education">
                {resume.educations.map((education) => (
                  <div key={education.id} className="mb-2">
                    <p className="text-sm font-medium text-slate-900">
                      {education.degree}
                      {education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {education.institutionName}
                    </p>
                  </div>
                ))}
              </Block>
            )}

            {resume.skills?.length > 0 && (
              <Block title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.skillName}
                    </Badge>
                  ))}
                </div>
              </Block>
            )}

            {resume.projects?.length > 0 && (
              <Block title="Projects">
                {resume.projects.map((project) => (
                  <div key={project.id} className="mb-2">
                    <p className="text-sm font-medium text-slate-900">
                      {project.title}
                    </p>
                    {project.description && (
                      <p className="text-sm text-slate-700">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </Block>
            )}

            {resume.certifications?.length > 0 && (
              <Block title="Certifications">
                {resume.certifications.map((certification) => (
                  <p key={certification.id} className="text-sm text-slate-700">
                    {certification.name}
                    {certification.issuingOrganization
                      ? ` — ${certification.issuingOrganization}`
                      : ""}
                  </p>
                ))}
              </Block>
            )}

            {resume.awards?.length > 0 && (
              <Block title="Awards">
                {resume.awards.map((award) => (
                  <p key={award.id} className="text-sm text-slate-700">
                    {award.title}
                    {award.issuedBy ? ` — ${award.issuedBy}` : ""}
                  </p>
                ))}
              </Block>
            )}

            {resume.languages?.length > 0 && (
              <Block title="Languages">
                <div className="flex flex-wrap gap-1.5">
                  {resume.languages.map((language) => (
                    <Badge key={language.id} variant="outline">
                      {language.languageName} · {language.proficiency}
                    </Badge>
                  ))}
                </div>
              </Block>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreviewDialog;
