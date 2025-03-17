import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteForm } from "@/components/vote-form";
import { VoteResults } from "@/components/vote-results";

interface VotePageProps {
  params: {
    id: string;
  };
}

export default async function VotePage({ params }: VotePageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    return notFound();
  }

  const vote = await prisma.vote.findUnique({
    where: {
      id: params.id,
    },
    include: {
      options: {
        include: {
          _count: {
            select: {
              userVotes: true,
            },
          },
        },
      },
      userVotes: {
        where: {
          userId: user.id,
        },
        include: {
          option: true,
        },
      },
      _count: {
        select: {
          userVotes: true,
        },
      },
    },
  });

  if (!vote) {
    return notFound();
  }

  const hasVoted = vote.userVotes.length > 0;
  const userVote = vote.userVotes[0];
  const totalVotes = vote._count.userVotes;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{vote.title}</h1>
        {vote.description && (
          <p className="text-muted-foreground">{vote.description}</p>
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

      {hasVoted ? (
        <VoteResults vote={vote} userVoteId={userVote.optionId} />
      ) : (
        <VoteForm vote={vote} userId={user.id} />
      )}
    </div>
  );
} 