import React from "react";
import { useRouter } from "next/router";
import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    name: "Dashboard",
    href: "/regula",
    icon: LayoutGrid,
  },
  {
    name: "My Plan",
    href: "/regula/my-plan",
    icon: List,
  },
];

export function StudySidebar() {
  const router = useRouter();

  return (
    <aside className="h-full w-60 border-r bg-white pt-8">
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors
                ${
                  isActive
                    ? "bg-gray-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default StudySidebar;
