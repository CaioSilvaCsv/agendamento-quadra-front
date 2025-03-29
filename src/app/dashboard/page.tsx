"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { CreateBookingForm } from "@/components/dashboard/create-bookings-form";
import { CreateBlockedTimeForm } from "@/components/dashboard/CreateBlockedTimeForm";
import BlockedTimesManager from "@/components/dashboard/BlockedTimesManager";
import BookingApprovalForm from "@/components/dashboard/BookingApprovalForm";
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
  // Hooks sempre chamados no início
  const { user, loading } = useUserData();
  const router = useRouter();

  const initialSettings: DashboardSettings = {
    showCreateBlockedTimeForm: true,
    showCreateBookingForm: true,
    showBlockedTimesManager: true,
    showBookingApprovalForm: true,
  };

  const [dashboardSettings, setDashboardSettings] =
    useState<DashboardSettings>(initialSettings);
  const [showSettings, setShowSettings] = useState(false);

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

  // Criação dos painéis do administrador com base nas configurações
  const adminPanels = useMemo(() => {
    const panels: JSX.Element[] = [];

    if (dashboardSettings.showCreateBlockedTimeForm) {
      panels.push(
        <ResizablePanel key="createBlockedTime">
          <ScrollArea className="h-[74vh] p-4">
            <motion.div
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreateBlockedTimeForm />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
      );
    }
    if (dashboardSettings.showCreateBookingForm) {
      panels.push(
        <ResizablePanel key="createBooking">
          <ScrollArea className="h-[74vh] p-4">
            <motion.div
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CreateBookingForm />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
      );
    }
    if (dashboardSettings.showBlockedTimesManager) {
      panels.push(
        <ResizablePanel key="blockedManager">
          <ScrollArea className="h-[74vh] p-4">
            <motion.div
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BlockedTimesManager />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
      );
    }
    if (dashboardSettings.showBookingApprovalForm) {
      panels.push(
        <ResizablePanel key="bookingApproval">
          <ScrollArea className="h-[74vh] p-4">
            <motion.div
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BookingApprovalForm />
            </motion.div>
          </ScrollArea>
        </ResizablePanel>
      );
    }
    return panels;
  }, [dashboardSettings]);

  // Conteúdo para usuários comuns (sempre definido)
  const userContent = (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <ScrollArea className="h-[74vh] w-[350px] p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
          >
            <UserBookings />
          </motion.div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  // Renderiza os painéis do administrador com handles entre eles
  const adminContent =
    adminPanels.length > 0 ? (
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        {adminPanels.reduce((acc, panel, index) => {
          if (index === 0) return [panel];
          return [
            ...acc,
            <ResizableHandle key={`handle-${index}`} withHandle />,
            panel,
          ];
        }, [] as JSX.Element[])}
      </ResizablePanelGroup>
    ) : (
      <p className="p-4 text-muted-foreground text-center mt-4">
        Nenhum serviço selecionado para exibição.
      </p>
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
              {adminContent}
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
