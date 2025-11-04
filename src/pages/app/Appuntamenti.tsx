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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Link } from "react-router-dom"
import { getAppuntamenti } from "@/services/database.request"

export default function AppuntamentiPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [selectedApp, setSelectedApp] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRichiestaOpen, setIsRichiestaOpen] = useState(false)

  const [appuntamentiConfermati, setAppuntamentiConfermati] = useState([
    { nomeDottore: "Dr. Rossi", data: "2025-11-03T09:00:00", ora: "09:00" },
    { nomeDottore: "Dr. Verdi", data: "2025-11-15T14:30:00", ora: "14:30" },
    { nomeDottore: "Dr. Bianchi", data: "2025-11-22T11:00:00", ora: "11:00" },
  ])

  const [appuntamentiDaConfermare, setAppuntamentiDaConfermare] = useState<any[]>([])

  
  const [dottoreSelezionato, setDottoreSelezionato] = useState("")
  const [dataSelezionata, setDataSelezionata] = useState("")
  const [oraSelezionata, setOraSelezionata] = useState("")

  useEffect(() => {
    loadAppuntamenti()
  }, [])

  const loadAppuntamenti = async () => {
    try {
      const res = await getAppuntamenti()
      
    } catch (error) {
      console.log(error)
    }
  }

  
  const dateConfermate = appuntamentiConfermati.map(app =>
    new Date(app.data).toDateString()
  )
  const dateDaConfermare = appuntamentiDaConfermare.map(app =>
    new Date(app.data).toDateString()
  )

  
  const handleDayClick = (day: Date) => {
    const matchConfermato = appuntamentiConfermati.find(
      app => new Date(app.data).toDateString() === day.toDateString()
    )
    const matchRichiesta = appuntamentiDaConfermare.find(
      app => new Date(app.data).toDateString() === day.toDateString()
    )

    if (matchConfermato || matchRichiesta) {
      setSelectedApp(matchConfermato || matchRichiesta)
      setIsDialogOpen(true)
    } else {
     
      setDataSelezionata(day.toISOString().split("T")[0])
      setIsRichiestaOpen(true)
    }
  }

  
  const inviaRichiestaAppuntamento = () => {
    if (!dottoreSelezionato || !dataSelezionata || !oraSelezionata) return

    const nuovaRichiesta = {
      nomeDottore: dottoreSelezionato,
      data: `${dataSelezionata}T${oraSelezionata}`,
      ora: oraSelezionata,
    }
    setAppuntamentiDaConfermare([...appuntamentiDaConfermare, nuovaRichiesta])
    setIsRichiestaOpen(false)
    setDottoreSelezionato("")
    setDataSelezionata("")
    setOraSelezionata("")
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
            <Select onValueChange={setDottoreSelezionato}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un dottore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. Rossi">Dr. Rossi</SelectItem>
                <SelectItem value="Dr. Verdi">Dr. Verdi</SelectItem>
                <SelectItem value="Dr. Bianchi">Dr. Bianchi</SelectItem>
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

            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={inviaRichiestaAppuntamento}>
              Invia richiesta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl">

        
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
                confermato: (day) => dateConfermate.includes(day.toDateString()),
                daConfermare: (day) => dateDaConfermare.includes(day.toDateString()),
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

        
        <Card className="w-full md:w-[48%] shadow-lg border border-gray-200 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              I tuoi appuntamenti
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
           
<div>
  <h3 className="text-lg font-semibold text-white mb-2">Confermati</h3>
  {appuntamentiConfermati.length === 0 ? (
    <p className="text-gray-500 text-center">Nessun appuntamento confermato.</p>
  ) : (
    <ul className="divide-y divide-gray-200">
      {appuntamentiConfermati.map((app, index) => (
        <li
          key={index}
          className="py-3 flex items-center justify-between hover:bg-blue-800/40 rounded-lg px-3 transition"
        >
          <div>
            <p className="font-medium text-white">{app.nomeDottore}</p>
            <p className="text-sm text-gray-300">
              {new Date(app.data).toLocaleDateString()} – {app.ora}
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


<div>
  <h3 className="text-lg font-semibold text-white mb-2">Da confermare</h3>
  {appuntamentiDaConfermare.length === 0 ? (
    <p className="text-gray-500 text-center">Nessuna richiesta in sospeso.</p>
  ) : (
    <ul className="divide-y divide-gray-200">
      {appuntamentiDaConfermare.map((app, index) => (
        <li
          key={index}
          className="py-3 flex items-center justify-between hover:bg-yellow-800/40 rounded-lg px-3 transition"
        >
          <div>
            <p className="font-medium text-white">{app.nomeDottore}</p>
            <p className="text-sm text-gray-300">
              {new Date(app.data).toLocaleDateString()} – {app.ora}
            </p>
          </div>
          <div className="flex gap-2">
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

     
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dettagli appuntamento</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedApp ? (
                <>
                  Dottore: {selectedApp.nomeDottore} <br />
                  Data: {new Date(selectedApp.data).toLocaleDateString()} <br />
                  Ora: {selectedApp.ora}
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
