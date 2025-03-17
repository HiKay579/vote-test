import Link from "next/link";
import { Vote } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center">
      <Vote className="h-16 w-16 mb-6 text-primary" />
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur le Système de Vote</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Une plateforme simple et sécurisée pour organiser et participer à des votes en ligne.
      </p>
      <div className="flex gap-4">
        {user ? (
          <Link href="/votes">
            <Button size="lg">Voir les votes en cours</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="lg">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button size="lg">Inscription</Button>
            </Link>
          </>
        )}
      </div>
      {user?.role === "ADMIN" && (
        <Link href="/admin/votes/new" className="mt-4">
          <Button variant="outline">Créer un nouveau vote</Button>
        </Link>
      )}
    </div>
  );
}
