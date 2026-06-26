"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  ChartColumn,
  CircleQuestion,
  CreditCard,
  FileText,
  Gear,
  Headphones,
  House,
  Person,
  Persons,
  PlugConnection,
} from "@gravity-ui/icons";
import {
  Breadcrumbs,
  Button,
  Dropdown,
  Label,
} from "@heroui/react";
import { AppLayout, Navbar, Sidebar, useSidebar } from "@heroui-pro/react";
import { I18nProvider } from "react-aria-components";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import { Clock } from "@/components/app/Clock";
import ClosiumLogo from "@/components/ClosiumLogo";
import GlowButton from "@/components/GlowButton";
import { GooeyInput } from "@/components/effects/GooeyInput";
import { MemberProvider, useMember } from "@/components/app/MemberContext";
import { SCOPES } from "@/components/app/home/data";

interface NavItem {
  href: string;
  label: string;
  icon: typeof House;
  count?: number;
  tag?: { label: string };
  soon?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/home", label: "Dashboard", icon: House },
      { href: "/calls", label: "Call analysis", icon: Headphones, count: 3 },
      { href: "/planning", label: "Planning", icon: Calendar },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/sources", label: "Sources", icon: ChartColumn },
      { href: "/closers", label: "Closers", icon: Person },
      { href: "/rapports", label: "Reports", icon: FileText, tag: { label: "Pro" } },
    ],
  },
  {
    label: "Revenue & team",
    items: [
      { href: "/payments", label: "Payment tracking", icon: CreditCard },
      { href: "/team", label: "Team access", icon: Persons },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/tools", label: "Tools", icon: PlugConnection },
      { href: "/settings", label: "Settings", icon: Gear },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const current =
    ALL_ITEMS.find((i) => i.href !== "#" && pathname.startsWith(i.href)) ??
    ALL_ITEMS[0];

  return (
    <MemberProvider>
      <I18nProvider locale="en-US">
        <AppLayout
          navigate={router.push}
          sidebarVariant="floating"
          scrollMode="content"
          navbar={<AppNavbar current={current} />}
          sidebar={<AppSidebar currentHref={current.href} />}
        >
          {children}
        </AppLayout>
      </I18nProvider>
    </MemberProvider>
  );
}

function SidebarHeader() {
  const { isOpen } = useSidebar();
  return (
    <Sidebar.Header className="gap-3">
      {/* Logo */}
      <div className={`flex items-center px-1 pt-1 ${!isOpen ? "justify-center" : "justify-center gap-2"}`}>
        <ClosiumLogo className="h-7 w-auto shrink-0 text-[#000102]" />
        {isOpen && (
          <span className="text-lg font-medium text-foreground">Closium</span>
        )}
      </div>

      {/* Analyze a call */}
      {!isOpen ? (
        <button
          type="button"
          className="mx-auto flex size-9 items-center justify-center rounded-full"
          style={{ backgroundColor: "#72fa91", color: "#04210f" }}
        >
          <AnimatedWaveIcon className="size-4" />
        </button>
      ) : (
        <GlowButton className="w-full" onClick={() => {}}>
          <AnimatedWaveIcon className="size-4" />
          <span>Analyze a call</span>
        </GlowButton>
      )}
    </Sidebar.Header>
  );
}

function AppSidebar({ currentHref }: { currentHref: string }) {
  const body = (
    <>
      <SidebarHeader />

      <Sidebar.Content>
        {NAV_GROUPS.map((group) => (
          <Sidebar.Group key={group.label}>
            <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
            <Sidebar.Menu aria-label={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Sidebar.MenuItem
                    key={item.label}
                    id={item.label}
                    textValue={item.label}
                    href={item.soon ? undefined : item.href}
                    isCurrent={item.href === currentHref}
                    isDisabled={item.soon}
                  >
                    <Sidebar.MenuIcon>
                      <Icon className="size-4" />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
                    {item.tag && (
                      <Sidebar.MenuChip>
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                          style={
                            item.soon
                              ? { backgroundColor: "#f3f4f6", color: "#9ca3af" }
                              : {
                                  backgroundColor: "var(--cg-cta-soft-bg)",
                                  color: "var(--cg-cta-soft-fg)",
                                }
                          }
                        >
                          {item.tag.label}
                        </span>
                      </Sidebar.MenuChip>
                    )}
                    {item.count != null && (
                      <Sidebar.MenuChip>
                        <span
                          className="inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums"
                          style={{
                            backgroundColor: "var(--cg-cta)",
                            color: "var(--cg-cta-fg)",
                          }}
                        >
                          {item.count}
                        </span>
                      </Sidebar.MenuChip>
                    )}
                  </Sidebar.MenuItem>
                );
              })}
            </Sidebar.Menu>
          </Sidebar.Group>
        ))}
      </Sidebar.Content>

      <Sidebar.Footer>
        <Sidebar.Menu aria-label="Aide">
          <Sidebar.MenuItem href="#" id="help" textValue="Help">
            <Sidebar.MenuIcon>
              <CircleQuestion className="size-4" />
            </Sidebar.MenuIcon>
            <Sidebar.MenuLabel>Help</Sidebar.MenuLabel>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <Sidebar.Separator />
        <MemberSwitcher />
      </Sidebar.Footer>
      <Sidebar.Rail />
    </>
  );

  return (
    <>
      <Sidebar>{body}</Sidebar>
      <Sidebar.Mobile>{body}</Sidebar.Mobile>
    </>
  );
}

