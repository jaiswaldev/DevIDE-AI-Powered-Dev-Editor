"use server";
import { currentUser } from "@/modules/auth/actions/index";
import { db } from "@/lib/db/client";
import type { PlaygroundWithUser } from "../types";

export const GetAllPlaygroundForUser = async (): Promise<PlaygroundWithUser[]> => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      console.warn("User not authenticated, returning empty playgrounds");
      return [];
    }

    const playgrounds = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return playgrounds as PlaygroundWithUser[];
  } catch (error) {
    console.error("Error fetching playgrounds:", error);
    return [];
  }
};

export const CreatePlayground = async (
  title: string,
  description?: string,
  template: string = "REACT"
) => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const playground = await db.playground.create({
      data: {
        title,
        description,
        template: template as any,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    return playground;
  } catch (error) {
    console.error("Error creating playground:", error);
    throw error;
  }
};

export const DeletePlayground = async (playgroundId: string) => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const playground = await db.playground.findUnique({
      where: { id: playgroundId },
    });

    if (!playground || playground.userId !== user.id) {
      throw new Error("Unauthorized to delete this playground");
    }

    await db.playground.delete({
      where: { id: playgroundId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting playground:", error);
    throw error;
  }
};
