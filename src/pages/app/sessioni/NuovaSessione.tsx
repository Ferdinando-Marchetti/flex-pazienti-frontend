import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createSessione } from "@/services/database.request"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NuovaSessionePage() {
  const [clienteId] = useState(1)
  const [fisioterapistaId] = useState(1)
  const [schedaId, setSchedaId] = useState<number | "">("")
  const navigate = useNavigate()

  const handleCreate = async () => {
    if (!schedaId) return alert("Inserisci l'ID della scheda")
    const res = await createSessione({
      id: clienteId,
      fisioterapista_id: fisioterapistaId,
      scheda_id: Number(schedaId),
    })
    const sessioneId = res.data.data.sessioneId
    navigate(`/app/sessioni/${sessioneId}`)
  }

  return (
    <div className="p-6 flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Nuova sessione</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="ID Scheda di allenamento"
            value={schedaId}
            onChange={(e) => setSchedaId(e.target.value)}
          />
          <Button className="w-full" onClick={handleCreate}>
            Crea e avvia sessione
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
