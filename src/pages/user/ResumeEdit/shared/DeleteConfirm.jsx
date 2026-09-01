import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "../../../../components/ui/alert-dialog";


const DeleteConfirm = ({ label, onConfirm, onClose, open }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async (event) => {
    // Radix closes the dialog on action click; keep it open until the API succeeds.
    event.preventDefault();
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || `Failed to delete ${label}`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
     
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            {label}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirm;
