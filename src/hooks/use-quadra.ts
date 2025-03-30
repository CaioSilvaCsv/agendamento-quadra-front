"use client"

import api from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Court {
    id: number;
    name: string;
    location: string;
    description?: string;
    openTime: string;
    closeTime: string;
}

interface UseQuadra {
    courts: Court[];
    loading: boolean;
}

export function useQuadrasData(): UseQuadra {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCourts = async () => {
        setLoading(true);
        try {
            const response = await api.get<Court[]>('/courts');
            if (response.status === 200) {
                setCourts(response.data);
          } else {
            toast.error("Erro ao carregar quadras", {
              duration: 5000,
            });
          }
        } catch (error) {
          console.error("Erro ao buscar quadras:", error);
          toast.error("Erro ao carregar quadras. Verifique a conexão com o servidor.", {
            duration: 5000
          });
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourts();
    }, []);
  
    return { courts, loading };
  }