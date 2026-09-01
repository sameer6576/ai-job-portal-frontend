import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Check, User } from "lucide-react"
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

const PersonalInfoSection = ({ resumeId, resume }) => {
  const dispatch = useDispatch()
  const [form, setForm] = useState(EMPTY_INFO)

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
  }

  const initials = `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`

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
        <FRow label="LinkedIn URL"><Input type="url" value={form.linkedinUrl} onChange={update("linkedinUrl")} /></FRow>
        <FRow label="GitHub URL"><Input type="url" value={form.githubUrl} onChange={update("githubUrl")} /></FRow>
        <FRow label="Portfolio URL"><Input type="url" value={form.portfolioUrl} onChange={update("portfolioUrl")} /></FRow>
        <FRow label="Website URL"><Input type="url" value={form.websiteUrl} onChange={update("websiteUrl")} /></FRow>
      </div>

      <Button onClick={() => dispatch(updatePersonalInfo({ resumeId, data: form }))}>
        <Check className="mr-1.5 h-4 w-4" /> Save personal info
      </Button>
    </div>
  )
}

export default PersonalInfoSection
