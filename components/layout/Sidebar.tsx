"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  GraduationCap,
  FileText,
  FileUp,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Funcionários",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Avaliações",
    href: "/evaluations",
    icon: ClipboardList,
  },
  {
    title: "Treinamentos",
    href: "/trainings",
    icon: GraduationCap,
  },
  {
    title: "Atestados",
    href: "/medical-leaves",
    icon: FileText,
  },
  {
    title: "Carga em Massa",
    href: "/bulk-import",
    icon: FileUp,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Menu
        </h2>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 