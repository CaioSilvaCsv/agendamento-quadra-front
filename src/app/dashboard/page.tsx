"use client";

import { useState, useEffect, useMemo, JSX } from "react";
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

export default function DashboardPage() {
  const { user, loading } = useUserData();

  const initialDesktopSettings: DashboardSettings = {
    showCreateBlockedTimeForm: true,
    showCreateBookingForm: true,
    showBlockedTimesManager: true,
    showBookingApprovalForm: false,
    showCreateCourtForm: true,
  };

  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>(
    initialDesktopSettings
  );

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSettings");
    if (saved) {
      try {
        setDashboardSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao parsear as configurações:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "dashboardSettings",
      JSON.stringify(dashboardSettings)
    );
  }, [dashboardSettings]);

  // Cria um array com o conteúdo de cada painel (sem os wrappers de ResizablePanel)
  const adminPanelContents = useMemo(() => {
    const contents: JSX.Element[] = [];
    if (dashboardSettings.showCreateCourtForm) {
      contents.push(
        <div key="createCourt" className="p-4">
          <CreateCourtForm />
        </div>
      );
    }
    if (dashboardSettings.showCreateBlockedTimeForm) {
      contents.push(
        <div key="createBlockedTime" className="p-4">
          <CreateBlockedTimeForm />
        </div>
      );
    }
    if (dashboardSettings.showCreateBookingForm) {
      contents.push(
        <div key="createBooking" className="p-4">
          <CreateBookingForm />
        </div>
      );
    }
    if (dashboardSettings.showBlockedTimesManager) {
      contents.push(
        <div key="blockedManager" className="p-4">
          <BlockedTimesManager />
        </div>
      );
    }
    if (dashboardSettings.showBookingApprovalForm) {
      contents.push(
        <div key="bookingApproval" className="p-4">
          <BookingApprovalForm />
        </div>
      );
    }
    return contents;
  }, [dashboardSettings]);

  // Para desktop, envolve os conteúdos em ResizablePanelGroup com ResizablePanel
  const desktopAdminContent = (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      {adminPanelContents.map((content, index) => (
        <ResizablePanel key={index}>{content}</ResizablePanel>
      ))}
    </ResizablePanelGroup>
  );

  // Detecta se está em dispositivo mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Para mobile, renderiza somente um painel por vez com botões de navegação
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const mobileAdminContent = (
    <div className="space-y-4">
      <div className="flex justify-between">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setActivePanelIndex((prev) => Math.max(prev - 1, 0))}
          disabled={activePanelIndex === 0}
        >
          Anterior
        </button>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() =>
            setActivePanelIndex((prev) =>
              Math.min(prev + 1, adminPanelContents.length - 1)
            )
          }
          disabled={activePanelIndex === adminPanelContents.length - 1}
        >
          Próximo
        </button>
      </div>
      <div className="rounded-lg border">
        <ScrollArea className="h-[74vh]">
          {adminPanelContents[activePanelIndex]}
        </ScrollArea>
      </div>
    </div>
  );

  // Conteúdo para usuários comuns permanece o mesmo
  const userContent = (
    <div className="relative">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-2xl border"
      >
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl p-4"
            >
              <CreateBookingForm />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-[74vh] p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl p-4"
            >
              <UserBookings />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );

  if (loading) {
    return (
      <p className="p-4 text-muted-foreground">Carregando informações...</p>
    );
  }
  if (!user) {
    return (
      <p className="p-4 text-red-500">Não foi possível carregar seus dados.</p>
    );
  }

  return (
    <AuthGuard>
      <main className="p-4 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold"
        >
          Bem-vindo, {user.name}!
        </motion.h1>
        {user.role === "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <DashboardSettingsIcons
              settings={dashboardSettings}
              onChange={setDashboardSettings}
            />
          </motion.div>
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
