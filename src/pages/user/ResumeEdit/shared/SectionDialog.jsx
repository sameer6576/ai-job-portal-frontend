import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'

const SectionDialog = ({title,children,open,onClose,onSave}) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      onClose()
    } catch (error) {
      toast.error(typeof error === "string" ? error : error?.message || "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose() }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {title}
                </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
                {children}
            </div>
            <DialogFooter>
                <Button variant='outline' onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default SectionDialog
