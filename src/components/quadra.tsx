

import { Court, useQuadrasData } from "@/hooks/use-quadra";
import { Clock, MapPin, Text } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourtCardProps {
    court: Court;
    onReserveClick: () => void;
}

export default function CourtCard ({court, onReserveClick}: CourtCardProps) {
    return (
        <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-xs sm:max-w-sm md:w-72 mx-auto mb-6 overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4 space-y-3 flex-grow">
        <h3 className="text-lg font-semibold truncate" title={court.name}>{court.name}</h3>

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="flex items-start gap-2" title={court.location}>
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-2">{court.location}</span>
          </p>

          <p className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span>{court.openTime} - {court.closeTime}</span>
          </p>

          {court.description && ( // Só renderiza se a descrição existir
            <p className="flex items-start gap-2" title={court.description}>
              <Text className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              <span>{court.description}</span>
            </p>
          )}
        </div>
      </div>

      {/* Seção do Botão (Footer) - mt-auto empurra para baixo */}
      <div className="p-4 border-t mt-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReserveClick}
          className="w-full"
          aria-label={`Reservar quadra ${court.name}`}
        >
          Reservar
        </Button>
      </div>
    </div>
  );
}