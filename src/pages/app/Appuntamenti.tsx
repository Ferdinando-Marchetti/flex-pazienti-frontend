import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import {
  getAppuntamenti,
  getTrattamenti,
  creaRichiestaAppuntamento,
} from "@/services/database.request"
import { Trash2 } from "lucide-react"

export default function AppuntamentiPage() {
  const [appuntamentiConfermati, setAppuntamentiConfermati] = useState<any[]>([])
  const [appuntamentiDaConfermare, setAppuntamentiDaConfermare] = useState<any[]>([])
  const [isRichiestaOpen, setIsRichiestaOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [dataSelezionata, setDataSelezionata] = useState("")
  const [oraSelezionata, setOraSelezionata] = useState("")
  const [trattamentoId, setTrattamentoId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  // 🔹 Orari disponibili
  const orariDisponibili = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "15:00", "16:00", "17:00", "18:00", "19:00"
  ]

  useEffect(() => {
    loadAppuntamenti()
    loadTrattamenti()
  }, [])

  const loadAppuntamenti = async () => {
    try {
      setLoading(true)
      const res = await getAppuntamenti()
      const lista = Array.isArray(res.data) ? res.data : []
      setAppuntamentiConfermati(lista.filter((a: any) => a.stato_conferma === "Confermato"))
      setAppuntamentiDaConfermare(lista.filter((a: any) => a.stato_conferma !== "Confermato"))
    } catch {
      setAppuntamentiConfermati([])
      setAppuntamentiDaConfermare([])
    } finally {
      setLoading(false)
    }
  }

  const loadTrattamenti = async () => {
    try {
      const res = await getTrattamenti()
      const lista =
        Array.isArray(res)
          ? res
          : res?.data && Array.isArray(res.data)
          ? res.data
          : []
      if (lista.length > 0) setTrattamentoId(lista[0].id)
    } catch {
      setTrattamentoId(null)
    }
  }

  const inviaRichiestaAppuntamento = async () => {
    if (!dataSelezionata || !oraSelezionata || !trattamentoId) {
      alert("Errore: dati mancanti.")
      return
    }

    const nuovaRichiesta = {
      trattamento_id: trattamentoId,
      data_appuntamento: dataSelezionata,
      ora_appuntamento: oraSelezionata,
    }

    try {
      await creaRichiestaAppuntamento(nuovaRichiesta)
      await loadAppuntamenti()
      alert("Richiesta inviata con successo.")
    } catch {
      alert("Errore durante l'invio della richiesta.")
    } finally {
      setIsRichiestaOpen(false)
      setDataSelezionata("")
      setOraSelezionata("")
    }
  }

  const eliminaRichiestaAppuntamento = async (id: number) => {
    console.log("Elimina richiesta ID:", id)
    alert("Funzione non ancora implementata.")
  }

  const dateConfermate = appuntamentiConfermati.map(app =>
    new Date(app.data_appuntamento).toDateString()
  )
  const dateDaConfermare = appuntamentiDaConfermare.map(app =>
    new Date(app.data_appuntamento).toDateString()
  )

  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const matchConfermato = appuntamentiConfermati.find(
      app => new Date(app.data_appuntamento).toDateString() === day.toDateString()
    )
    const matchRichiesta = appuntamentiDaConfermare.find(
      app => new Date(app.data_appuntamento).toDateString() === day.toDateString()
    )

    if (matchConfermato || matchRichiesta) {
      return
    } else {
      setDataSelezionata(day.toLocaleDateString("en-CA"))
      setIsRichiestaOpen(true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-gray-300 text-lg font-semibold">Caricamento appuntamenti...</p>
      </div>
    )
  }

return (
  <div className="flex flex-col items-center justify-center p-6 space-y-8">
    {/* 🔹 Dialog: nuova richiesta */}
    <Dialog open={isRichiestaOpen} onOpenChange={setIsRichiestaOpen}>
      <DialogContent className="bg-card border border-border text-foreground shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Richiedi un nuovo appuntamento
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Seleziona una data e un orario per la tua richiesta.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            type="date"
            value={dataSelezionata}
            onChange={(e) => setDataSelezionata(e.target.value)}
            className="bg-muted border-border text-foreground"
          />

          <select
            value={oraSelezionata}
            onChange={(e) => setOraSelezionata(e.target.value)}
            className="bg-muted border border-border text-foreground rounded-md p-2 focus:ring-2 focus:ring-primary transition"
          >
            <option value="">Seleziona un orario</option>
            {orariDisponibili.map((ora) => (
              <option key={ora} value={ora}>
                {ora}
              </option>
            ))}
          </select>

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={inviaRichiestaAppuntamento}
          >
            Invia richiesta
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* 🔹 Calendario principale */}
    <Card className="w-full bg-card border border-border rounded-2xl shadow-md">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Calendario Appuntamenti
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDay || undefined}
          onDayClick={handleDayClick}
          className="rounded-md border border-border shadow-sm w-full bg-muted text-foreground"
          modifiers={{
            selezionato: (day: any) =>
              !!selectedDay && day.toDateString() === selectedDay?.toDateString(),
            confermato: (day: any) => dateConfermate.includes(day.toDateString()),
            daConfermare: (day: any) => dateDaConfermare.includes(day.toDateString()),
          }}
          modifiersStyles={{
            selezionato: {
              backgroundColor: "hsl(var(--muted-foreground))",
              color: "white",
              borderRadius: "50%",
            },
            confermato: {
              backgroundColor: "hsl(var(--success))",
              color: "white",
              borderRadius: "50%",
            },
            daConfermare: {
              backgroundColor: "hsl(var(--warning))",
              color: "black",
              borderRadius: "50%",
            },
          }}
        />
      </CardContent>
    </Card>

    {/* 🔹 Sezione elenchi */}
    <div className="flex flex-col md:flex-row gap-6 w-full">

      {/* ✅ Confermati */}
      <Card className="flex-1 bg-card border border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-center font-medium text-foreground">
            Appuntamenti Confermati
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {appuntamentiConfermati.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessun appuntamento confermato.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {appuntamentiConfermati.map((app, i) => (
                <li
                  key={i}
                  className="py-3 flex items-center justify-between px-3 rounded-md hover:bg-primary/5 transition"
                >
                  <div>
                    <p className="font-medium text-foreground">Appuntamento</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.data_appuntamento).toLocaleDateString()} •{" "}
                      {app.ora_appuntamento}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="text-sm"
                  >
                    <Link to="/app/chat">Chat</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ⏳ Da confermare */}
      <Card className="flex-1 bg-card border border-border rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base text-center font-medium text-foreground">
            Appuntamenti da Confermare
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          {appuntamentiDaConfermare.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessuna richiesta in sospeso.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {appuntamentiDaConfermare.map((app, i) => (
                <li
                  key={i}
                  className="py-3 flex items-center justify-between px-3 rounded-md hover:bg-warning/10 transition"
                >
                  <div>
                    <p className="font-medium text-foreground">Appuntamento</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.data_appuntamento).toLocaleDateString()} •{" "}
                      {app.ora_appuntamento}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="text-sm"
                    >
                      <Link to="/app/chat">Chat</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminaRichiestaAppuntamento(app.id)}
                      className="hover:bg-destructive/10 text-destructive transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

}
