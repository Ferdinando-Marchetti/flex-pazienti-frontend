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
import { Input } from "@/components/ui/input"

export default function NuovaSessione() {
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
  const [serieEff, setSerieEff] = useState<number | undefined>()
  const [ripetizioniEff, setRipetizioniEff] = useState<number | undefined>()

  useEffect(() => {
    load()
  }, [id])

  // 🔁 Ricarica la sessione ogni secondo (per aggiornamenti esterni)
  useEffect(() => {
    const interval = setInterval(load, 1000)
    return () => clearInterval(interval)
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
      serie_effettive: serieEff ?? esercizio.serie_effettive,
      ripetizioni_effettive: ripetizioniEff ?? esercizio.ripetizioni_effettive,
    })

    setSerieEff(undefined)
    setRipetizioniEff(undefined)

    if (indice + 1 < sessione.esercizi.length) setIndice(indice + 1)
    else setCompletata(true)
  }

  const inviaSondaggio = async () => {
    await saveSondaggio(Number(id), sondaggio)
    navigate("/app/allenamento/")
  }

  if (loading)
    return <div className="p-6 text-muted-foreground">Caricamento sessione...</div>

  // ✅ FASE FINALE: sondaggio dopo esercizi
  if (completata)
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Sessione completata 🎉</h1>
        <p>Valuta la tua condizione al termine della sessione:</p>

        {["dolore", "forza", "mobilita"].map((campo) => (
          <div key={campo} className="space-y-2">
            <label className="text-sm font-medium capitalize">{campo} (1-10)</label>
            <Select
              onValueChange={(v) => setSondaggio({ ...sondaggio, [campo]: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Seleziona livello ${campo}`} />
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
        ))}

        {/* Feedback */}
        <Textarea
          placeholder="Aggiungi eventuali commenti o sensazioni..."
          value={sondaggio.feedback}
          onChange={(e) =>
            setSondaggio({ ...sondaggio, feedback: e.target.value })
          }
        />

        <Button onClick={inviaSondaggio} className="mt-2 w-full">
          Invia sondaggio
        </Button>
      </div>
    )

  // ✅ FASE NORMALE: visualizzazione esercizi
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {sessione.nome_scheda} —{" "}
        {new Date(sessione.data_sessione).toLocaleDateString("it-IT")}
      </h1>
      <p className="text-muted-foreground whitespace-pre-line">
        {sessione.note_scheda}
      </p>

      {esercizio ? (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>
              {esercizio.nome} ({indice + 1}/{sessione.esercizi.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-muted-foreground">
            {/* Immagine ottimizzata */}
            <div className="flex justify-center">
              <img
                src={esercizio.immagine}
                alt={esercizio.nome}
                className="max-w-3xl w-full max-h-[400px] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="space-y-2">
              <p className="text-base">{esercizio.descrizione}</p>
              <p className="text-sm italic">{esercizio.descrizione_svolgimento}</p>
              {esercizio.consigli_svolgimento && (
                <p className="text-sm text-blue-600 font-medium">
                  💡 {esercizio.consigli_svolgimento}
                </p>
              )}
            </div>

            {/* Video responsive */}
            {esercizio.video && (
              <div className="flex justify-center">
                <iframe
                  className="w-full max-w-3xl aspect-video rounded-lg shadow-sm"
                  src={
                    esercizio.video.includes("watch?v=")
                      ? esercizio.video.replace("watch?v=", "embed/")
                      : esercizio.video.includes("youtu.be")
                      ? esercizio.video.replace(
                          "https://youtu.be/",
                          "https://www.youtube.com/embed/"
                        )
                      : esercizio.video
                  }
                  title="Video esercizio"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Input serie/ripetizioni */}
            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <div className="flex-1">
                <label className="text-sm font-medium">Serie svolte</label>
                <Input
                  type="number"
                  min={0}
                  placeholder={String(esercizio.serie_effettive)}
                  value={serieEff ?? ""}
                  onChange={(e) => setSerieEff(Number(e.target.value))}
                />
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium">Ripetizioni svolte</label>
                <Input
                  type="number"
                  min={0}
                  placeholder={String(esercizio.ripetizioni_effettive)}
                  value={ripetizioniEff ?? ""}
                  onChange={(e) => setRipetizioniEff(Number(e.target.value))}
                />
              </div>
            </div>

            <Button onClick={salvaProgresso} className="w-full mt-4">
              {indice + 1 === sessione.esercizi.length
                ? "Completa sessione"
                : "Prossimo esercizio →"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">Nessun esercizio disponibile.</p>
      )}
    </div>
  )
}
