"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import api from "@/services/api"
import axios from "axios"
import { Separator } from "../ui/separator"
import { Edit3, MapPin, FileText, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Court {
  id: number
  name: string
  location: string
  description?: string
  openTime: string
  closeTime: string
}

export function CreateCourtForm() {
  // Lista de quadras e seleção
  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourtId, setSelectedCourtId] = useState<string>("new") // "new" significa criar nova

  // Campos do formulário
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [openTime, setOpenTime] = useState("")
  const [closeTime, setCloseTime] = useState("")
  const [loading, setLoading] = useState(false)

  // Busca a lista de quadras ao montar o componente
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const { data } = await api.get("/courts")
        setCourts(data)
      } catch (err) {
        toast.error("Erro ao carregar quadras", { duration: 6000 })
        console.error(err)
      }
    }
    fetchCourts()
  }, [])

  // Atualiza os campos do formulário quando a seleção muda
  useEffect(() => {
    if (selectedCourtId === "new") {
      // Modo criação – limpa os campos
      setName("")
      setLocation("")
      setDescription("")
      setOpenTime("")
      setCloseTime("")
    } else {
      // Modo edição – preenche os campos com os dados da quadra selecionada
      const court = courts.find(c => String(c.id) === selectedCourtId)
      if (court) {
        setName(court.name)
        setLocation(court.location)
        setDescription(court.description || "")
        setOpenTime(court.openTime)
        setCloseTime(court.closeTime)
      }
    }
  }, [selectedCourtId, courts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (selectedCourtId === "new") {
        // Criação de nova quadra
        await api.post("/courts", { name, location, description, openTime, closeTime })
        toast.success("Quadra criada com sucesso!", { duration: 4000 })
      } else {
        // Atualização de quadra existente
        await api.patch(`/courts/${selectedCourtId}`, { name, location, description, openTime, closeTime })
        toast.success("Quadra atualizada com sucesso!", { duration: 4000 })
      }
      // Atualiza a lista de quadras e volta para modo criação
      const { data } = await api.get("/courts")
      setCourts(data)
      setSelectedCourtId("new")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          (selectedCourtId === "new" ? "Erro ao criar quadra" : "Erro ao atualizar quadra")
        toast.error(message, {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        })
      } else {
        toast.error(selectedCourtId === "new" ? "Erro ao criar quadra" : "Erro ao atualizar quadra", {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        })
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (selectedCourtId === "new") return
    const confirmDelete = window.confirm("Tem certeza que deseja excluir essa quadra?")
    if (!confirmDelete) return
    setLoading(true)
    try {
      await api.delete(`/courts/${selectedCourtId}`)
      toast.success("Quadra excluída com sucesso!", { duration: 4000 })
      // Atualiza a lista de quadras e volta para modo criação
      const { data } = await api.get("/courts")
      setCourts(data)
      setSelectedCourtId("new")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || "Erro ao excluir quadra"
        toast.error(message, {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        })
      } else {
        toast.error("Erro ao excluir quadra", {
          duration: 6000,
          style: { backgroundColor: "#ffe4e6", color: "#991b1b" },
        })
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-background p-4 rounded-md border border-border">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {selectedCourtId === "new" ? "Criar Quadra" : "Atualizar Quadra"}
        </h2>
        <Separator className="my-4 border-border" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="courtSelect">Selecione a Quadra</Label>
        <Select value={selectedCourtId} onValueChange={setSelectedCourtId}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Criar nova quadra" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border">
            <SelectItem value="new">Criar nova quadra</SelectItem>
            {courts.map((court) => (
              <SelectItem key={court.id} value={String(court.id)}>
                {court.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Edit3 className="h-4 w-4 text-foreground" />
          <Label htmlFor="name">Nome</Label>
        </div>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-background border-border text-foreground"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-foreground" />
          <Label htmlFor="location">Localização</Label>
        </div>
        <Input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="bg-background border-border text-foreground"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-foreground" />
          <Label htmlFor="description">Descrição</Label>
        </div>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-background border-border text-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            <Label htmlFor="openTime">Horário de Abertura</Label>
          </div>
          <Input
            id="openTime"
            type="time"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground" />
            <Label htmlFor="closeTime">Horário de Fechamento</Label>
          </div>
          <Input
            id="closeTime"
            type="time"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Processando..."
            : selectedCourtId === "new"
            ? "Criar Quadra"
            : "Atualizar Quadra"}
        </Button>
        {selectedCourtId !== "new" && (
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Processando..." : "Excluir Quadra"}
          </Button>
        )}
      </div>
    </form>
  )
}
