import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import "./App.css"
import UserLayout from "./Layout/UserLayout"
import EmployerLayout from "./Layout/EmployerLayout"
import Jobs from "./pages/user/jobs/Jobs"
import JobDetails from "./pages/user/jobs/JobDetails"
import ApplyJob from "./pages/user/ApplyNow/ApplyJob"
import Application from "./pages/user/Applications/Application"
import SavedJobs from "./pages/user/SavedJob/SavedJobs"
import Profile from "./pages/user/Profile/Profile"
import Resumes from "./pages/user/Resumes/Resumes"
import ResumeEdit from "./pages/user/ResumeEdit/ResumeEdit"
import Dashboard from "./pages/employer/Dashboard/Dashboard"
import EmployerJobs from "./pages/employer/Jobs/EmployerJobs"
import CreateJob from "./pages/employer/Jobs/CreateJob"
import EmployerApplications from "./pages/employer/Applicaton/EmployerApplications"
import AIScreening from "./pages/employer/AIScreening/AIScreening"
import CompanyProfile from "./pages/employer/CompanyProfile/CompanyProfile"
import AdminLayout from "./pages/admin/layout/AdminLayout"
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard"
import AdminProfile from "./pages/admin/settings/AdminProfile"
import AdminUsers from "./pages/admin/users/AdminUsers"
import Companies from "./pages/admin/companies/Companies"
import JobMetaData from "./pages/admin/jobmetadata/JobMetaData"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ForgotPassword from "./pages/Auth/ForgotPassword"
import ResetPassword from "./pages/Auth/ResetPassword"
import { fetchCurrentUser } from "./reduxt-store/user/userThunk"

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  if (isLoading && localStorage.getItem("accessToken")) return null
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("accessToken")) dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Jobs />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute roles={["ROLE_JOB_SEEKER"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/apply/:id" element={<ApplyJob />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applications" element={<Application />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/resumes/:id/edit" element={<ResumeEdit />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["ROLE_EMPLOYER"]} />}>
        <Route element={<EmployerLayout />}>
          <Route path="/employer/dashboard" element={<Dashboard />} />
          <Route path="/employer/jobs" element={<EmployerJobs />} />
          <Route path="/employer/jobs/create" element={<CreateJob />} />
          <Route path="/employer/jobs/:jobId/edit" element={<CreateJob isEdit />} />
          <Route path="/employer/applications" element={<EmployerApplications />} />
          <Route path="/employer/ai-screening" element={<AIScreening />} />
          <Route path="/employer/company" element={<CompanyProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/companies" element={<Companies />} />
          <Route path="/admin/job-meta" element={<JobMetaData />} />
          <Route path="/admin/settings" element={<AdminProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
