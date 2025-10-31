import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { checkEmail, login, registerComplete } = useAuth();

  const [step, setStep] = useState<"email" | "password" | "register">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (step === "email") {
      setLoading(true);
      try {
        // ✅ Verifica email con checkEmail
        const res = await checkEmail(email);
        if((res as any).statusCode === 409){
          setStep("password");
        }else if((res as any).statusCode === 202){
          setStep("register");
        }else {
          setError("Errore sconosciuto.");
        }
        setLoading(false)
      } catch (err: any) {
        console.log(err)  
      }
    } 
    else if (step === "password") {
      // ✅ Login
      try {
        setLoading(true);
        await login(email, password);
      } catch (err: any) {
        setError("Credenziali non valide");
      } finally {
        setLoading(false);
      }
    } 
    else if (step === "register") {
      // ✅ Completamento registrazione
      try {
        setLoading(true);
        await registerComplete(email, password);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Errore durante la registrazione");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  {step === "email"
                    ? "Benvenuto!"
                    : step === "password"
                    ? "Inserisci la password"
                    : "Imposta la tua password"}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {step === "email"
                    ? "Inserisci la tua email per continuare"
                    : step === "password"
                    ? "Accedi al tuo account FlexiFisio"
                    : "Completa la registrazione per accedere"}
                </p>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={step !== "email"}
                />
              </Field>

              {/* Password (mostrata solo se necessario) */}
              {(step === "password" || step === "register") && (
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
              )}

              {/* Messaggi di errore */}
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}

              {/* Pulsante */}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Attendere..."
                    : step === "email"
                    ? "Continua"
                    : step === "password"
                    ? "Login"
                    : "Imposta password"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Non hai un account? Contatta il tuo fisioterapista
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1716996236807-a45afca9957a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=754"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
