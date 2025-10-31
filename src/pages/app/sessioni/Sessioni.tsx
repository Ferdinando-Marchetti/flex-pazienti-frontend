import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listSessioniByCliente } from "@/services/database.request"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SessioniPage() {
  const [sessioni, setSessioni] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadSessioni()
  }, [])

  const loadSessioni = async () => {
    try {
      const res = await listSessioniByCliente(1) // id utente loggato
      setSessioni(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return <div className="p-6 text-muted-foreground">Caricamento...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Le mie sessioni</h1>
        <Button onClick={() => navigate("/app/sessioni/nuova")}>
          + Nuova sessione
        </Button>
      </div>

      {sessioni.length === 0 ? (
        <p className="text-muted-foreground">Nessuna sessione trovata.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sessioni.map((s) => (
            <Card
              key={s.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/app/sessioni/${s.id}`)}
            >
              <CardHeader>
                <CardTitle>Sessione #{s.id}</CardTitle>
                <CardDescription>
                  Fisioterapista: {s.fisioterapista_nome} {s.fisioterapista_cognome}
                  <br />
                  Data: {new Date(s.data_sessione).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
