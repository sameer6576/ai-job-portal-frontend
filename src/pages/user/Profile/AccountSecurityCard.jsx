import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../../../reduxt-store/user/userThunk";

const AccountSecurityCard = ({ user }) => {
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(changePassword(passwords)).unwrap();
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (error) {
      setMessage(error);
    }
  };
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className={"pb-3"}>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-brand" /> Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className={"space-y-5"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* full name */}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Role
            </Label>

            <p className="text-sm text-slate-600 py-2">{user?.role}</p>
          </div>

          {/* email */}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Account Status:
            </Label>

            <p className="text-sm text-slate-600 py-2">{user?.status}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* phone */}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Sign-in Method:
            </Label>

            <p className="text-sm text-slate-600 py-2">Email & Password</p>
          </div>

      

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Email Verified:
            </Label>

            <p>Not Verified</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3 border-t border-slate-200 pt-4">
          <h3 className="font-semibold text-slate-800">Change password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input type="password" required placeholder="Current password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} />
            <Input type="password" required minLength={8} placeholder="New password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} />
          </div>
          {message && <p className="text-sm text-slate-600">{message}</p>}
          <Button type="submit">Change password</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSecurityCard;
