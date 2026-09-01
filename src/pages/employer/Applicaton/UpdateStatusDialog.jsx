import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useDispatch } from "react-redux";
import { updateApplicationStatus } from "../../../reduxt-store/application/applicationThunk";
import { useState } from "react";

const STATUSES = [
  { value: "PENDING", label: "Pending", color: "text-slate-600" },
  { value: "REVIEWING", label: "Reviewing", color: "text-primary" },
  { value: "SHORTLISTED", label: "Shortlisted", color: "text-indigo-600" },
  {
    value: "INTERVIEW_SCHEDULED",
    label: "Interview Scheduled",
    color: "text-violet-600",
  },
  { value: "REJECTED", label: "Rejected", color: "text-red-600" },
  { value: "HIRED", label: "Hired", color: "text-emerald-600" },
];
const UpdateStatusDialog = ({
  open,
  onClose,
  applicationId,
  currentStatus,
}) => {
    const [status,setStatus]=useState(currentStatus || "")
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch=useDispatch();

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        await dispatch(updateApplicationStatus({
            id:applicationId,
            status,
            note:"employer update status"
        })).unwrap();
        onClose();
      } catch {
        // The global API interceptor displays the backend error.
      } finally {
        setIsSubmitting(false);
      }
    }
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-4">
            <Label>New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="text-sm w-full">
                <SelectValue placeholder="select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !status}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
