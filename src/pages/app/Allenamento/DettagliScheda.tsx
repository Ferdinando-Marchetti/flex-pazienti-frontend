import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getEsercizi } from "@/services/database.request"
import { createSessione } from "@/services/database.request"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Play } from "lucide-react"

export default function DettagliSchedaPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [scheda, setScheda] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingSessione, setLoadingSessione] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate("/app/allenamento")
    } else {
      loadScheda(id)
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

  const avviaSessione = async () => {
    if (!scheda) return
    try {
      setLoadingSessione(true)
      const res = await createSessione({
        id: scheda.cliente_id, // o utente loggato
        fisioterapista_id: scheda.fisioterapista_id,
        scheda_id: scheda.id,
      })
      const sessioneId = res.data.data.sessioneId
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
        <Alert className="bg-blue-50 border-blue-400 text-blue-800">
          <AlertDescription>{scheda.note}</AlertDescription>
        </Alert>
      )}

      {/* Lista esercizi */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Esercizi</h2>
        {scheda.esercizi && scheda.esercizi.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {scheda.esercizi.map((ex: any, i: number) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{ex.nome}</CardTitle>
                  {ex.descrizione && (
                    <CardDescription>{ex.descrizione}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-1">
                  {ex.ripetizioni && <p>Ripetizioni: {ex.ripetizioni}</p>}
                  {ex.durata && <p>Durata: {ex.durata} sec</p>}
                  {ex.serie && <p>Serie: {ex.serie}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nessun esercizio presente.</p>
        )}
      </div>
    </div>
  )
}
