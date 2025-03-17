"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Vote } from "@/types";
import { Button } from "@/components/ui/button";

interface VoteFormProps {
  vote: Vote;
  userId: string;
}

export function VoteForm({ vote, userId }: VoteFormProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOption) {
      toast.error("Veuillez sélectionner une option");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/votes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voteId: vote.id,
          optionId: selectedOption,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission du vote");
      }

      toast.success("Vote enregistré avec succès");
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la soumission du vote");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {vote.options.map((option) => (
          <label
            key={option.id}
            className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOption === option.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <input
              type="radio"
              name="vote-option"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="h-4 w-4"
            />
            <span className="flex-1">{option.text}</span>
          </label>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || !selectedOption}
      >
        {isSubmitting ? "Enregistrement..." : "Voter"}
      </Button>
    </form>
  );
} 