import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { listMessaggiByPaziente, creaMessaggioPaziente } from "@/services/database.request";
import { Send } from "lucide-react";

export default function ChatPage() {
  const [messaggi, setMessaggi] = useState<any[]>([]);
  const [testo, setTesto] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // CARICAMENTO MESSAGGI
  useEffect(() => {
    (async () => {
      setCaricamento(true);
      setErrore(null);
      try {
        const res = await listMessaggiByPaziente();
        // Ordina per data crescente
        const sorted = (res?.data || []).sort(
          (a: any, b: any) => new Date(a.data_invio).getTime() - new Date(b.data_invio).getTime()
        );
        setMessaggi(sorted);
      } catch (e) {
        console.error(e);
        setErrore("Impossibile caricare i messaggi");
      } finally {
        setCaricamento(false);
      }
    })();
  }, []);

  // SCROLL AUTOMATICO IN FONDO
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messaggi]);

  // INVIO MESSAGGIO
  const inviaMessaggio = async () => {
    const testoPulito = testo.trim();
    if (!testoPulito) return;

    const nuovo = {
      id: Date.now(),
      testo: testoPulito,
      mittente: "Paziente",
      data_invio: new Date().toISOString(),
    };

    setMessaggi((prev) => [...prev, nuovo]);
    setTesto("");

    try {
      await creaMessaggioPaziente(1, testoPulito);
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
    <div className="flex flex-col h-[80vh] max-w-md mx-auto border rounded-lg shadow bg-[#ece5dd]">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-700 text-white rounded-t-lg">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
          LV
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Dott.ssa Laura Verdi</div>
          <div className="text-[11px] text-gray-300">online</div>
        </div>
      </div>

      {/* AREA MESSAGGI */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        ref={scrollerRef}
      >
        {caricamento && (
          <div className="text-sm text-gray-600 text-center">Caricamento…</div>
        )}
        {errore && (
          <div className="text-sm text-red-600 text-center">{errore}</div>
        )}

        {/* Messaggi raggruppati per giorno */}
        {Object.entries(messaggiPerGiorno)
          // Ordina le date in ordine cronologico
          .sort(
            ([a], [b]) =>
              new Date(parseDateLabel(a)).getTime() -
              new Date(parseDateLabel(b)).getTime()
          )
          .map(([giornoLabel, msgs]) => (
            <div key={giornoLabel}>
              {/* Separatore Giorno */}
              <div className="flex justify-center">
                <div className="text-xs text-gray-600 bg-white/70 px-3 py-1 rounded-full shadow-sm mb-2">
                  {giornoLabel}
                </div>
              </div>

              {/* Messaggi del giorno (dal più vecchio al più nuovo) */}
              {msgs
                .sort(
                  (a: any, b: any) =>
                    new Date(a.data_invio).getTime() - new Date(b.data_invio).getTime()
                )
                .map((m) => {
                  const isPaziente = m.mittente === "Paziente";
                  const testoMessaggio = m.testo;
                  const orario = formatTimeFromAny(m.data_invio);

                  return (
                    <div
                      key={m.id}
                      className={`flex items-end mb-2 ${
                        isPaziente ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Avatar Fisioterapista */}
                      {!isPaziente && (
                        <div className="mr-2 w-8 h-8 rounded-full bg-gray-600 text-white text-[11px] flex items-center justify-center">
                          LV
                        </div>
                      )}

                      {/* Messaggio */}
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
                          isPaziente
                            ? "bg-[#128C7E] text-white rounded-br-sm"
                            : "bg-white text-black rounded-bl-sm"
                        }`}
                      >
                        <div className="text-sm break-words">{testoMessaggio}</div>
                        {orario && (
                          <div
                            className={`text-[10px] mt-1 text-right ${
                              isPaziente ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            {orario}
                          </div>
                        )}
                      </div>

                      {/* Avatar Paziente */}
                      {isPaziente && (
                        <div className="ml-2 w-8 h-8 rounded-full bg-[#075E54] text-white text-[11px] flex items-center justify-center">
                          TU
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>

      {/* BARRA INPUT */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f0f0] rounded-b-lg border-t">
        <input
          type="text"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Scrivi un messaggio..."
          className="flex-1 border rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/60"
        />
        <Button
          onClick={inviaMessaggio}
          className="px-3 py-2 rounded-full bg-black hover:bg-gray-800 text-white"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}

// === FUNZIONI DI SUPPORTO ===

// Raggruppa i messaggi per data (Oggi, Ieri, o data completa)
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

// Converte label tipo "Oggi" / "Ieri" in date reali per ordinamento
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

// Formatta orario
function formatTimeFromAny(ts: any) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
