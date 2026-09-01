import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useState } from "react";
import { useEffect } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useDispatch } from "react-redux";
import { createSkill, updateSkill } from "../../../reduxt-store/jobMeta/jobMetaThunk";

const SKILL_CATEGORIES = [
  "PROGRAMMING_LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "CLOUD_PLATFORM",
  "DEVOPS",
  "DESIGN",
  "SOFT_SKILL",
  "TOOL",
  "LANGUAGE",
  "OTHER",
];
const SkillFormDialog = ({
  isEdit,
  open,
  onClose,
  initialData,
  
}) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
  });
  const dispatch=useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(initialData
        ? updateSkill({ id: initialData.id, ...form })
        : createSkill(form)).unwrap();
      onClose();
    } catch {
      // The global API interceptor displays the backend error.
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Reset the controlled form whenever a different dialog record opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: initialData?.name ?? "",
        category: initialData?.category ?? ""
   
      });
    }
    console.log("intialdata ",initialData?.category)
  }, [open, initialData]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Category" : "Add Skill"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Name <span>*</span>
            </Label>
            <Input
              placeholder="e.g Software Engineering"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Category
            </Label>
            <Select
            value={form.category}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, category: value }))
              }
            >
              <SelectTrigger className="text-sm w-full">
                <SelectValue placeholder="category" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((item) => (
                  <SelectItem key={item.id} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              className={"flex-1"}
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className={"flex-1"} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Skill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillFormDialog;
