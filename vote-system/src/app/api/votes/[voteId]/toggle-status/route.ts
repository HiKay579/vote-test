import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ voteId: string }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await requireAdmin();
    const { voteId } = await context.params;

    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!vote) {
      return NextResponse.json(
        { message: "Vote non trouvé" },
        { status: 404 }
      );
    }

    const updatedVote = await prisma.vote.update({
      where: { id: voteId },
      data: {
        isActive: !vote.isActive,
      },
    });

    return NextResponse.json(updatedVote);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
} 