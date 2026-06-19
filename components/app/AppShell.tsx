"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRightFromSquare,
  Bell,
  ChartColumn,
  CircleQuestion,
  CreditCard,
  FileText,
  Gear,
  GraduationCap,
  Headphones,
  House,
  Magnifier,
  Person,
  Persons,
  PlugConnection,
  Receipt,
} from "@gravity-ui/icons";
import {
  Avatar,
  Breadcrumbs,
  Button,
  Dropdown,
  Label,
  Separator,
} from "@heroui/react";
import { AppLayout, Navbar, Sidebar } from "@heroui-pro/react";
import AnimatedWaveIcon from "@/components/AnimatedWaveIcon";
import CloseGuardLogo from "@/components/CloseGuardLogo";
import GlowButton from "@/components/GlowButton";

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
    label: "Pilotage",
    items: [
      { href: "/home", label: "Home", icon: House },
      { href: "/calls", label: "Appels", icon: Headphones, count: 3 },
      { href: "/sources", label: "Sources", icon: ChartColumn },
      { href: "/closers", label: "Closers", icon: Persons },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        href: "/coaching",
        label: "Coaching IA",
        icon: GraduationCap,
        tag: { label: "Nouveau" },
      },
      { href: "/rapports", label: "Rapports", icon: FileText, count: 2 },
      {
        href: "#",
        label: "Intégrations",
        icon: PlugConnection,
        tag: { label: "Bientôt" },
        soon: true,
      },
    ],
  },
  {
    label: "Compte",
    items: [
      {
        href: "/pricing",
        label: "Abonnement",
        icon: CreditCard,
        tag: { label: "Pro" },
      },
      {
        href: "#",
        label: "Facturation",
        icon: Receipt,
        tag: { label: "Bientôt" },
        soon: true,
      },
      { href: "/settings", label: "Réglages", icon: Gear },
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
    <AppLayout
      navigate={router.push}
      sidebarVariant="floating"
      scrollMode="content"
      navbar={
        <AppNavbar
          current={current}
          onAccountAction={(key) => {
            if (key === "sign-out") router.push("/");
            if (key === "account") router.push("/settings");
            if (key === "pricing") router.push("/pricing");
          }}
        />
      }
      sidebar={<AppSidebar currentHref={current.href} />}
    >
      {children}
    </AppLayout>
  );
}

function AppSidebar({ currentHref }: { currentHref: string }) {
  const body = (
    <>
      <Sidebar.Header className="gap-3">
        <div className="flex items-center gap-2 px-1 pt-1">
          <CloseGuardLogo className="h-7 w-auto shrink-0 text-[#000102]" />
          <span className="text-lg font-medium text-foreground">Closeguard</span>
        </div>
        <GlowButton className="w-full" onClick={() => {}}>
          <AnimatedWaveIcon className="size-4" />
          <span data-sidebar="label">Analyser un appel</span>
        </GlowButton>
      </Sidebar.Header>

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
          <Sidebar.MenuItem href="#" id="help" textValue="Aide">
            <Sidebar.MenuIcon>
              <CircleQuestion className="size-4" />
            </Sidebar.MenuIcon>
            <Sidebar.MenuLabel>Aide</Sidebar.MenuLabel>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <Sidebar.Separator />
        <div className="flex items-center gap-2 px-1 py-1">
          <Avatar size="sm">
            <Avatar.Fallback>N</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0" data-sidebar="label">
            <p className="truncate text-sm font-medium text-foreground">Numa</p>
            <p className="truncate text-xs text-muted">Plan Pro</p>
          </div>
        </div>
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

function AppNavbar({
  current,
  onAccountAction,
}: {
  current: NavItem;
  onAccountAction: (key: string) => void;
}) {
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
          <Navbar.Item aria-label="Rechercher">
            <Magnifier className="size-4" />
          </Navbar.Item>
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
          <Navbar.Separator />
          <Dropdown>
            <Button isIconOnly aria-label="Menu du compte" variant="ghost">
              <Avatar className="size-6" color="success" variant="soft">
                <Avatar.Fallback className="text-xs font-semibold">N</Avatar.Fallback>
              </Avatar>
            </Button>
            <Dropdown.Popover className="min-w-[210px]" placement="bottom end">
              <Dropdown.Menu onAction={(key) => onAccountAction(String(key))}>
                <Dropdown.Item id="account" textValue="Compte">
                  <Person className="size-4 text-muted" />
                  <Label>Compte</Label>
                </Dropdown.Item>
                <Dropdown.Item id="pricing" textValue="Abonnement">
                  <CreditCard className="size-4 text-muted" />
                  <Label>Abonnement</Label>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor: "var(--cg-cta-soft-bg)",
                      color: "var(--cg-cta-soft-fg)",
                    }}
                  >
                    Pro
                  </span>
                </Dropdown.Item>
                <Separator />
                <Dropdown.Item id="sign-out" textValue="Déconnexion">
                  <ArrowRightFromSquare className="size-4 text-muted" />
                  <Label>Déconnexion</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </Navbar.Content>
      </Navbar.Header>
    </Navbar>
  );
}
