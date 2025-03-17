import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VoteCard } from "@/components/vote-card";

export default async function VotesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  const votes = await prisma.vote.findMany({
    where: {
      isActive: true,
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
      _count: {
        select: {
          userVotes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Votes en cours</h1>
        <p className="text-muted-foreground mt-2">
          Participez aux votes actifs et faites entendre votre voix
        </p>
      </div>

      {votes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun vote actif pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {votes.map((vote) => (
            <VoteCard key={vote.id} vote={vote} userId={user.id} />
          ))}
        </div>
      )}
    </div>
  );
} 