function MemberIcon({ isTeam }: { isTeam: boolean }) {
  const Icon = isTeam ? Persons : Person;
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full"
      style={{
        backgroundColor: isTeam ? "rgba(100,116,139,0.14)" : "rgba(114,250,145,0.2)",
        color: isTeam ? "#64748b" : "#0b5c2e",
      }}
    >
      <Icon className="size-4" />
    </span>
  );
}

function ChevronsIcon() {
  return (
    <svg className="size-3.5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
}

function MemberSwitcher() {
  const { scope, setScope } = useMember();
  return (
    <Dropdown>
      <Button
        aria-label="Switch active member"
        className="h-auto w-full justify-start gap-2 px-1 py-1.5"
        variant="ghost"
      >
        <MemberIcon isTeam={scope.isTeam} />
        <div className="min-w-0 flex-1 text-left" data-sidebar="label">
          <p className="truncate text-sm font-medium text-foreground">{scope.label}</p>
          <p className="truncate text-xs text-muted">{scope.sublabel}</p>
        </div>
        <span data-sidebar="label">
          <ChevronsIcon />
        </span>
      </Button>
      <Dropdown.Popover className="min-w-[240px]" placement="top start">
        <Dropdown.Menu
          onAction={(key) => {
            const s = SCOPES.find((x) => x.id === String(key));
            if (s) setScope(s);
          }}
        >
          {SCOPES.map((s) => (
            <Dropdown.Item key={s.id} id={s.id} textValue={s.label}>
              <MemberIcon isTeam={s.isTeam} />
              <div className="min-w-0">
                <Label className="block truncate">{s.label}</Label>
                <span className="block truncate text-xs text-muted">{s.sublabel}</span>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function AppNavbar({ current }: { current: NavItem }) {
  const CurrentIcon = current.icon;
  return (
    <Navbar maxWidth="full">
      <Navbar.Header>
        <AppLayout.MenuToggle />
        <Sidebar.Trigger />
        <Breadcrumbs className="min-w-0">
          <Breadcrumbs.Item className="min-w-0 font-semibold">
            <span className="flex min-w-0 items-center gap-2 overflow-hidden">
              <CurrentIcon className="size-4" />
              <span className="truncate">{current.label}</span>
            </span>
          </Breadcrumbs.Item>
        </Breadcrumbs>
        <Navbar.Spacer />
        <Navbar.Content>
          <div className="mr-1 hidden items-center sm:flex" aria-label="Current time">
            <Clock />
          </div>
          <GooeyInput
            placeholder="Search calls…"
            collapsedWidth={42}
            expandedWidth={220}
            expandedOffset={40}
          />
          <Navbar.Item aria-label="Notifications">
            <span className="relative inline-flex">
              <Bell className="size-4" />
              <span
                className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: "var(--cg-cta)", color: "var(--cg-cta-fg)" }}
              >
                3
              </span>
            </span>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar.Header>
    </Navbar>
  );
}
