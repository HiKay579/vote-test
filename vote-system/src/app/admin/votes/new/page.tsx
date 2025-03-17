"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function NewVotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<string[]>(["", ""]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const endDate = formData.get("endDate") as string;
    const validOptions = options.filter((option) => option.trim() !== "");

    if (validOptions.length < 2) {
      toast.error("Au moins deux options sont requises");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/votes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          options: validOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du vote");
      }

      const vote = await response.json();
      toast.success("Vote créé avec succès");
      router.push(`/votes/${vote.id}`);
    } catch (error) {
      console.error("Erreur lors de la création du vote:", error);
      toast.error("Une erreur est survenue lors de la création du vote");
    } finally {
      setIsSubmitting(false);
    }
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  }

  function updateOption(index: number, value: string) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Créer un nouveau vote</h1>
        <p className="text-muted-foreground mt-2">
          Définissez les détails et les options de votre vote
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Titre
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full p-2 border rounded-md"
            placeholder="Titre du vote"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description (optionnelle)
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full p-2 border rounded-md h-24"
            placeholder="Description du vote"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            Date de fin (optionnelle)
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Options</label>
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              size="sm"
            >
              Ajouter une option
            </Button>
          </div>

          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeOption(index)}
                  size="icon"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création en cours..." : "Créer le vote"}
        </Button>
      </form>
    </div>
  );
} 