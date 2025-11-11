import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getFisioterapista,
  listMessaggiByPaziente,
  creaMessaggioPaziente,
} from "@/services/database.request";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [fisioterapista, setFisioterapista] = useState<any>();
  const [inizFisi, setInizFisi] = useState<string>('F');
  const [messaggi, setMessaggi] = useState<any[]>([]);
  const [testo, setTesto] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const caricaFisioDati = async () => {
    try {
      const res = await getFisioterapista();
      setFisioterapista(res.data)
      setInizFisi(`${res.data.nome?.trim()?.charAt(0).toUpperCase() ?? ""}${res.data.cognome?.trim()?.charAt(0).toUpperCase() ?? ""}`)
    } catch (err){
      console.log("Problemi: " + err)
    }
  }

  // === FUNZIONE DI CARICAMENTO ===
  const caricaMessaggi = async (showLoading = false) => {
    if (showLoading) setCaricamento(true);
    setErrore(null);
    try {
      const res = await listMessaggiByPaziente();
      const sorted = (res?.data || []).sort(
        (a: any, b: any) =>
          new Date(a.data_invio).getTime() - new Date(b.data_invio).getTime()
      );
      setMessaggi(sorted);
    } catch (e) {
      console.error(e);
      setErrore("Impossibile caricare i messaggi");
    } finally {
      if (showLoading) setCaricamento(false);
    }
  };

  // === PRIMO CARICAMENTO ===
  useEffect(() => {
    caricaFisioDati()
    caricaMessaggi(true);
  }, []);

  // === AUTO-RICARICAMENTO OGNI 1 SECONDO ===
  useEffect(() => {
    const interval = setInterval(() => {
      caricaMessaggi(false);
    }, 1000); // ogni 1s
    return () => clearInterval(interval);
  }, []);

  // === SCROLL AUTOMATICO ===
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messaggi]);

  // === INVIO MESSAGGIO ===
  const inviaMessaggio = async () => {
    const testoPulito = testo.trim();
    if (!testoPulito) return;

    const nuovo = {
      id: Date.now(),
      testo: testoPulito,
      mittente: "Paziente",
      data_invio: new Date().toISOString(),
    };

    // Aggiunge subito il messaggio localmente per reattività
    setMessaggi((prev) => [...prev, nuovo]);
    setTesto("");

    try {
      await creaMessaggioPaziente(fisioterapista.id, testoPulito);
    } catch (e) {
      console.error(e);
      setErrore("Invio non riuscito");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") inviaMessaggio();
  };

  // === RAGGRUPPA MESSAGGI PER GIORNO ===
  const messaggiPerGiorno = groupByDate(messaggi);

  return (
    <div className="flex flex-col h-[89vh] px-6 mx-auto">
      {/* HEADER */}
      {fisioterapista ? (
        <div className="flex items-center gap-3 px-4 py-2 bg-primary text-primary-foreground rounded-t-lg">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-semibold">
            {inizFisi}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{fisioterapista.nome} {fisioterapista.cognome}</div>
          </div>
        </div>
      ):(
        <div className="flex items-center gap-3 px-4 py-2 bg-primary text-primary-foreground rounded-t-lg">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-semibold">
            {inizFisi}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Fisioterapista</div>
            <div className="text-[11px] text-primary-foreground/80"></div>
          </div>
        </div>
      )}

      {/* AREA MESSAGGI */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-4 bg-muted/30"
      >
        {caricamento && (
          <div className="text-sm text-muted-foreground text-center">
            Caricamento…
          </div>
        )}
        {errore && (
          <div className="text-sm text-destructive text-center">{errore}</div>
        )}

        {Object.entries(messaggiPerGiorno)
          .sort(
            ([a], [b]) =>
              new Date(parseDateLabel(a)).getTime() -
              new Date(parseDateLabel(b)).getTime()
          )
          .map(([giornoLabel, msgs]) => (
            <div key={giornoLabel}>
              {/* Separatore Giorno */}
              <div className="flex justify-center mb-2">
                <div className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full shadow-sm">
                  {giornoLabel}
                </div>
              </div>

              {msgs
                .sort(
                  (a: any, b: any) =>
                    new Date(a.data_invio).getTime() - new Date(b.data_invio).getTime()
                )
                .map((m) => {
                  const isPaziente = m.mittente === "Paziente";
                  const orario = formatTimeFromAny(m.data_invio);

                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex items-end mb-2",
                        isPaziente ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isPaziente && (
                        <div className="mr-2 w-8 h-8 rounded-full bg-primary/80 text-primary-foreground text-[11px] flex items-center justify-center">
                          {inizFisi}
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[75%] px-3 py-2 rounded-2xl shadow-sm",
                          isPaziente
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card text-foreground rounded-bl-sm"
                        )}
                      >
                        <div className="text-sm break-words">{m.testo}</div>
                        <div
                          className={cn(
                            "text-[10px] mt-1 text-right",
                            isPaziente
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        >
                          {orario}
                        </div>
                      </div>

                      {isPaziente && (
                        <div className="ml-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-[11px] flex items-center justify-center">
                          TU
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-b-lg border-t">
        <input
          type="text"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Scrivi un messaggio..."
          className="flex-1 border rounded-full px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-primary outline-none"
        />
        <Button
          onClick={inviaMessaggio}
          size="icon"
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}

// === SUPPORTO ===
function groupByDate(messages: any[]) {
  const grouped: Record<string, any[]> = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  for (const msg of messages) {
    const d = new Date(msg.data_invio);
    const isToday = d.toDateString() === today.toDateString();
    const isYesterday = d.toDateString() === yesterday.toDateString();

    let label = "";
    if (isToday) label = "Oggi";
    else if (isYesterday) label = "Ieri";
    else
      label = d.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(msg);
  }
  return grouped;
}

function parseDateLabel(label: string) {
  const today = new Date();
  if (label === "Oggi") return today;
  if (label === "Ieri") {
    const d = new Date();
    d.setDate(today.getDate() - 1);
    return d;
  }
  return new Date(label);
}

function formatTimeFromAny(ts: any) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}
