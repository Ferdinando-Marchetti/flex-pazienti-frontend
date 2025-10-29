import { useEffect, useState } from "react"
import { getSchedeEsercizi } from "@/services/database.request"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ClipboardList, Home, Hospital } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function SchedeAllenamentoPage() {
  const [schedeEsercizi, setSchedeEsercizi] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchede()
  }, [])

  const loadSchede = async () => {
    try {
      const res = await getSchedeEsercizi()
      console.log(res)
      setSchedeEsercizi(res.data)
    } catch (err) {
      console.error("Errore caricamento schede:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : schedeEsercizi.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedeEsercizi.map((scheda: any) => (
            <Card
              key={scheda.id}
              className="hover:shadow-lg transition-shadow duration-200 border-muted"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {scheda.nome}
                </CardTitle>
                <CardDescription>
                  ID scheda: {scheda.id} — Trattamento #{scheda.trattamento_id}
                  <Badge
                    variant={scheda.tipo_scheda === "Casa" ? "default" : "secondary"}
                    className="flex items-center mt-2"
                  >
                    {scheda.tipo_scheda === "Casa" ? (
                      <Home className="w-3.5 h-3.5" />
                    ) : (
                      <Hospital className="w-3.5 h-3.5" />
                    )}
                    {scheda.tipo_scheda}
                  </Badge>
                </CardDescription>
                <CardAction>
                    <Button asChild>
                      <Link to={`/app/allenamento/${scheda.id}`}>
                        <ArrowRight />
                      </Link>
                    </Button>
                </CardAction>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scheda.note || "Nessuna nota disponibile."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground italic">Nessuna scheda disponibile.</p>
      )}
    </div>
  )
}
