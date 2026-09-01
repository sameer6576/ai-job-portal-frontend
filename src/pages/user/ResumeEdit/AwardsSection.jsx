import { useState } from "react"
import { useDispatch } from "react-redux"
import AddButton from "./shared/AddButton"
import SectionCard from "./shared/SectionCard"
import SectionDialog from "./shared/SectionDialog"
import DeleteConfirm from "./shared/DeleteConfirm"
import FRow from "./shared/FRow"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { toast } from "sonner"
import { addAward, deleteAward, updateAward } from "../../../reduxt-store/resume/resumeThunk"

const EMPTY_AWARD = { title: "", issuedBy: "", awardDate: "", description: "", displayOrder: 0 }

const AwardsSection = ({ resumeId, resume }) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(EMPTY_AWARD)

  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const beginAdd = () => {
    setEditing(null)
    setForm(EMPTY_AWARD)
    setOpen(true)
  }
  const beginEdit = (award) => {
    setEditing(award)
    setForm({ ...EMPTY_AWARD, ...award })
    setOpen(true)
  }
  const save = async () => {
    await dispatch(editing
      ? updateAward({ resumeId, awardId: editing.id, data: form })
      : addAward({ resumeId, data: form })).unwrap()
    toast.success(editing ? "Award updated" : "Award added")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><AddButton onClick={beginAdd} label="Add award" /></div>
      {(resume?.awards ?? []).map((award) => (
        <SectionCard key={award.id} item={award} onEdit={beginEdit} onDelete={setDeleting}>
          <p className="font-semibold text-slate-900">{award.title}</p>
          <p className="text-xs text-slate-600">{award.issuedBy}</p>
          <p className="text-xs text-slate-600">{award.awardDate}</p>
          <p className="text-sm text-slate-500">{award.description}</p>
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={() => setOpen(false)} onSave={save} title={editing ? "Edit award" : "Add award"}>
        <FRow label="Award title *"><Input required value={form.title} onChange={change("title")} /></FRow>
        <FRow label="Issued by"><Input value={form.issuedBy} onChange={change("issuedBy")} /></FRow>
        <FRow label="Award date"><Input type="date" value={form.awardDate ?? ""} onChange={change("awardDate")} /></FRow>
        <FRow label="Description"><Textarea value={form.description} onChange={change("description")} /></FRow>
      </SectionDialog>
      <DeleteConfirm
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await dispatch(deleteAward({ resumeId, awardId: deleting.id })).unwrap()
          toast.success("Award deleted")
        }}
        label="Award"
      />
    </div>
  )
}

export default AwardsSection
