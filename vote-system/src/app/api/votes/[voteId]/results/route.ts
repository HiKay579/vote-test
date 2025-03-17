import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ voteId: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();
    const { voteId } = await context.params;

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

    const vote = await prisma.vote.findUnique({
      where: {
        id: voteId,
      },
      include: {
        options: {
          include: {
            _count: {
              select: {
                userVotes: true,
              },
            },
            userVotes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
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
    });

    if (!vote) {
      return NextResponse.json(
        { message: "Vote non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des résultats" },
      { status: 500 }
    );
  }
} 