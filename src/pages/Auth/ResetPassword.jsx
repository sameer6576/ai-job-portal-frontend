import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLaout from "./AuthLaout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { resetPassword } from "../../reduxt-store/user/userThunk";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(resetPassword({ token: params.get("token"), password })).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <AuthLaout title="Reset password" description="Choose a new password" footerText="Back to " footerLinkText="sign in" footerLink="/login">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <Button className="w-full" type="submit" disabled={!params.get("token")}>Reset password</Button>
      </form>
    </AuthLaout>
  );
};

export default ResetPassword;
