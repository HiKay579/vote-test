"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface VoteResult {
  id: string;
  title: string;
  description: string | null;
  options: {
    id: string;
    text: string;
    _count: {
      userVotes: number;
    };
    userVotes: {
      user: {
        id: string;
        name: string | null;
        email: string;
      };
    }[];
  }[];
  _count: {
    userVotes: number;
  };
}

interface VoteResultsClientProps {
  voteId: string;
}

export default function VoteResultsClient({ voteId }: VoteResultsClientProps) {
  const router = useRouter();
  const [results, setResults] = useState<VoteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const response = await fetch(`/api/votes/${voteId}/results`);
      if (!response.ok) throw new Error("Erreur lors du chargement des résultats");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Erreur lors du chargement des résultats:", error);
      toast.error("Erreur lors du chargement des résultats");
    } finally {
      setIsLoading(false);
    }
  }, [voteId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (isLoading) {
    return <div className="text-center">Chargement...</div>;
  }

  if (!results) {
    return <div className="text-center">Vote non trouvé</div>;
  }

  const totalVotes = results._count.userVotes;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Résultats du vote</h1>
        <p className="text-muted-foreground mt-2">{results.title}</p>
        {results.description && (
          <p className="text-muted-foreground mt-1">{results.description}</p>
        )}
      </div>

      <div className="space-y-6">
        {results.options.map((option) => {
          const percentage = totalVotes > 0
            ? Math.round((option._count.userVotes / totalVotes) * 100)
            : 0;

          return (
            <div key={option.id} className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{option.text}</span>
                <span>
                  {option._count.userVotes} vote{option._count.userVotes > 1 ? "s" : ""} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {option.userVotes.length > 0 && (
                <div className="pl-4 text-sm text-muted-foreground">
                  <p className="mb-1 font-medium">Votants :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {option.userVotes.map(({ user }) => (
                      <li key={user.id}>
                        {user.name || user.email}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-muted-foreground">
        Total des votes : {totalVotes}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.push("/admin/votes/manage")}>
          Retour à la gestion des votes
        </Button>
      </div>
    </div>
  );
} 