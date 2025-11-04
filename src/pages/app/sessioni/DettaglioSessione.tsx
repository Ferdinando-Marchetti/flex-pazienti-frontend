import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getSessioneById,
  saveSondaggio,
  updateEsercizioSessione,
} from "@/services/database.request"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function DettaglioSessionePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sessione, setSessione] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [indice, setIndice] = useState(0)
  const [sondaggio, setSondaggio] = useState({
    dolore: "",
    forza: "",
    mobilita: "",
    feedback: "",
  })
  const [completata, setCompletata] = useState(false)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    const res = await getSessioneById(id!)
    setSessione(res.data.data)
    setLoading(false)
  }

  const esercizio = sessione?.esercizi?.[indice]

  const salvaProgresso = async () => {
    await updateEsercizioSessione(Number(id), esercizio.esercizio_id, {
      note: "Esercizio completato",
    })
    if (indice + 1 < sessione.esercizi.length) setIndice(indice + 1)
    else setCompletata(true)
  }

  const inviaSondaggio = async () => {
    await saveSondaggio(Number(id), sondaggio)
    navigate("/app/allenamento/")
  }

  if (loading)
    return <div className="p-6 text-muted-foreground">Caricamento...</div>

  if (completata)
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Sessione completata 🎉</h1>
        <p>Valuta la tua condizione al termine della sessione:</p>

        {/* Valutazione Dolore */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Dolore (1-10)</label>
          <Select
            onValueChange={(v) => setSondaggio({ ...sondaggio, dolore: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona livello dolore" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valutazione Forza */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Forza (1-10)</label>
          <Select
            onValueChange={(v) => setSondaggio({ ...sondaggio, forza: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona livello forza" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valutazione Mobilità */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mobilità (1-10)</label>
          <Select
            onValueChange={(v) => setSondaggio({ ...sondaggio, mobilita: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona livello mobilità" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Feedback testuale */}
        <Textarea
          placeholder="Aggiungi eventuali commenti o sensazioni..."
          value={sondaggio.feedback}
          onChange={(e) =>
            setSondaggio({ ...sondaggio, feedback: e.target.value })
          }
        />

        <Button onClick={inviaSondaggio} className="mt-2">
          Invia sondaggio
        </Button>
      </div>
    )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sessione #{sessione.id}</h1>

      {esercizio ? (
        <Card>
          <CardHeader>
            <CardTitle>{esercizio.nome}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>{esercizio.descrizione}</p>
            <p>Serie: {esercizio.serie_effettive}</p>
            <p>Ripetizioni: {esercizio.ripetizioni_effettive}</p>

            <Button onClick={salvaProgresso}>
              {indice + 1 === sessione.esercizi.length
                ? "Completa sessione"
                : "Prossimo esercizio"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">Nessun esercizio trovato.</p>
      )}
    </div>
  )
}
