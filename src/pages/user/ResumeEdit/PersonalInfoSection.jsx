import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Check, User } from "lucide-react"
import { notifyError } from "../../../lib/notifications"
import FRow from "./shared/FRow"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { updatePersonalInfo } from "../../../reduxt-store/resume/resumeThunk"

const EMPTY_INFO = {
  firstName: "",
  lastName: "",
  headline: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
}

const URL_FIELDS = {
  linkedinUrl: { label: "LinkedIn URL", hostname: /(^|\.)linkedin\.com$/i },
  githubUrl: { label: "GitHub URL", hostname: /(^|\.)github\.com$/i },
  portfolioUrl: { label: "Portfolio URL" },
  websiteUrl: { label: "Website URL" },
}

const validateUrl = (value, { label, hostname }) => {
  if (!value.trim()) return ""

  try {
    const parsed = new URL(value)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return `${label} must start with http:// or https://`
    }
    if (hostname && !hostname.test(parsed.hostname)) {
      return `Enter a valid ${label}`
    }
    return ""
  } catch {
    return `Enter a valid ${label}`
  }
}

const PersonalInfoSection = ({ resumeId, resume }) => {
  const dispatch = useDispatch()
  const { isActionLoading } = useSelector((store) => store.resume)
  const [form, setForm] = useState(EMPTY_INFO)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const personalInfo = resume?.personalInfoResponse ?? resume?.personalInfo
    if (personalInfo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(Object.fromEntries(
        Object.keys(EMPTY_INFO).map((key) => [key, personalInfo[key] ?? ""]),
      ))
    }
  }, [resume])

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    if (URL_FIELDS[key]) {
      setErrors((current) => ({ ...current, [key]: "" }))
    }
  }

  const initials = `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`

  const handleSubmit = async () => {
    const urlErrors = Object.fromEntries(
      Object.entries(URL_FIELDS).map(([key, config]) => [
        key,
        validateUrl(form[key], config),
      ]),
    )
    setErrors(urlErrors)

    if (Object.values(urlErrors).some(Boolean)) {
      notifyError("Please correct the invalid URLs");
      return
    }

    try {
      await dispatch(updatePersonalInfo({ resumeId, data: form })).unwrap()
    } catch (error) {
      notifyError(error || "Failed to save personal information")
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-500">
          {initials || <User className="h-8 w-8" />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FRow label="First name"><Input value={form.firstName} onChange={update("firstName")} /></FRow>
        <FRow label="Last name"><Input value={form.lastName} onChange={update("lastName")} /></FRow>
      </div>
      <FRow label="Professional headline"><Input value={form.headline} onChange={update("headline")} /></FRow>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FRow label="Email"><Input type="email" value={form.email} onChange={update("email")} /></FRow>
        <FRow label="Phone"><Input value={form.phone} onChange={update("phone")} /></FRow>
        <FRow label="City"><Input value={form.city} onChange={update("city")} /></FRow>
        <FRow label="Country"><Input value={form.country} onChange={update("country")} /></FRow>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FRow label="LinkedIn URL" error={errors.linkedinUrl}><Input type="url" value={form.linkedinUrl} onChange={update("linkedinUrl")} aria-invalid={Boolean(errors.linkedinUrl)} /></FRow>
        <FRow label="GitHub URL" error={errors.githubUrl}><Input type="url" value={form.githubUrl} onChange={update("githubUrl")} aria-invalid={Boolean(errors.githubUrl)} /></FRow>
        <FRow label="Portfolio URL" error={errors.portfolioUrl}><Input type="url" value={form.portfolioUrl} onChange={update("portfolioUrl")} aria-invalid={Boolean(errors.portfolioUrl)} /></FRow>
        <FRow label="Website URL" error={errors.websiteUrl}><Input type="url" value={form.websiteUrl} onChange={update("websiteUrl")} aria-invalid={Boolean(errors.websiteUrl)} /></FRow>
      </div>

      <Button onClick={handleSubmit} disabled={isActionLoading}>
        <Check className="mr-1.5 h-4 w-4" />
        {isActionLoading ? "Saving..." : "Save personal info"}
      </Button>
    </div>
  )
}

export default PersonalInfoSection
