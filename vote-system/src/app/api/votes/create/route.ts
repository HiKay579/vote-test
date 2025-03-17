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

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, endDate, options } = body;

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Titre et au moins deux options sont requis" },
        { status: 400 }
      );
    }

    const vote = await prisma.vote.create({
      data: {
        title,
        description,
        endDate: endDate ? new Date(endDate) : null,
        createdById: user.id,
        options: {
          create: options.map((text: string) => ({
            text,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du vote:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du vote" },
      { status: 500 }
    );
  }
} 