import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-options";
import { Role } from "@prisma/client";
import { prisma } from "./prisma";
import { User } from "@/types";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  if (user.role !== Role.ADMIN) {
    redirect("/unauthorized");
  }
  
  return user;
} 