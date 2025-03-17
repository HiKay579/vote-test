import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { voteId, optionId } = await request.json();

    if (!voteId || !optionId) {
      return NextResponse.json(
        { message: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier si le vote existe et est actif
    const vote = await prisma.vote.findUnique({
      where: {
        id: voteId,
        isActive: true,
      },
      include: {
        options: true,
        userVotes: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    if (!vote) {
      return NextResponse.json(
        { message: "Vote non trouvé ou inactif" },
        { status: 404 }
      );
    }

    // Vérifier si l'option existe dans ce vote
    const optionExists = vote.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return NextResponse.json(
        { message: "Option de vote invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur a déjà voté
    if (vote.userVotes.length > 0) {
      return NextResponse.json(
        { message: "Vous avez déjà voté" },
        { status: 400 }
      );
    }

    // Enregistrer le vote
    const userVote = await prisma.userVote.create({
      data: {
        userId: user.id,
        voteId,
        optionId,
      },
    });

    return NextResponse.json(userVote, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la soumission du vote:", error);
    return NextResponse.json(
      { message: "Erreur lors de la soumission du vote" },
      { status: 500 }
    );
  }
} 