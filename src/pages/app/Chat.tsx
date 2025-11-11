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
        setMessaggi(res?.data || []);
        console.log(res.data)
      } catch (e) {
        console.error(e);
        setErrore("Impossibile caricare i messaggi");
      } finally {
        setCaricamento(false);

      }
    })();
  }, []);

  // SCROLL AUTOMATICO
  useEffect(() => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messaggi]);

  // INVIO MESSAGGIO
  const inviaMessaggio = async () => {
    const testoPulito = testo.trim();
    if (!testoPulito ) return;

    const nuovo = {
      id: Date.now(),
      testo: testoPulito,
      autore: "client",
      time: Date.now(),
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

  return (
    <div className="flex flex-col h-[80vh] max-w-md mx-auto border rounded-lg shadow bg-[#ece5dd]">
      {/* HEADER (ora grigio) */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-700 text-white rounded-t-lg">
        {/* avatar dottoressa */}
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
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2"
        ref={scrollerRef}
      >
        {caricamento && (
          <div className="text-sm text-gray-600 text-center">Caricamento…</div>
        )}
        {errore && (
          <div className="text-sm text-red-600 text-center">{errore}</div>
        )}

        {messaggi.map((m) => {
          const isClient = (m.autore || m.author) === "client";
          const testoMessaggio = m.testo || m.text;
          const timestamp = m.time || m.orario || m.created_at;
          const orario = formatTimeFromAny(timestamp);

          return (
            <div
              key={m.id}
              className={`flex items-end ${isClient ? "justify-end" : "justify-start"}`}
            >
              {/* ICONA DOTTORESSA A SINISTRA */}
              {!isClient && (
                <div className="mr-2 w-8 h-8 rounded-full bg-gray-600 text-white text-[11px] flex items-center justify-center">
                  LV
                </div>
              )}

              {/* BOLLA MESSAGGIO */}
              <div
                className={`max-w-[70%] px-3 py-2 rounded-2xl shadow-sm ${
                  isClient
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-gray-200 text-black rounded-bl-sm"
                }`}
              >
                <div className="text-sm break-words">{testoMessaggio}</div>
                {orario && (
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isClient ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {orario}
                  </div>
                )}
              </div>

              {/* ICONA PAZIENTE A DESTRA */}
              {isClient && (
                <div className="ml-2 w-8 h-8 rounded-full bg-black text-white text-[11px] flex items-center justify-center">
                  TU
                </div>
              )}
            </div>
          );
        })}
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

// Formatta l'orario dei messaggi
function formatTimeFromAny(ts: any) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
