import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
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

    const votes = await prisma.vote.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            userVotes: true,
          },
        },
      },
    });

    return NextResponse.json(votes);
  } catch (error) {
    console.error("Erreur lors de la récupération des votes:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des votes" },
      { status: 500 }
    );
  }
} 