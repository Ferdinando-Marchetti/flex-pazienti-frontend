import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import "./Chat.css";
import { Send } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="w-full h-[89vh] px-6 flex items-center justify-center">
      <div className="w-full h-full flex flex-col shadow-lg overflow-hidden border border-border rounded-xl">
        <ChatContainer />
      </div>
    </div>
  );
}

function ChatContainer() {
  const [messages, setMessages] = useState(() => seedMessages());
  const [input, setInput] = useState("");
  const [therapistTyping, setTherapistTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => withDateChips(messages), [messages]);

  function scrollToBottom(ref: React.RefObject<HTMLDivElement>) {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom(scrollerRef);
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const now = Date.now();
    const myMsg = { id: `m-${now}`, author: "client", text, time: now };
    setMessages((prev) => [...prev, myMsg]);
    setInput("");

    setTherapistTyping(true);
    setTimeout(() => {
      setTherapistTyping(false);
      const reply = generateReply(text);
      setMessages((prev) => [
        ...prev,
        { id: `r-${Date.now()}`, author: "therapist", text: reply, time: Date.now() },
      ]);
    }, 900);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 1) INTESTAZIONE */}
      <ChatHeader />

      {/* 2) AREA MESSAGGI (SOLO QUESTA SCROLLA) */}
      <ChatMessages
        items={items}
        therapistTyping={therapistTyping}
        scrollerRef={scrollerRef}
      />

      {/* 3) INPUT / COMPOSER */}
      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

/* =============================
   1) HEADER PROFILO DOTTORESSA
   ============================= */
function ChatHeader() {
  return (
    <header className="flex items-center gap-3 p-4 border-b border-border bg-card shrink-0">
      <Avatar className="h-11 w-11 rounded-lg">
        <AvatarFallback className="rounded-4xl">LV</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-semibold leading-tight truncate">Dott.ssa Laura Verdi</div>
        <div className="text-xs text-neutral-500">Fisioterapista • Online</div>
      </div>
    </header>
  );
}

/* ==============================================
   2) LISTA MESSAGGI (CENTRO) — SCROLLABILE
   ============================================== */
function ChatMessages({ items, therapistTyping, scrollerRef }: {
  items: any[];
  therapistTyping: boolean;
  scrollerRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={scrollerRef}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="space-y-3">
        {items.map((m) =>
          m.type === "date" ? (
            <DateChip key={m.id} date={m.date} />
          ) : (
            <MessageRow key={m.id} msg={m} />
          )
        )}
      </div>
    </div>
  );
}

/* ==============================================
   3) COMPOSER (BASSO) — INPUT MESSAGGIO
   ============================================== */
function ChatComposer({ value, onChange, onSend, onKeyDown }: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="border-t border-border p-3 bg-card flex items-center gap-2 shrink-0">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Scrivi un messaggio…"
        className="flex-1 resize-none p-3 border border-border rounded-2xl bg-background text-sm focus:ring-2 focus:ring-focus outline-none"
      />
      <Button onClick={onSend} variant="outline" className="p-5 rounded-4xl">
        <Send />
      </Button>
    </div>
  );
}

/* =====================
   RENDER DI UN MESSAGGIO
   ===================== */
function MessageRow({ msg }: any) {
  const mine = msg.author === "client";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} items-end gap-2`}>
      {!mine && (
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop&crop=faces"
          alt="Dott.ssa Laura Verdi"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <div
        className={
          "max-w-[70%] px-3 py-2 text-sm rounded-2xl " +
          (mine ? "bg-primary text-white rounded-tr-sm" : "bg-secondary text-white border border-border rounded-tl-sm")
        }
      >
        <div className="whitespace-pre-wrap leading-relaxed text-wrap w-max-250">{msg.text}</div>
        <div className={`text-[10px] mt-1 ${mine ? "text-neutral-300" : "text-neutral-400"} text-right`}>
          {formatTime(msg.time)}
        </div>
      </div>
      {mine && (
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop&crop=faces"
          alt="Profilo Utente"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
    </div>
  );
}

function DateChip({ date }: any) {
  const label = relativeDateLabel(date);
  return (
    <div className="flex justify-center">
      <span className="text-[11px] px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-neutral-200 text-neutral-600 ">{label}</span>
    </div>
  );
}

/* ---------- Utility ---------- */
function withDateChips(msgs: { id: string; author: string; text: string; time: number }[]) {
  const out: any[] = [];
  let lastKey = "";
  const sorted = [...msgs].sort((a, b) => a.time - b.time);
  for (const m of sorted) {
    const d = new Date(m.time);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (key !== lastKey) {
      out.push({ id: `date-${d.toISOString()}`, type: "date", date: d });
      lastKey = key;
    }
    out.push(m);
  }
  return out;
}

function seedMessages() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    { id: "m-1", author: "therapist", text: "Ciao! Sono la Dott.ssa Laura Verdi. Come posso aiutarti?", time: now - 7 * day },
    { id: "m-2", author: "client", text: "Buongiorno, ho dolore alla spalla quando alzo il braccio.", time: now - 7 * day + 5 * 60 * 1000 },
    { id: "m-3", author: "therapist", text: "Capisco. Da quanto tempo lo avverti?", time: now - 7 * day + 10 * 60 * 1000 },
    { id: "m-4", author: "client", text: "Da tre giorni, soprattutto la sera.", time: now - 2 * day + 14 * 60 * 1000 },
    { id: "m-5", author: "therapist", text: "Nel frattempo applica ghiaccio 10-15 minuti.", time: now - 2 * day + 20 * 60 * 1000 },
    { id: "m-6", author: "client", text: "Quanto costa la prima visita?", time: now - day + 8 * 60 * 1000 },
    { id: "m-7", author: "therapist", text: "Prima visita 50€, sedute successive 40€.", time: now - day + 10 * 60 * 1000 },
    { id: "m-8", author: "client", text: "Oggi pomeriggio ha disponibilità?", time: now - 2 * 60 * 60 * 1000 },
    { id: "m-9", author: "therapist", text: "Penso di si, ora controllo.", time: now - 90 * 60 * 1000 },
  ];
}

function formatTime(ts: string | number | Date) {
  const d = new Date(ts);
  return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

function relativeDateLabel(date: string | number | Date) {
  const d = new Date(date);
  const today = new Date();
  const dd = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const t0 = dd(today).getTime();
  const d0 = dd(d).getTime();
  const diff = Math.round((t0 - d0) / (24 * 60 * 60 * 1000));
  if (diff === 0) return "Oggi";
  if (diff === 1) return "Ieri";
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long" });
}

function generateReply(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes("costo") || lower.includes("prezzo")) return "Prima visita 50€, sedute successive 40€.";
  if (lower.includes("orari") || lower.includes("disponibil")) return "Disponibile lun-ven 9:00–18:00. Vuoi prenotare?";
  if (lower.includes("dolore")) return "Capisco. Da quanto tempo e in quali movimenti lo senti?";
  return "Capito, procediamo pure.";
}
