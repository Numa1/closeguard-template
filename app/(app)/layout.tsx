import { ReactNode } from "react";
import AppShell from "@/components/app/AppShell";
import LoadingScreen from "@/components/app/LoadingScreen";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <AppShell>{children}</AppShell>
    </>
  );
}
