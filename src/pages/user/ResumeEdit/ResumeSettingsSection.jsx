import FRow from './shared/FRow'
import { Input } from '../../../components/ui/input'
import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { updateResumeTitle } from '../../../reduxt-store/resume/resumeThunk'
import { useEffect } from 'react'

const ResumeSettingsSection = ({ resumeId, resume }) => {
  const [title,setTitle]=useState("")
  const dispatch=useDispatch()

  const handleSave=()=>{
    dispatch(updateResumeTitle({ resumeId, title }))
  }
  useEffect(() => {
    // Synchronize local input when another resume is loaded.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(resume?.title ?? "")
  }, [resume?.title])
  return (
    <div className='space-y-5'>
      <FRow label="Resume Title">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          placeholder="e.g. Backend Engineer Resume"
        />
        <p className="text-xs text-slate-400 mt-1">{title.length}/150</p>
      </FRow>

      <Button  onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  )
}

export default ResumeSettingsSection