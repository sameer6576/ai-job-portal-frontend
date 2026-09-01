import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import AuthLaout from "./AuthLaout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { forgotPassword } from "../../reduxt-store/user/userThunk"

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const submit = async (event) => {
    event.preventDefault()
    setError("")
    try {
      setResult(await dispatch(forgotPassword(email)).unwrap())
    } catch (requestError) {
      setError(String(requestError))
    }
  }

  return (
    <AuthLaout
      title="Forgot password"
      description="Enter your email to create a reset link"
      footerText="Remembered it? "
      footerLinkText="Sign in"
      footerLink="/login"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        {result?.message && <p className="text-sm text-slate-600">{result.message}</p>}
        {result?.resetToken && (
          <Link
            className="block text-sm font-medium text-primary hover:underline"
            to={`/reset-password?token=${encodeURIComponent(result.resetToken)}`}
          >
            Reset password now
          </Link>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-full" type="submit">Create reset link</Button>
      </form>
    </AuthLaout>
  )
}

export default ForgotPassword
