import ActivityHeatmap from "@/components/app/home/ActivityHeatmap";
import ClientStack from "@/components/app/home/ClientStack";
import HeroBanner from "@/components/app/home/HeroBanner";
import HomeHero from "@/components/app/home/HomeHero";
import KpiRow from "@/components/app/home/KpiRow";
import OverviewHeader from "@/components/app/home/OverviewHeader";
import RevenueChart from "@/components/app/home/RevenueChart";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <HeroBanner />
      <OverviewHeader />

      {/* Score + KPIs */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <HomeHero />
        </div>
        <div className="xl:col-span-8">
          <KpiRow />
        </div>
      </div>

      {/* Revenue + client stack */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RevenueChart />
        <ClientStack />
      </div>

      {/* Closers activity heatmap */}
      <ActivityHeatmap />
    </div>
  );
}
