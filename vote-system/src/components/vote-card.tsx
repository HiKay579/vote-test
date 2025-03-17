import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Vote } from "@/types";
import { Button } from "@/components/ui/button";

interface VoteCardProps {
  vote: Vote;
  userId: string;
}

export function VoteCard({ vote, userId }: VoteCardProps) {
  const hasVoted = vote.userVotes?.some((v) => v.userId === userId);
  const totalVotes = vote._count?.userVotes || 0;

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{vote.title}</h3>
          {vote.description && (
            <p className="text-muted-foreground text-sm">{vote.description}</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Début:</span>{" "}
            {format(new Date(vote.startDate), "Pp", { locale: fr })}
          </p>
          {vote.endDate && (
            <p>
              <span className="text-muted-foreground">Fin:</span>{" "}
              {format(new Date(vote.endDate), "Pp", { locale: fr })}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Participants:</span>{" "}
            {totalVotes}
          </p>
        </div>

        <Link href={`/votes/${vote.id}`}>
          <Button className="w-full" variant={hasVoted ? "outline" : "default"}>
            {hasVoted ? "Voir les résultats" : "Voter"}
          </Button>
        </Link>
      </div>
    </div>
  );
} 