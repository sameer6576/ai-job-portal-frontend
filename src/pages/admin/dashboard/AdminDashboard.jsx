import { Building2 } from "lucide-react";
import { Users } from "lucide-react";
import { UserRoundSearch, UserCog } from "lucide-react";
import StatsCard from "./StatsCard";
import UserTable from "../users/UserTable";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllUsers } from "../../../reduxt-store/adminUser/adminThunk";
import { useDispatch } from "react-redux";
import { fetchAllCompanies } from "../../../reduxt-store/company/companyThunk";




const AdminDashboard = () => {
  const {users}=useSelector(state=>state.adminUser)
  const {companies}=useSelector(state=>state.company)
  const dispatch=useDispatch()
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
  {
    title: "Total Users",
    value: users?.length || 0,
    icon: Users,
    color: "blue",
    description: "Registered accounts",
  },
  {
    title: "Job Seekers",
    value: users?.filter((user) => user.role === "ROLE_JOB_SEEKER").length || 0,
    icon: UserRoundSearch,
    color: "green",
    description: "Candidate accounts",
  },
  {
    title: "Companies",
    value: companies?.length || 0,
    icon: Building2,
    color: "purple",
    description: "Registered companies",
  },
  {
    title: "Employers",
    value: users?.filter((user) => user.role === "ROLE_EMPLOYER").length || 0,
    icon: UserCog,
    color: "orange",
    description: "Employer accounts",
  },
];

 useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">{today}</p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((state)=><StatsCard key={state.title} {...state}/>)}
      </div>
      <UserTable users={users}/>
    </div>
  );
};

export default AdminDashboard;
