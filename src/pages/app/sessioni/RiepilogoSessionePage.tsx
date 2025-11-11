import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getSessioneById } from "@/services/database.request"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RiepilogoSessionePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sessione, setSessione] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    const res = await getSessioneById(id!)
    setSessione(res.data.data)
    setLoading(false)
  }

  if (loading)
    return <div className="p-6 text-muted-foreground">Caricamento riepilogo...</div>

  if (!sessione)
    return <div className="p-6 text-muted-foreground">Sessione non trovata.</div>

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Riepilogo — {sessione.nome_scheda}
        </h1>
        <Button variant="outline" onClick={() => navigate("/app/allenamento/")}>
          ← Torna indietro
        </Button>
      </div>

      <p className="text-muted-foreground">
        Data sessione:{" "}
        <strong>
          {new Date(sessione.data_sessione).toLocaleDateString("it-IT")}
        </strong>
      </p>

      {/* 🔹 Lista esercizi completati */}
      <div className="space-y-6">
        {sessione.esercizi?.length ? (
          sessione.esercizi.map((es: any, idx: number) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{es.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="text-sm">{es.descrizione}</p>
                <p className="text-sm italic">{es.descrizione_svolgimento}</p>

                {es.consigli_svolgimento && (
                  <p className="text-sm text-blue-600 font-medium">
                    💡 {es.consigli_svolgimento}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 pt-2">
                  <span className="text-sm font-medium">
                    Serie svolte:{" "}
                    <span className="font-semibold">
                      {es.serie_effettive ?? "—"}
                    </span>
                  </span>
                  <span className="text-sm font-medium">
                    Ripetizioni svolte:{" "}
                    <span className="font-semibold">
                      {es.ripetizioni_effettive ?? "—"}
                    </span>
                  </span>
                </div>

                {es.note && (
                  <p className="text-sm italic text-muted-foreground">
                    📝 {es.note}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">Nessun esercizio registrato.</p>
        )}
      </div>

      {/* 🔹 Sondaggio finale */}
      {sessione.sondaggio && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sondaggio finale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Dolore:</strong> {sessione.sondaggio.dolore ?? "—"}/10
            </p>
            <p>
              <strong>Forza:</strong> {sessione.sondaggio.forza ?? "—"}/10
            </p>
            <p>
              <strong>Mobilità:</strong> {sessione.sondaggio.mobilita ?? "—"}/10
            </p>
            {sessione.sondaggio.feedback && (
              <p>
                <strong>Feedback:</strong> {sessione.sondaggio.feedback}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
