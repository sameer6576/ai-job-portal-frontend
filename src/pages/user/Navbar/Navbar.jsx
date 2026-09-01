import { Bookmark, Briefcase, FileText, LogOut, ScrollText, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { logout } from "../../../reduxt-store/user/userSlice"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2" to="/">
          <Briefcase />
          <span className="text-xl font-bold text-slate-900">ZOSHIRE</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/jobs"
            className={location.pathname.startsWith("/jobs") ? "text-sm font-medium text-primary" : "text-sm font-medium text-slate-600"}
          >
            Jobs
          </Link>

          {!isAuthenticated || !user ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
              <Button onClick={() => navigate("/register")}>Create account</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.fullName?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </DropdownMenuLabel>
                {user.role === "ROLE_JOB_SEEKER" && (
                  <DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/applications")}><FileText className="mr-2 h-4 w-4" /> My applications</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/saved-jobs")}><Bookmark className="mr-2 h-4 w-4" /> Saved jobs</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/resumes")}><ScrollText className="mr-2 h-4 w-4" /> My resumes</DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => dispatch(logout())}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
