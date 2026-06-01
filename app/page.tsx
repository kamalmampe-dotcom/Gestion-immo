import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-primary-light">
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            ImmoGestion Premium
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Plateforme de gestion immobilière professionnelle. Gérez vos propriétés, locataires, contrats et paiements en un seul endroit.
          </p>
          
          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/login">
              <Button size="lg" className="bg-accent hover:bg-accent-light">
                Connexion
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Inscription
              </Button>
            </Link>
          </div>

          <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="space-y-2">
              <div className="text-3xl">🏠</div>
              <h3 className="font-bold">Gérez vos biens</h3>
              <p className="text-gray-400 text-sm">Cataloguez tous vos propriétés</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">👥</div>
              <h3 className="font-bold">Locataires</h3>
              <p className="text-gray-400 text-sm">Suivez vos locataires simplement</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">💰</div>
              <h3 className="font-bold">Paiements</h3>
              <p className="text-gray-400 text-sm">Gérez vos revenus facilement</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
