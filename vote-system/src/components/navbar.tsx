import Link from "next/link";
import { Vote } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Vote className="h-6 w-6" />
            <span>Système de Vote</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Accueil
            </Link>
            {user?.role === "ADMIN" && (
              <Link href="/admin/votes/manage" className="text-sm font-medium hover:underline">
                Administration
              </Link>
            )}
            <Link href="/votes" className="text-sm font-medium hover:underline">
              Votes
            </Link>
          </nav>
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
}

<Button variant="destructive" size="lg">Supprimer</Button> 