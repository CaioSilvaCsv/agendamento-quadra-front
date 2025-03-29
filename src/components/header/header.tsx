"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 px-4 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Logo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Início
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Sobre
          </Link>
          <Link
            href="/servicos"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Serviços
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contato
          </Link>
          <Button onClick={logout}>Sair</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("container md:hidden", isOpen ? "block" : "hidden")}>
        <div className="flex flex-col space-y-4 py-4">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </Link>
          <Link
            href="/servicos"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Serviços
          </Link>
          <Link
            href="/contato"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Contato
          </Link>
          <Button className="w-full">Entrar</Button>
        </div>
      </div>
    </header>
  );
}
