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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Link } from "react-router-dom"
import {
  getAppuntamenti,
  getTrattamenti,
  creaRichiestaAppuntamento,
  confermaAppuntamento,
} from "@/services/database.request"

export default function AppuntamentiPage() {
  const [appuntamentiConfermati, setAppuntamentiConfermati] = useState<any[]>([])
  const [appuntamentiDaConfermare, setAppuntamentiDaConfermare] = useState<any[]>([])
  const [trattamenti, setTrattamenti] = useState<any[]>([])
  const [selectedApp, setSelectedApp] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRichiestaOpen, setIsRichiestaOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [trattamentoSelezionato, setTrattamentoSelezionato] = useState("")
  const [dataSelezionata, setDataSelezionata] = useState("")
  const [oraSelezionata, setOraSelezionata] = useState("")

 
  useEffect(() => {
    loadAppuntamenti()
    loadTrattamenti()
  }, [])

  //Caricamento dati 
  const loadAppuntamenti = async () => {
    try {
      setLoading(true)
      const data = await getAppuntamenti()
      if (Array.isArray(data)) {
        setAppuntamentiConfermati(data.filter(a => a.confermato))
        setAppuntamentiDaConfermare(data.filter(a => !a.confermato))
      } else {
        setAppuntamentiConfermati([])
        setAppuntamentiDaConfermare([])
      }
    } catch (error) {
      console.error("Errore nel caricamento appuntamenti:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadTrattamenti = async () => {
  try {
    const data = await getTrattamenti()
    
    const lista =
      Array.isArray(data) ? data :
      data?.data && Array.isArray(data.data) ? data.data :
      data?.trattamenti && Array.isArray(data.trattamenti) ? data.trattamenti :
      []
    setTrattamenti(lista)
  } catch (error) {
    console.error("Errore nel caricamento trattamenti:", error)
    setTrattamenti([])
  }
}


  //Creazione appuntamento 
  const inviaRichiestaAppuntamento = async () => {
    if (!trattamentoSelezionato || !dataSelezionata || !oraSelezionata) return

    const nuovaRichiesta = {
      trattamento_id: Number(trattamentoSelezionato),
      data_appuntamento: dataSelezionata,
      ora_appuntamento: oraSelezionata,
    }

    try {
      await creaRichiestaAppuntamento(nuovaRichiesta)
      await loadAppuntamenti()
    } catch (error) {
      console.error("Errore nell'invio della richiesta:", error)
    } finally {
      setIsRichiestaOpen(false)
      setTrattamentoSelezionato("")
      setDataSelezionata("")
      setOraSelezionata("")
    }
  }

  // Conferma appuntamento
  const handleConfermaAppuntamento = async (id: number) => {
    try {
      await confermaAppuntamento(id)
      await loadAppuntamenti()
    } catch (error) {
      console.error("Errore nella conferma appuntamento:", error)
    }
  }

  // Calendario
  const dateConfermate = appuntamentiConfermati.map(app =>
    new Date(app.data_appuntamento).toDateString()
  )
  const dateDaConfermare = appuntamentiDaConfermare.map(app =>
    new Date(app.data_appuntamento).toDateString()
  )

  const handleDayClick = (day: Date) => {
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
      setDataSelezionata(day.toISOString().split("T")[0])
      setIsRichiestaOpen(true)
    }
  }

  // Interfaccia
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-lg font-semibold">Caricamento appuntamenti...</p>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col items-center gap-6">

  

      <Dialog open={isRichiestaOpen} onOpenChange={setIsRichiestaOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Richiedi appuntamento
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Richiedi un nuovo appuntamento</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <Select onValueChange={setTrattamentoSelezionato}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un trattamento" />
              </SelectTrigger>
              <SelectContent>
                {trattamenti.map((t: any) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.nome || t.titolo || `Trattamento #${t.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dataSelezionata}
              onChange={(e) => setDataSelezionata(e.target.value)}
            />
            <Input
              type="time"
              value={oraSelezionata}
              onChange={(e) => setOraSelezionata(e.target.value)}
            />

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={inviaRichiestaAppuntamento}
            >
              Invia richiesta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sezione principale */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">
        {/* Calendario */}
        <Card className="w-full md:w-[48%] shadow-lg border border-gray-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Calendario
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Calendar
              mode="single"
              selected={undefined}
              onDayClick={handleDayClick}
              className="rounded-md border shadow-sm w-full"
              modifiers={{
                confermato: (day: any) => dateConfermate.includes(day.toDateString()),
                daConfermare: (day: any) => dateDaConfermare.includes(day.toDateString()),
              }}
              modifiersStyles={{
                confermato: {
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "50%",
                },
                daConfermare: {
                  backgroundColor: "#facc15",
                  color: "black",
                  borderRadius: "50%",
                },
              }}
              captionLayout="dropdown"
            />
          </CardContent>
        </Card>

        {/* Lista appuntamenti */}
        <Card className="w-full md:w-[48%] shadow-lg border border-gray-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              I tuoi appuntamenti
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {/* Confermati */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Confermati</h3>
              {appuntamentiConfermati.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Nessun appuntamento confermato.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {appuntamentiConfermati.map((app, index) => (
                    <li key={index} className="py-3 flex items-center justify-between hover:bg-blue-800/40 rounded-lg px-3 transition">
                      <div>
                        <p className="font-medium text-white">{app.trattamento?.nome || "Trattamento"}</p>
                        <p className="text-sm text-gray-300">
                          {new Date(app.data_appuntamento).toLocaleDateString()} – {app.ora_appuntamento}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app)
                          setIsDialogOpen(true)
                        }}
                      >
                        Dettagli
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Da confermare */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Da confermare</h3>
              {appuntamentiDaConfermare.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Nessuna richiesta in sospeso.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {appuntamentiDaConfermare.map((app, index) => (
                    <li key={index} className="py-3 flex items-center justify-between hover:bg-yellow-800/40 rounded-lg px-3 transition">
                      <div>
                        <p className="font-medium text-white">{app.trattamento?.nome || "Trattamento"}</p>
                        <p className="text-sm text-gray-300">
                          {new Date(app.data_appuntamento).toLocaleDateString()} – {app.ora_appuntamento}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfermaAppuntamento(app.id)}
                        >
                          Conferma
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = appuntamentiDaConfermare.filter((_, i) => i !== index)
                            setAppuntamentiDaConfermare(updated)
                          }}
                        >
                          Elimina
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog dettagli appuntamento */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dettagli appuntamento</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedApp ? (
                <>
                  Trattamento: {selectedApp.trattamento?.nome || "N/D"} <br />
                  Data: {new Date(selectedApp.data_appuntamento).toLocaleDateString()} <br />
                  Ora: {selectedApp.ora_appuntamento}
                </>
              ) : (
                "Nessun dettaglio disponibile."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Chiudi</AlertDialogCancel>
            <AlertDialogAction>
              <Link to="/app/chat">Vai alla chat</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
