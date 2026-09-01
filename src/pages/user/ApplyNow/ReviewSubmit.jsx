import { useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"

const Row = ({ label, children }) => (
  <p className="flex items-center justify-between gap-4 text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="text-right font-medium text-slate-900">{children || "—"}</span>
  </p>
)

const ReviewSubmit = ({
  selectedResume,
  coverLetter,
  expectedSalary,
  availableFrom,
  job,
}) => {
  const resumes = useSelector((state) => state.resume.resumes)
  const selected = resumes.find((resume) => String(resume.id) === String(selectedResume))
  const location = [job?.city, job?.state, job?.country].filter(Boolean).join(", ")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Review your application</h2>
        <p className="text-slate-600">Please review all information before submitting.</p>
      </div>

      <Card><CardContent className="space-y-2 p-6">
        <h3 className="mb-2 font-semibold text-slate-900">Position</h3>
        <Row label="Job title">{job?.title}</Row>
        <Row label="Company">{job?.company?.name}</Row>
        <Row label="Location">{location}</Row>
      </CardContent></Card>

      <Card><CardContent className="space-y-2 p-6">
        <h3 className="font-semibold text-slate-900">Selected resume</h3>
        <p className="text-slate-600">{selected?.title ?? `Resume #${selectedResume}`}</p>
      </CardContent></Card>

      <Card><CardContent className="space-y-2 p-6">
        <h3 className="font-semibold text-slate-900">Cover letter</h3>
        <p className="whitespace-pre-wrap text-slate-600">{coverLetter || "No cover letter"}</p>
      </CardContent></Card>

      <Card><CardContent className="space-y-2 p-6">
        <h3 className="mb-2 font-semibold text-slate-900">Additional information</h3>
        <Row label="Expected salary">{expectedSalary}</Row>
        <Row label="Available from">{availableFrom?.toLocaleDateString?.() ?? availableFrom}</Row>
      </CardContent></Card>
    </div>
  )
}

export default ReviewSubmit
