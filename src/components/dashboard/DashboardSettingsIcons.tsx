"use client";

import { Toggle } from "@/components/ui/toggle";
import { Lock, Calendar, List, CheckSquare, PlusSquare } from "lucide-react";
import { motion } from "framer-motion";

export interface DashboardSettings {
  showCreateBlockedTimeForm: boolean;
  showCreateBookingForm: boolean;
  showBlockedTimesManager: boolean;
  showBookingApprovalForm: boolean;
  showCreateCourtForm: boolean; // Nova propriedade
}

const buttonVariants = {
  rest: { y: 0 },
  hover: { y: -15 },
};

const textVariants = {
  rest: { opacity: 0, y: 5 },
  hover: { opacity: 1, y: 0 },
};

/**
 * @param settings - Configurações do dashboard
 * @description Componente que exibe os ícones de configurações do dashboard para a adição de
 * quadras, reservas, bloqueios e aprovação de reservas.
  **/

export function DashboardSettingsIcons({
  settings,
  onChange,
}: {
  settings: DashboardSettings;
  onChange: (s: DashboardSettings) => void;
}) {
  return (
    <div className="flex gap-2 p-2 border rounded-md justify-center">
      <motion.div
        className="relative flex flex-col items-center"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        style={{ width: "3rem" }}
      >
        <motion.div variants={buttonVariants}>
          <Toggle
            pressed={settings.showCreateCourtForm}
            onPressedChange={(pressed) =>
              onChange({ ...settings, showCreateCourtForm: pressed })
            }
            variant="outline"
            className="p-2"
            title="Formulário de Quadra"
          >
            <PlusSquare size={20} />
          </Toggle>
        </motion.div>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 w-full text-center text-xs text-muted-foreground"
        >
          Quadra
        </motion.span>
      </motion.div>

      <motion.div
        className="relative flex flex-col items-center"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        style={{ width: "3rem" }}
      >
        <motion.div variants={buttonVariants}>
          <Toggle
            pressed={settings.showCreateBlockedTimeForm}
            onPressedChange={(pressed) =>
              onChange({ ...settings, showCreateBlockedTimeForm: pressed })
            }
            variant="outline"
            className="p-2"
            title="Formulário de Bloqueio"
          >
            <Lock size={20} />
          </Toggle>
        </motion.div>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 w-full text-center text-xs text-muted-foreground"
        >
          Bloqueio
        </motion.span>
      </motion.div>

      <motion.div
        className="relative flex flex-col items-center"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        style={{ width: "3rem" }}
      >
        <motion.div variants={buttonVariants}>
          <Toggle
            pressed={settings.showCreateBookingForm}
            onPressedChange={(pressed) =>
              onChange({ ...settings, showCreateBookingForm: pressed })
            }
            variant="outline"
            className="p-2"
            title="Formulário de Reserva"
          >
            <Calendar size={20} />
          </Toggle>
        </motion.div>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 w-full text-center text-xs text-muted-foreground"
        >
          Reserva
        </motion.span>
      </motion.div>

      <motion.div
        className="relative flex flex-col items-center"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        style={{ width: "3rem" }}
      >
        <motion.div variants={buttonVariants}>
          <Toggle
            pressed={settings.showBlockedTimesManager}
            onPressedChange={(pressed) =>
              onChange({ ...settings, showBlockedTimesManager: pressed })
            }
            variant="outline"
            className="p-2"
            title="Gerenciamento de Bloqueios"
          >
            <List size={20} />
          </Toggle>
        </motion.div>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 w-24 text-center text-xs text-muted-foreground"
        >
          Gerenciar
        </motion.span>
      </motion.div>

      <motion.div
        className="relative flex flex-col items-center"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        animate="rest"
        style={{ width: "3rem" }}
      >
        <motion.div variants={buttonVariants}>
          <Toggle
            pressed={settings.showBookingApprovalForm}
            onPressedChange={(pressed) =>
              onChange({ ...settings, showBookingApprovalForm: pressed })
            }
            variant="outline"
            className="p-2"
            title="Aprovação de Agendamentos"
          >
            <CheckSquare size={20} />
          </Toggle>
        </motion.div>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 w-full text-center text-xs text-muted-foreground"
        >
          Aprovação
        </motion.span>
      </motion.div>
    </div>
  );
}
