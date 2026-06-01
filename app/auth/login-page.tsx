"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-lighter flex items-center justify-center px-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center space-y-2 text-white">
          <div className="inline-block p-3 bg-white/10 rounded-xl mb-4">
            <div className="text-2xl">🏠</div>
          </div>
          <h1 className="text-3xl font-bold">ImmoGestion Premium</h1>
          <p className="text-white/70">Gestion immobilière professionnel</p>
        </div>

        {/* Form */}
        <AuthForm type="login" onSuccess={() => router.push("/dashboard")} />

        {/* Footer */}
        <p className="text-center text-white/60 text-sm">
          © 2024 ImmoGestion Cameroun. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
