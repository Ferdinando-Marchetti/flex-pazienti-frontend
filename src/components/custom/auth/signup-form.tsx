import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import React, { useState } from "react"; 
import { Textarea } from "@/components/ui/textarea"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useAuth } from "@/context/AuthContext"; // ✅ Assumi che il percorso del provider sia questo

// Definizione dei dati del modulo
interface FormData {
  nome: string;
  cognome: string;
  data_nascita: string;
  genere: 'M' | 'F' | 'Altro' | '';
  altezza: number | null;
  peso: number | null;
  diagnosi: string;
  email: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { registerCheckEmail, registerComplete } = useAuth(); // ✅ Hook dal provider
  
  const [phase, setPhase] = useState<'email' | 'complete'>('email');
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cognome: '',
    data_nascita: '',
    genere: '',
    altezza: null,
    peso: null,
    diagnosi: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gestore per i cambiamenti di input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Conversione per campi numerici (accetta stringa vuota per null)
      [id]: (id === 'altezza' || id === 'peso') 
            ? (value === '' ? null : parseFloat(value)) 
            : value,
    }));
  };
  
  // Gestore per i cambiamenti di select
  const handleSelectChange = (id: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // 🔄 Funzione per la verifica dell'email (Fase 1)
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        // ✅ Chiama la funzione di verifica dal Provider
        await registerCheckEmail(formData.email);
        
        // Se la chiamata ha successo (risposta 202/Accepted)
        setPhase('complete');
        
    } catch (err: any) {
        // Se la chiamata fallisce (es. 404 Not Found o 409 Conflict)
        const errorMessage = (err && typeof err === 'string') ? err : "Impossibile verificare l'email.";
        setError(errorMessage);
        
    } finally {
        setLoading(false);
    }
  };

  // 📝 Funzione per la registrazione completa (Fase 2)
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Controlli minimali aggiuntivi prima dell'invio (potresti usare una libreria come Zod o Yup)
    if (!formData.nome || !formData.cognome || !formData.data_nascita || !formData.password || !formData.genere) {
        setError("Per favore, compila tutti i campi obbligatori.");
        setLoading(false);
        return;
    }

    try {
        // ✅ Chiama la funzione di registrazione completa dal Provider
        await registerComplete(
            formData.nome,
            formData.cognome,
            formData.data_nascita,
            formData.genere as 'M' | 'F' | 'Altro', // Cast necessario dopo il controllo
            formData.altezza,
            formData.peso,
            formData.diagnosi,
            formData.email,
            formData.password
        );
        
        // La navigazione avviene all'interno del login/registerComplete nel provider
        // Qui si può aggiungere un messaggio di successo locale se necessario
        
    } catch (err: any) {
        // Gestione errore (es. un problema con i dati inviati)
        const errorMessage = (err && typeof err === 'string') ? err : "Errore durante la registrazione. Riprova.";
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  // Funzione per tornare alla fase di verifica email
  const handleBackToEmail = () => {
    setPhase('email');
    setError(null);
  }

  // --- RENDERING FASE 1: VERIFICA EMAIL ---
  if (phase === 'email') {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="bg-muted relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1716996236807-a45afca9957a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=754"
                alt="Immagine di sfondo per il Sign Up"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
            <form className="p-6 md:p-8" onSubmit={handleEmailCheck}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Verifica la tua Email</h1>
                  <p className="text-muted-foreground text-balance">
                    Inserisci l'email fornita dal tuo fisioterapista.
                  </p>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  {error && (
                    <FieldDescription className="text-red-500">{error}</FieldDescription>
                  )}
                </Field>

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Verifica..." : "Verifica Email"}
                  </Button>
                </Field>

                <FieldDescription className="text-center">
                  Hai già un account? <Link to="/login">Login</Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        
        <FieldDescription className="px-6 text-center">
          Cliccando su "Verifica Email", accetti i nostri <a href="#">Termini di Servizio</a>{" "}
          e la nostra <a href="#">Politica sulla Privacy</a>.
        </FieldDescription>
      </div>
    );
  }

  // --- RENDERING FASE 2: REGISTRAZIONE COMPLETA ---
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Colonna dell'Immagine */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1716996236807-a45afca9957a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=754"
              alt="Immagine di sfondo per il Sign Up"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          {/* Colonna del Modulo di Registrazione Completa */}
          <form className="p-6 md:p-8" onSubmit={handleCompleteRegistration}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Completa la Registrazione</h1>
                <p className="text-muted-foreground text-balance">
                  {`Stai completando l'account per: ${formData.email}`}
                </p>
              </div>

              {/* Campi Nome e Cognome */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="nome">Nome *</FieldLabel>
                  <Input id="nome" type="text" onChange={handleInputChange} value={formData.nome} required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="cognome">Cognome *</FieldLabel>
                  <Input id="cognome" type="text" onChange={handleInputChange} value={formData.cognome} required />
                </Field>
              </div>
              
              {/* Campo Data di Nascita */}
              <Field>
                <FieldLabel htmlFor="data_nascita">Data di Nascita *</FieldLabel>
                <Input id="data_nascita" type="date" onChange={handleInputChange} value={formData.data_nascita} required />
              </Field>

              {/* Campo Genere */}
              <Field>
                <FieldLabel htmlFor="genere">Genere *</FieldLabel>
                <Select required onValueChange={(value) => handleSelectChange('genere', value)} value={formData.genere}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleziona il genere" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="M">Maschio</SelectItem>
                        <SelectItem value="F">Femmina</SelectItem>
                        <SelectItem value="Altro">Altro</SelectItem>
                    </SelectContent>
                </Select>
              </Field>

              {/* Campi Altezza e Peso */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="altezza">Altezza (cm)</FieldLabel>
                  {/* Nota: uso text perché il tipo number può causare problemi di formattazione locale */}
                  <Input 
                    id="altezza" 
                    type="text" 
                    pattern="[0-9]*[.]?[0-9]*"
                    inputMode="decimal"
                    placeholder="es. 175.5" 
                    onChange={handleInputChange} 
                    value={formData.altezza === null ? '' : formData.altezza.toString()}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="peso">Peso (kg)</FieldLabel>
                   <Input 
                    id="peso" 
                    type="text" 
                    pattern="[0-9]*[.]?[0-9]*"
                    inputMode="decimal"
                    placeholder="es. 70.2" 
                    onChange={handleInputChange} 
                    value={formData.peso === null ? '' : formData.peso.toString()}
                  />
                </Field>
              </div>

              {/* Campo Password (impostata qui la prima volta) */}
              <Field>
                <FieldLabel htmlFor="password">Imposta Password *</FieldLabel>
                <Input id="password" type="password" required onChange={handleInputChange} value={formData.password} />
                <FieldDescription>Questa sarà la tua password di accesso.</FieldDescription>
              </Field>

              {/* Campo Diagnosi */}
              <Field>
                <FieldLabel htmlFor="diagnosi">Diagnosi (opzionale)</FieldLabel>
                <Textarea id="diagnosi" placeholder="Breve descrizione della diagnosi" onChange={handleInputChange} value={formData.diagnosi} />
              </Field>

              {error && (
                <FieldDescription className="text-red-500 text-center">{error}</FieldDescription>
              )}

              {/* Bottone Registrati / Indietro */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Registrazione..." : "Completa la Registrazione"}
                </Button>
              </Field>
              <Button type="button" variant="outline" onClick={handleBackToEmail}>
                Indietro
              </Button>
              
              {/* Link al Login */}
              <FieldDescription className="text-center">
                Hai già un account? <Link to="/login">Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      
      {/* Testo Legale */}
      <FieldDescription className="px-6 text-center">
        Cliccando su "Completa la Registrazione", accetti i nostri <a href="#">Termini di Servizio</a>{" "}
        e la nostra <a href="#">Politica sulla Privacy</a>.
      </FieldDescription>
    </div>
  );
}