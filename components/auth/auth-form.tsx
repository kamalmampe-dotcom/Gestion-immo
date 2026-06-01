"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AuthFormProps {
  type: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthForm({ type, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{type === "login" ? "Connexion" : "Inscription"}</CardTitle>
        <CardDescription>
          {type === "login"
            ? "Accédez à votre compte ImmoGestion"
            : "Créez votre compte ImmoGestion"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : type === "login" ? "Se connecter" : "S'inscrire"}
          </Button>

          <div className="text-center text-sm">
            {type === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <Link href="/auth/sign-up" className="text-accent hover:underline font-medium">
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{" "}
                <Link href="/auth/login" className="text-accent hover:underline font-medium">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
