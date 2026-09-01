import { useState } from "react"
import { useDispatch } from "react-redux"
import AddButton from "./shared/AddButton"
import SectionCard from "./shared/SectionCard"
import SectionDialog from "./shared/SectionDialog"
import DeleteConfirm from "./shared/DeleteConfirm"
import FRow from "./shared/FRow"
import { Input } from "../../../components/ui/input"
import { addCertification, deleteCertification, updateCertification } from "../../../reduxt-store/resume/resumeThunk"

const EMPTY_CERTIFICATION = {
  name: "",
  issuingOrganization: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  displayOrder: 0,
}

const CertificationsSection = ({ resumeId, resume }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(EMPTY_CERTIFICATION)

  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const beginAdd = () => {
    setEditing(null)
    setForm(EMPTY_CERTIFICATION)
    setOpen(true)
  }
  const beginEdit = (certification) => {
    setEditing(certification)
    setForm({ ...EMPTY_CERTIFICATION, ...certification })
    setOpen(true)
  }
  const save = async () => {
    const data = { ...form, expiryDate: form.expiryDate || null }
    await dispatch(editing
      ? updateCertification({ resumeId, certificationId: editing.id, data })
      : addCertification({ resumeId, data })).unwrap()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><AddButton onClick={beginAdd} label="Add certification" /></div>
      {(resume?.certifications ?? []).map((certification) => (
        <SectionCard key={certification.id} item={certification} onEdit={beginEdit} onDelete={setDeleting}>
          <p className="font-semibold text-slate-900">{certification.name}</p>
          <p className="text-xs text-slate-600">{certification.issuingOrganization}</p>
          <p className="text-xs text-slate-600">{certification.issueDate}{certification.expiryDate ? ` – ${certification.expiryDate}` : ""}</p>
          {certification.credentialUrl && <a className="text-sm text-primary hover:underline" href={certification.credentialUrl} target="_blank" rel="noreferrer">Verify credential</a>}
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={() => setOpen(false)} onSave={save} title={editing ? "Edit certification" : "Add certification"}>
        <FRow label="Certification name *"><Input required value={form.name} onChange={change("name")} /></FRow>
        <FRow label="Issuing organization"><Input value={form.issuingOrganization} onChange={change("issuingOrganization")} /></FRow>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FRow label="Issue date"><Input type="date" value={form.issueDate ?? ""} onChange={change("issueDate")} /></FRow>
          <FRow label="Expiry date"><Input type="date" value={form.expiryDate ?? ""} onChange={change("expiryDate")} /></FRow>
          <FRow label="Credential ID"><Input value={form.credentialId} onChange={change("credentialId")} /></FRow>
          <FRow label="Credential URL"><Input type="url" value={form.credentialUrl} onChange={change("credentialUrl")} /></FRow>
        </div>
      </SectionDialog>
      <DeleteConfirm
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await dispatch(deleteCertification({ resumeId, certificationId: deleting.id })).unwrap()
        }}
        label="Certification"
      />
    </div>
  )
}

export { CertificationsSection }
