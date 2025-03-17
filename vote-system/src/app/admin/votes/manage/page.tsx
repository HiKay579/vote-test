"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vote {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  _count: {
    userVotes: number;
  };
}

export default function ManageVotesPage() {
  const router = useRouter();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVotes();
  }, []);

  async function fetchVotes() {
    try {
      const response = await fetch("/api/votes/manage");
      if (!response.ok) throw new Error("Erreur lors du chargement des votes");
      const data = await response.json();
      setVotes(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des votes");
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleVoteStatus(voteId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/votes/${voteId}/toggle-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("Erreur lors de la modification du statut");
      
      toast.success(`Vote ${currentStatus ? "désactivé" : "activé"} avec succès`);
      fetchVotes();
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    }
  }

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des votes</h1>
          <p className="text-muted-foreground mt-2">
            Gérez et surveillez tous les votes
          </p>
        </div>
        <Button onClick={() => router.push("/admin/votes/new")}>
          Créer un nouveau vote
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Nombre de votes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {votes.map((vote) => (
              <TableRow key={vote.id}>
                <TableCell>{vote.title}</TableCell>
                <TableCell>{vote.description || "-"}</TableCell>
                <TableCell>
                  {new Date(vote.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {vote.endDate ? new Date(vote.endDate).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vote.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vote.isActive ? "Actif" : "Inactif"}
                  </span>
                </TableCell>
                <TableCell>{vote._count.userVotes}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/votes/${vote.id}/results`)}
                  >
                    Résultats
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleVoteStatus(vote.id, vote.isActive)}
                  >
                    {vote.isActive ? "Désactiver" : "Activer"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 