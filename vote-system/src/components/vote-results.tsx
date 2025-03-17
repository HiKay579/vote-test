"use client";

import { Vote } from "@/types";

interface VoteResultsProps {
  vote: Vote;
  userVoteId: string;
}

export function VoteResults({ vote, userVoteId }: VoteResultsProps) {
  const totalVotes = vote._count?.userVotes || 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {vote.options.map((option) => {
          const votes = option._count?.userVotes || 0;
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

          return (
            <div
              key={option.id}
              className={`space-y-2 ${
                option.id === userVoteId ? "bg-primary/5 p-4 rounded-lg" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {option.text}
                  {option.id === userVoteId && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Votre vote)
                    </span>
                  )}
                </span>
                <span className="text-sm text-muted-foreground">
                  {votes} vote{votes !== 1 ? "s" : ""} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Total: {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  );
} 