import { Label } from '../../../../components/ui/label'

const FRow = ({label, children, error}) => {
  return (
    <div className='space-y-1'>
        <Label className={"text-xs text-slate-500"}>
            {label}
        </Label>
        {children}
        {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default FRow