import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { getEsercizi, listSessioniByCliente } from "@/services/database.request"
import { createSessione } from "@/services/database.request"
import {
  Card
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, Play } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DettagliSchedaPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [scheda, setScheda] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingSessione, setLoadingSessione] = useState(false)
  const [sessioni, setSessioni] = useState<any[]>([])

  useEffect(() => {
    if (!id) {
      navigate("/app/allenamento")
    } else {
      loadScheda(id)
      loadSessioni()
    }
  }, [id])

  const loadScheda = async (id: string) => {
    try {
      setLoading(true)
      const res = await getEsercizi(id)
      setScheda(res.data)
    } catch (err) {
      console.error("Errore caricamento scheda:", err)
      setError("Errore durante il caricamento della scheda.")
    } finally {
      setLoading(false)
    }
  }

  const loadSessioni = async () => {
    try {
      const res = await listSessioniByCliente() // id utente loggato
      setSessioni(res.data)
    } finally {
      setLoading(false)
    }
  }

  const avviaSessione = async () => {
    if (!scheda) return
    try {
      setLoadingSessione(true)
      const res = await createSessione({
        fisioterapista_id: scheda.id_fisioterapista,
        scheda_id: scheda.id,
      })
      const sessioneId = res.data.sessioneId
      navigate(`/app/sessioni/${sessioneId}`)
    } catch (err) {
      console.error("Errore creazione sessione:", err)
      alert("Errore durante l’avvio della sessione.")
    } finally {
      setLoadingSessione(false)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Caricamento in corso...
      </div>
    )

  if (error)
    return (
      <Alert variant="destructive" className="m-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  if (!scheda)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Nessuna scheda trovata.
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">{scheda.nome}</h1>
          <p className="text-sm text-muted-foreground">
            Tipo: {scheda.tipo_scheda}
          </p>
          <p className="text-sm text-muted-foreground">
            Fisioterapista: {scheda.fisioterapista_nome}{" "}
            {scheda.fisioterapista_cognome}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/app/allenamento")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alle schede
          </Button>

          <Button onClick={avviaSessione} disabled={loadingSessione}>
            <Play className="w-4 h-4 mr-2" />
            {loadingSessione ? "Avvio..." : "Avvia sessione"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Note */}
      {scheda.note && (
        <Alert className="bg-card border-border">
          <AlertDescription>{scheda.note}</AlertDescription>
        </Alert>
      )}

      {/* Lista esercizi */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Esercizi</h2>

        {scheda.esercizi && scheda.esercizi.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {scheda.esercizi.map((ex: any, i: number) => (
              <EsercizioCard key={i} esercizio={ex} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nessun esercizio presente.</p>
        )}
      </div>

      {/* Lista sessioni */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sessioni Allenamento</h2>
        {sessioni.length === 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center italic cursor-default"> Non ci sono sessioni di allenamento </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fisioterapista</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessioni.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.data_sessione).toLocaleDateString()}</TableCell>
                  <TableCell>{s.fisioterapista_nome} {s.fisioterapista_cognome}</TableCell>
                  <TableCell className="text-end">
                    <Button asChild>
                      <Link to={`/app/sessione/${s.id}`}>
                        Dettagli
                        <ArrowRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

function EsercizioCard({ esercizio }: { esercizio: any }) {
  const [open, setOpen] = useState(false)
  const ex = esercizio

  return (
    <Card className="flex flex-col md:flex-row items-stretch border border-border bg-card text-foreground hover:shadow-md transition-shadow overflow-hidden">
      {/* SEZIONE IMMAGINE */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-muted aspect-square md:aspect-auto">
        {ex.immagine ? (
          <img
            src={ex.immagine}
            alt={ex.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground text-sm w-full h-full">
            <span>🖼️ Immagine non disponibile</span>
          </div>
        )}
      </div>

      {/* SEZIONE TESTO */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="text-lg font-semibold">{ex.nome}</h3>
          {ex.descrizione && (
            <p className="text-sm text-muted-foreground">{ex.descrizione}</p>
          )}

          {ex.descrizione_svolgimento && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Come svolgere:</span>{" "}
              {ex.descrizione_svolgimento}
            </p>
          )}

          {ex.consigli_svolgimento && (
            <p className="mt-1 text-sm">
              <span className="font-medium">Consigli:</span>{" "}
              {ex.consigli_svolgimento}
            </p>
          )}

          <div className="flex gap-4 text-sm mt-3">
            {ex.ripetizioni && <p>🔁 {ex.ripetizioni} ripetizioni</p>}
            {ex.serie && <p>🏋️‍♂️ {ex.serie} serie</p>}
          </div>
        </div>

        {/* DIALOG VIDEO */}
        {ex.video && (
          <div className="mt-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Guarda video
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-3xl bg-card text-foreground border-border">
                <DialogHeader>
                  <DialogTitle>{ex.nome}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video rounded-lg overflow-hidden border border-border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={
                    esercizio.video.includes("watch?v=")
                      ? esercizio.video.replace(
                            "watch?v=",
                            "embed/"
                        )
                      : // convert shortened youtu.be into embed
                      esercizio.video.includes("youtu.be")
                      ? esercizio.video.replace(
                            "https://youtu.be/",
                            "https://www.youtube.com/embed/"
                        )
                      : esercizio.video
                    }
                    title="Video esercizio"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </Card>
  )
}
