import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { voteId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isActive } = body;

    const vote = await prisma.vote.update({
      where: {
        id: params.voteId,
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Erreur lors de la modification du statut du vote:", error);
    return NextResponse.json(
      { message: "Erreur lors de la modification du statut du vote" },
      { status: 500 }
    );
  }
} 