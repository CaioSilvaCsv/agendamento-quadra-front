'use client'
import { useIsMobile } from "@/hooks/use-mobile";
import { NavItemInterface } from "@/hooks/use-navItems";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavItem from "./ui/nav-item";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';


export default function Navbar() {

    const items: NavItemInterface[] = [
        { url: "/", label: "Inicio" },
        { url: "/quadras", label: "Quadras" },
        { url: "/dashboard", label: "Painel" },
        { url: "/contacts", label: "Contatos" },
    ]

    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!isMobile) {
            setIsMobileMenuOpen(false)
        }
    }, [isMobile]);

    return (
        <header className="shadow-lg bg-background">
            <nav className="px-4 py-2 flex items-center justify-between max-w-
            screen-xl mx-auto border-b border-solid">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="icon.svg"
                        width={50}
                        height={50}
                        alt="Logo do andamento de quadras"
                        className="w-12 h-12 object-cover"
                    />
                    <h1>Agendamento <br/> Quadra</h1>
                </Link>

                {/* Desktop Navigation*/}
                <ul className="hidden md:flex gap-8 items-center list-none">
                    {items.map((item, index) => (
                        <NavItem
                            key={index}
                            url={item.url}
                            label={item.label}
                            isActive={pathname === item.url}
                        />
                    ))}
                </ul>

                {/* Mobile Navigation*/}
                {isMobile && (
                    <Popover.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <Popover.Trigger asChild>
                            <button aria-label="Toggle-menu">
                                {isMobileMenuOpen ? (
                                    <Cross2Icon className="w-6 h-6" />
                                ) : (
                                    <HamburgerMenuIcon className=" w-6 h-6" />
                                )}
                            </button>
                        </Popover.Trigger>

                        <Popover.Portal>
                            <Popover.Content sideOffset={5} align="end"
                                className="rounded-md shadow-md mt-2">
                                <ul className="flex flex-col gap-4">
                                    {items.map((item, index) => (
                                        <NavItem
                                            key={index}
                                            url={item.url}
                                            label={item.label}
                                            isActive={pathname === item.url}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        />
                                    ))}
                                </ul>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>
                )}

            </nav>
        </header>
    );
}