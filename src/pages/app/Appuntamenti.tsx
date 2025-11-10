import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [selectedApp, setSelectedApp] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRichiestaOpen, setIsRichiestaOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [dataSelezionata, setDataSelezionata] = useState("")
  const [oraSelezionata, setOraSelezionata] = useState("")
  const [trattamentoId, setTrattamentoId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

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
      setSelectedApp(matchConfermato || matchRichiesta)
      setIsDialogOpen(true)
    } else {
      setDataSelezionata(day.toLocaleDateString("en-CA"))
      setIsRichiestaOpen(true)
    }
  }

  const oggi = new Date().toISOString().split("T")[0]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-gray-300 text-lg font-semibold">Caricamento appuntamenti...</p>
      </div>
    )
  }

  return (
    <div className="p-4 flex justify-center items-center bg-black min-h-screen">
      {/* Grande card principale */}
      <Card className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl p-5">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold text-white">I tuoi appuntamenti</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          {/* 🔹 Calendario */}
          <Card className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-lg">
            <CardHeader className="text-center pb-1">
              <CardTitle className="text-lg text-gray-200">Calendario</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDay || undefined}
                onDayClick={handleDayClick}
                className="rounded-md border border-neutral-800 shadow-sm w-full max-w-sm bg-neutral-950 text-white"
                modifiers={{
                  selezionato: (day: any) =>
                    selectedDay && day.toDateString() === selectedDay.toDateString(),
                  confermato: (day: any) => dateConfermate.includes(day.toDateString()),
                  daConfermare: (day: any) => dateDaConfermare.includes(day.toDateString()),
                }}
                modifiersStyles={{
                  selezionato: {
                    backgroundColor: "#555",
                    color: "white",
                    borderRadius: "50%",
                  },
                  confermato: {
                    backgroundColor: "#16a34a", // ✅ verde confermati
                    color: "white",
                    borderRadius: "50%",
                  },
                  daConfermare: {
                    backgroundColor: "#eab308", // ✅ giallo da confermare
                    color: "black",
                    borderRadius: "50%",
                  },
                }}
                captionLayout="dropdown"
              />
            </CardContent>
          </Card>

          {/* 🔹 Elenchi sotto */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-4">
            {/* Confermati */}
            <Card className="w-full md:w-1/2 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-300 text-center">
                  Confermati
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {appuntamentiConfermati.length === 0 ? (
                  <p className="text-gray-600 text-center">Nessun appuntamento confermato.</p>
                ) : (
                  <ul className="divide-y divide-neutral-800">
                    {appuntamentiConfermati.map((app, i) => (
                      <li
                        key={i}
                        className="py-2 flex items-center justify-between hover:bg-green-900/20 rounded-md px-3 transition"
                      >
                        <div>
                          <p className="text-gray-200 font-medium">Appuntamento</p>
                          <p className="text-xs text-gray-500">
                            {new Date(app.data_appuntamento).toLocaleDateString()} • {app.ora_appuntamento}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild className="border-gray-700 text-gray-300 hover:bg-neutral-800">
                          <Link to="/app/chat">Chat</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Da confermare */}
            <Card className="w-full md:w-1/2 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-300 text-center">
                  Da confermare
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {appuntamentiDaConfermare.length === 0 ? (
                  <p className="text-gray-600 text-center">Nessuna richiesta in sospeso.</p>
                ) : (
                  <ul className="divide-y divide-neutral-800">
                    {appuntamentiDaConfermare.map((app, i) => (
                      <li
                        key={i}
                        className="py-2 flex items-center justify-between hover:bg-yellow-900/20 rounded-md px-3 transition"
                      >
                        <div>
                          <p className="text-gray-200 font-medium">Appuntamento</p>
                          <p className="text-xs text-gray-500">
                            {new Date(app.data_appuntamento).toLocaleDateString()} • {app.ora_appuntamento}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild className="border-gray-700 text-gray-300 hover:bg-neutral-800">
                            <Link to="/app/chat">Chat</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => eliminaRichiestaAppuntamento(app.id)}
                            className="hover:bg-red-900/30 text-red-500"
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
        </CardContent>
      </Card>
    </div>
  )
}
