import { CSSProperties } from "react";
import DashboardFilters from "@/components/app/home/DashboardFilters";
import DashboardHero from "@/components/app/home/DashboardHero";
import KpiCards from "@/components/app/home/KpiCards";
import ClosedRevenueChart from "@/components/app/home/ClosedRevenueChart";
import ObjectionsChart from "@/components/app/home/ObjectionsChart";
import ObjectionRadar from "@/components/app/home/ObjectionRadar";
import ClosersTable from "@/components/app/home/ClosersTable";
import RecentCalls from "@/components/app/home/RecentCalls";

/* Base de cascade par section (positionnel → réordonner ne casse plus rien).
   Chaque composant pose ensuite son --cg-i local, qui s'additionne via CSS. */
const base = (n: number) => ({ "--cg-base": n }) as CSSProperties;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-6">

      {/* 1. En-tête : welcome + filtres */}
      <section style={base(0)}>
        <DashboardFilters />
      </section>

      {/* 2. Verdict : score Closium */}
      <section style={base(2)}>
        <DashboardHero />
      </section>

      {/* 3. KPI de synthèse */}
      <section style={base(4)}>
        <KpiCards />
      </section>

      {/* 4. Diagnostic : les 3 charts côte à côte */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={base(6)}>
        <ClosedRevenueChart />
        <ObjectionsChart />
        <ObjectionRadar />
      </section>

      {/* 5. Closers + appels analysés, côte à côte */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[5fr_4fr]" style={base(9)}>
        <ClosersTable />
        <RecentCalls />
      </section>

    </div>
  );
}
