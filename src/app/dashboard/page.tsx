"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { AuthGuard } from "@/components/auth-guard";
import { CreateBookingForm } from "@/components/dashboard/create-bookings-form";
import { CreateBlockedTimeForm } from "@/components/dashboard/CreateBlockedTimeForm";
import BlockedTimesManager from "@/components/dashboard/BlockedTimesManager";
import BookingApprovalForm from "@/components/dashboard/BookingApprovalForm";
import { CreateCourtForm } from "@/components/dashboard/CreateCourtForm";
import { UserBookings } from "@/components/dashboard/user-bookings";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DashboardSettingsIcons,
  DashboardSettings,
} from "@/components/dashboard/DashboardSettingsIcons";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

/**
 * 
 * @returns Componente DashboardPage
 * @description Componente que renderiza o dashboard do usuário
 * Caso o usuário seja administrador, ele ganha novos recursos no dashboard.
 * Recursos de usuário: Criar reservas, ver e cancelar suas reservas.
 * Recursos de administrador: Criar quadras, criar horários bloqueados, criar reservas, aprovar reservas.
 * É necessário está logado para acessar essa pagina.
**/

export default function DashboardPage() {
  const { user, loading } = useUserData();

  const [isMobile, setIsMobile] = useState(false);
  const [activePanelIndex, setActivePanelIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialSettings: DashboardSettings = {
    showCreateBlockedTimeForm: true,
    showCreateBookingForm: true,
    showBlockedTimesManager: true,
    showBookingApprovalForm: true,
    showCreateCourtForm: true,
  };

  const [dashboardSettings, setDashboardSettings] =
    useState<DashboardSettings>(initialSettings);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSettings");
    if (saved) {
      try {
        setDashboardSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao parsear configurações:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "dashboardSettings",
      JSON.stringify(dashboardSettings)
    );
  }, [dashboardSettings]);

  const adminPanelContents = useMemo(() => {
    const panels: JSX.Element[] = [];

    if (dashboardSettings.showCreateCourtForm) {
      panels.push(<CreateCourtForm key="createCourt" />);
    }
    if (dashboardSettings.showCreateBlockedTimeForm) {
      panels.push(<CreateBlockedTimeForm key="blockedTime" />);
    }
    if (dashboardSettings.showCreateBookingForm) {
      panels.push(<CreateBookingForm key="booking" />);
    }
    if (dashboardSettings.showBlockedTimesManager) {
      panels.push(<BlockedTimesManager key="blockedManager" />);
    }
    if (dashboardSettings.showBookingApprovalForm) {
      panels.push(<BookingApprovalForm key="approval" />);
    }

    return panels;
  }, [dashboardSettings]);

  const mobileAdminContent = (
    <div className="space-y-4">
      <div className="flex justify-between">
        <button
          onClick={() => setActivePanelIndex((i) => Math.max(i - 1, 0))}
          disabled={activePanelIndex === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() =>
            setActivePanelIndex((i) =>
              Math.min(i + 1, adminPanelContents.length - 1)
            )
          }
          disabled={activePanelIndex === adminPanelContents.length - 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
      <div className="rounded-lg border h-[74vh]">
        <ScrollArea className="h-full p-4">
          {adminPanelContents[activePanelIndex]}
        </ScrollArea>
      </div>
    </div>
  );

  const desktopAdminContent = (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      {adminPanelContents.map((content, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ResizableHandle withHandle />}
          <ResizablePanel>
            <ScrollArea className="h-[74vh] p-4">{content}</ScrollArea>
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );

  const userContent = (
    <ResizablePanelGroup direction="horizontal" className="rounded-2xl border">
      <ResizablePanel defaultSize={50}>
        <ScrollArea className="p-4">
          <CreateBookingForm />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ScrollArea className="h-[74vh] p-4">
          <UserBookings />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  if (loading)
    return <p className="p-4 text-muted-foreground">Carregando...</p>;
  if (!user)
    return <p className="p-4 text-red-500">Erro ao carregar usuário.</p>;

  return (
    <AuthGuard>
      <main className="p-4 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold"
        >
          Bem-vindo(a), {user.name}!
        </motion.h1>

        {user.role === "ADMIN" && (
          <DashboardSettingsIcons
            settings={dashboardSettings}
            onChange={setDashboardSettings}
          />
        )}

        <AnimatePresence mode="wait">
          {user.role === "ADMIN" ? (
            <motion.div
              key="adminContent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isMobile ? mobileAdminContent : desktopAdminContent}
            </motion.div>
          ) : (
            <motion.div
              key="userContent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {userContent}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGuard>
  );
}
