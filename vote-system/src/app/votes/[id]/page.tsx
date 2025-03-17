import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { VoteForm } from "@/components/vote-form";
import { notFound } from "next/navigation";


type Props = {
  params: Promise<{ id: string }>;
};

export default async function VotePage({ params }: Props) {
  const user = await getCurrentUser();
  const { id } = await params;

  const vote = await prisma.vote.findUnique({
    where: { id },
    include: {
      options: true,
      userVotes: {
        where: user ? { userId: user.id } : undefined,
      },
    },
  });

  if (!vote) {
    notFound();
  }

  const hasVoted = user && vote.userVotes.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{vote.title}</h1>
        {vote.description && (
          <p className="text-muted-foreground mt-2">{vote.description}</p>
        )}
      </div>

      {!hasVoted && vote.isActive ? (
        <VoteForm vote={vote} />
      ) : (
        <div className="text-center py-8">
          {!vote.isActive ? (
            <p className="text-muted-foreground">Ce vote est actuellement fermé.</p>
          ) : (
            <p className="text-muted-foreground">Vous avez déjà voté.</p>
          )}
        </div>
      )}
    </div>
  );
} 