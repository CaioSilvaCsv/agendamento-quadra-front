"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { NavItemInterface } from "@/hooks/use-navItems";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavItem from "./header/nav-item";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const items: NavItemInterface[] = [
    { url: "/quadras", label: "Início" },
    { url: "/dashboard", label: "Painel" },
    { url: "/login", label: "Login" },
  ];

  const { logout } = useAuth();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  return (
    <header className="shadow-lg bg-background">
      <nav
        className="px-4 py-2 flex items-center justify-between max-w-
            screen-xl mx-auto border-b border-solid"
      >
        <Link href="/quadras" className="flex items-center gap-2">
          <Image
            src="/icon.svg"
            width={40}
            height={40}
            alt="Logo do QuadraFácil"
            className="w-10 h-10 object-cover"
          />
          <span className="text-xl font-semibold text-primary-foreground hidden md:inline-block">
            QuadraFácil
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {items.map((item, i) => (
            <NavItem
              key={i}
              url={item.url}
              label={item.label}
              isActive={pathname === item.url}
            />
          ))}
          <Separator orientation="vertical" className="h-6" />
        </ul>

        {/* Mobile nav toggle */}
        {isMobile && (
          <Popover.Root
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          >
            <Popover.Trigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                {isMobileMenuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="end"
                className={cn(
                  "z-50 w-[200px] rounded-md border bg-popover p-4 shadow-md",
                  "flex flex-col gap-4"
                )}
              >
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <NavItem
                      key={i}
                      url={item.url}
                      label={item.label}
                      isActive={pathname === item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </ul>
                <Separator />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )}
      </nav>
    </header>
  );
}
