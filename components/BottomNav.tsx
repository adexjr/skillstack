"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/practice", label: "Practice", icon: CodeIcon },
  { href: "/leaderboard", label: "Ranks", icon: TrophyIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-base-700 bg-base-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:bottom-auto md:top-0 md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-around px-2 py-2 md:justify-end md:px-8 md:py-4">
        {TABS.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex min-w-[64px] flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition md:flex-row md:gap-2 md:px-4 md:py-2"
            >
              <Icon active={isActive} />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-mint-400" : "text-ink-500"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11.5L12 4l9 7.5M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"
        stroke={active ? "#7FFFB0" : "#7B8496"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 6L2 12l6 6M16 6l6 6-6 6"
        stroke={active ? "#7FFFB0" : "#7B8496"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 6H4a2 2 0 002 4M17 6h3a2 2 0 01-2 4"
        stroke={active ? "#7FFFB0" : "#7B8496"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6"
        stroke={active ? "#7FFFB0" : "#7B8496"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}