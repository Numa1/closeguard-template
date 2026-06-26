"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Scope, TEAM_SCOPE } from "@/components/app/home/data";

interface MemberCtx {
  scope: Scope;
  setScope: (s: Scope) => void;
}

const Ctx = createContext<MemberCtx | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [scope, setScope] = useState<Scope>(TEAM_SCOPE);
  return <Ctx.Provider value={{ scope, setScope }}>{children}</Ctx.Provider>;
}

export function useMember() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMember must be used within MemberProvider");
  return c;
}
