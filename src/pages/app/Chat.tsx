import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import './Chat.css'


export default function ChatPage() {
  return (
    <div className="w-full h-[80%] flex items-center justify-center">
      <Card className="w-full h-full flex flex-col shadow-lg overflow-hidden">
        <ChatContainer />
      </Card>
    </div>
  );
}

function ChatContainer() {
  return (
    <div className="flex flex-col h-full">
      <HeaderFisio />
      <MessageList />
    </div>
  );
}

function HeaderFisio() {
  return (
    <header className="flex items-center gap-3 p-4 border-b border-neutral-200 bg-white sticky top-0 z-10">
      <button className="text-neutral-500 hover:text-black transition">
        <ArrowLeft size={20} />
      </button>
      <img
        src="https://images.unsplash.com/photo-1614280931023-60b734a0a3c3?q=80&w=200&auto=format&fit=crop&crop=faces"
        alt="Dott.ssa Laura Verdi"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="font-semibold leading-tight">Dott.ssa Laura Verdi</div>
        <div className="text-xs text-neutral-500">Fisioterapista • Online</div>
      </div>
    </header>
  );
}

function MessageList() {
  const [messages, setMessages] = useState(() => seedMessages());
  const [input, setInput] = useState("");
  const [therapistTyping, setTherapistTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => withDateChips(messages), [messages]);

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
    <CardContent className="flex-1 flex flex-col h-full p-0">
      {/* Area messaggi scrollabile */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto p-4 bg-neutral-50"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><defs><pattern id=\"p\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><circle cx=\"1\" cy=\"1\" r=\"0.5\" fill=\"%23d4d4d4\"/></pattern></defs><rect width=\"100%\" height=\"100%\" fill=\"%23f5f5f5\"/><rect width=\"100%\" height=\"100%\" fill=\"url(%23p)\" opacity=\"0.4\"/></svg>')",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="space-y-3">
          {items.map((m: any) =>
            m.type === "date" ? (
              <DateChip key={m.id} date={m.date} />
            ) : (
              <MessageRow key={m.id} msg={m} />
            )
          )}

          {therapistTyping && (
            <div className="flex items-end gap-2">
              <img
                src="https://images.unsplash.com/photo-1614280931023-60b734a0a3c3?q=80&w=200&auto=format&fit=crop&crop=faces"
                alt="Dott.ssa Laura Verdi"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="max-w-[70%] rounded-2xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-700 inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-neutral-400 animate-pulse"></span>
                Sta scrivendo…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra input fissa in basso */}
      <div className="border-t border-neutral-200 p-3 bg-white sticky bottom-0 z-10 flex items-end gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un messaggio…"
          className="flex-1 resize-none p-3 border border-neutral-200 rounded-2xl bg-white text-sm focus:ring-2 focus:ring-neutral-300 outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 active:scale-[0.98] transition"
        >
          Invia
        </button>
      </div>
    </CardContent>
  );
}

function MessageRow({ msg }: any) {
  const mine = msg.author === "client";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} items-end gap-2`}>
      {!mine && (
        <img
          src="https://images.unsplash.com/photo-1614280931023-60b734a0a3c3?q=80&w=200&auto=format&fit=crop&crop=faces"
          alt="Dott.ssa Laura Verdi"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
      <div
        className={
          "max-w-[70%] px-3 py-2 text-sm rounded-2xl " +
          (mine
            ? "bg-black text-white rounded-tr-sm"
            : "bg-white text-neutral-900 border border-neutral-200 rounded-tl-sm")
        }
      >
        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
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
      <span className="text-[11px] px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-neutral-200 text-neutral-600">
        {label}
      </span>
    </div>
  );
}

/* ---------- Utility ---------- */

function withDateChips(msgs: { id: string; author: string; text: string; time: number }[]) {
  const out = [];
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
    { id: "m-9", author: "therapist", text: "Sì, alle 17:30 oppure 18:30. Preferenze?", time: now - 90 * 60 * 1000 },
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
  return "Capito 👍, approfondiamo nella prossima seduta.";
}
