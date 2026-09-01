import SatateCard from "../../employer/Applicaton/SatateCard";
import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { Clock } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Ban } from "lucide-react";
import CompanyFilter from "./CompanyFilter";
import CompanyTable from "./CompanyTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCompanies } from "../../../reduxt-store/company/companyThunk";

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, isLoading, error } = useSelector((state) => state.company);
  const [filters, setFilters] = useState({});
  useEffect(() => {
    dispatch(fetchAllCompanies(filters));
  }, [dispatch, filters]);
  const stats = useMemo(() => {
    const total = companies.length;
    const pending = companies.filter(
      (c) => c.status === "PENDING_VERIFICATION",
    ).length;
    const active = companies.filter((c) => c.status === "ACTIVE").length;
    const suspended = companies.filter((c) => c.status === "SUSPENDED").length;
    const rejected = companies.filter((c) => c.status === "REJECTED").length;
    return { total, pending, active, suspended, rejected };
  }, [companies]);

  const summaryCards = [
    {
      label: "Total Companies",
      value: stats.total,
      icon: Building2,
      color: "text-brand bg-blue-50",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Active & Verified",
      value: stats.active,
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: Ban,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Company Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, verify, and manage all registered companies
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <SatateCard
            key={index}
            label={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </section>
      <CompanyFilter
        onStatusFilter={(value) => setFilters((current) => ({ ...current, companyStatus: value === "all" ? undefined : value }))}
        onTypeFilter={(value) => setFilters((current) => ({ ...current, companyType: value === "all" ? undefined : value }))}
        onIndustryFilter={(value) => setFilters((current) => ({ ...current, industryType: value === "all" ? undefined : value }))}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {isLoading && companies.length === 0 ? <p className="text-sm text-slate-500">Loading companies…</p> : <CompanyTable companies={companies}/>}
    </div>
  );
};

export default Companies;
