"use client";

import * as React from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { profile, loading, signIn } = useAuth();
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email) {
      toast({ title: "Ingresa un correo", description: "Necesitamos un email para enviarte el link." });
      return;
    }
    setPending(true);
    try {
      await signIn(email);
      toast({
        title: "Revísalo en tu correo",
        description: "Te enviamos un enlace mágico para iniciar sesión.",
      });
    } catch (error) {
      console.error("sign in error", error);
      toast({
        title: "No se pudo iniciar sesión",
        description: "Intenta nuevamente con un correo válido.",
      });
    } finally {
      setPending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando sesión…
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg">
          <h1 className="text-2xl font-semibold">Bienvenido a EduChain</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo para recibir un enlace mágico que te permitirá acceder al panel.
          </p>
          <div className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@escuela.edu"
              className="w-full"
            />
            <Button className="w-full" onClick={handleLogin} disabled={pending}>
              {pending ? "Enviando…" : "Enviar enlace"}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return <Dashboard />;
}
