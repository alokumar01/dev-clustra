"use client";

import {
  Boxes,
  CircleUserRoundIcon,
  ExternalLink,
  LogOutIcon,
  MessageSquare,
  PhoneCallIcon,
  Settings2,
  UserRoundPlusIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";

export default function Sidebar({ activeIcon, onIconClick }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const primaryNavigation = [
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
    },
    {
      id: "groups",
      icon: Users,
      label: "Groups",
    },
    {
      id: "calls",
      icon: PhoneCallIcon,
      label: "Calls",
    },
  ];

  const actionNavigation = [
    {
      id: "invite",
      icon: UserRoundPlusIcon,
      label: "Invite",
    },
    {
      id: "tempchat",
      icon: ExternalLink,
      label: "Temp Chat",
      href: "/session",
    },
  ];

  const personalNavigation = [
    {
      id: "profile",
      icon: CircleUserRoundIcon,
      label: "Profile",
    },
    {
      id: "settings",
      icon: Settings2,
      label: "Settings",
    },
  ];

  const handleNavigation = (item) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    onIconClick(item.id);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const renderNavigationGroup = (items) =>
    items.map((item) => {
      const Icon = item.icon;

      // Items that open a new tab should never appear active.
      const isActive = !item.href && activeIcon === item.id;

      return (
        <Button
          key={item.id}
          type="button"
          variant="ghost"
          onClick={() => handleNavigation(item)}
          title={item.label}
          aria-label={item.label}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "size-10 rounded-xl p-0",
            "cursor-pointer",
            "text-sidebar-foreground/60",
            "transition-colors duration-150",
            "hover:bg-sidebar-accent",
            "hover:text-sidebar-accent-foreground",
            "focus-visible:ring-2",
            "focus-visible:ring-sidebar-ring",

            isActive && [
              "bg-sidebar-accent",
              "text-sidebar-primary",
              "hover:bg-sidebar-accent",
              "hover:text-sidebar-primary",
            ]
          )}
        >
          <Icon
            className="size-[19px]"
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        </Button>
      );
    });

  return (
    <aside
      className={cn(
        "hidden h-full w-16 shrink-0 md:flex",
        "flex-col items-center",
        "border-r border-sidebar-border",
        "bg-sidebar",
        "py-3"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "mb-5 flex size-10 items-center justify-center",
          "rounded-xl",
          "text-sidebar-primary"
        )}
        title="DevClustra"
        aria-label="DevClustra"
      >
        <Boxes
          className="size-6"
          strokeWidth={1.8}
        />
      </div>

      {/* Navigation */}
      <nav
        className="flex flex-1 flex-col items-center"
        aria-label="Chat navigation"
      >
        {/* Primary */}
        <div className="flex flex-col items-center gap-1">
          {renderNavigationGroup(primaryNavigation)}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col items-center gap-1">
          {renderNavigationGroup(actionNavigation)}
        </div>

        {/* Personal */}
        <div className="mt-5 flex flex-col items-center gap-1">
          {renderNavigationGroup(personalNavigation)}
        </div>
      </nav>

      {/* Account */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleLogout}
        title="Logout"
        aria-label="Logout"
        className={cn(
          "size-10 rounded-xl p-0",
          "cursor-pointer",
          "text-sidebar-foreground/60",
          "transition-colors duration-150",
          "hover:bg-destructive/10",
          "hover:text-destructive",
          "focus-visible:ring-2",
          "focus-visible:ring-sidebar-ring"
        )}
      >
        <LogOutIcon
          className="size-[19px]"
          strokeWidth={1.8}
        />
      </Button>
    </aside>
  );
}
