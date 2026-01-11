"use server";
import { currentUser } from "@/modules/auth/actions/index";
import { db } from "@/lib/db/client";
import type { PlaygroundWithUser } from "../types";
import { revalidatePath } from "next/cache";

export const GetAllPlaygroundForUser = async (): Promise<PlaygroundWithUser[]> => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      console.warn("[GetAllPlaygroundForUser] User not authenticated, returning empty playgrounds");
      return [];
    }

    // console.log("[GetAllPlaygroundForUser] Fetching playgrounds for user:", user.id);
    
    const playgrounds = await db.playground.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        StarMark: {
          where: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // console.log("[GetAllPlaygroundForUser] Found playgrounds:", playgrounds?.length || 0, playgrounds?.map((p: any) => ({ id: p.id, title: p.title })));
    
    return playgrounds as PlaygroundWithUser[];
  } catch (error) {
    console.error("[GetAllPlaygroundForUser] Error fetching playgrounds:", error);
    return [];
  }
};

export const CreatePlayground = async (
  data:{
    title: string;
    description?: string | undefined;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  }
) => {
  try {
    // console.log("[CreatePlayground] Starting with data:", data);
    
    // Wrap currentUser in try-catch to handle auth errors gracefully
    let user;
    try {
      user = await currentUser();
      // console.log("[CreatePlayground] Current user:", user ? `User ID: ${user.id}` : "No user");
    } catch (authError) {
      // console.error("[CreatePlayground] Error getting current user:", authError);
      throw new Error("Authentication failed: Unable to get current user");
    }
    
    const { title, template, description } = data;
    
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // console.log("[CreatePlayground] Creating playground in database...");

    const createdPlayground = await db.playground.create({
        data: {
          title,
          description: description || null,
          template: template as "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR",
          userId: user.id,
        },
      });

    // let playground;
    // try {
    //   // First, create the playground without including relations
    //   const createdPlayground = await db.playground.create({
    //     data: {
    //       title,
    //       description: description || null,
    //       template: template as "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR",
    //       userId: user.id,
    //     },
    //   });

    //   // console.log("[CreatePlayground] Playground created with ID:", createdPlayground.id);

    //   // Then fetch it with relations
    //   playground = await db.playground.findUnique({
    //     where: { id: createdPlayground.id },
    //     include: {
    //       user: true,
    //       StarMark: {
    //         where: {
    //           userId: user.id,
    //         },
    //       },
    //     },
    //   });
    // } catch (dbError) {
    //   console.error("[CreatePlayground] Database operation failed:", dbError);
    //   const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
    //   throw new Error(`Database operation failed: ${errorMessage}. Please check your database connection and ensure DATABASE_URL is configured correctly.`);
    // }

    console.log("[CreatePlayground] Database operation completed. Result:", createdPlayground);

    if (!createdPlayground || !createdPlayground.id) {
      console.error("[CreatePlayground] Playground created but fetch returned null:", createdPlayground);
      throw new Error("Database operation failed: Playground was created but could not be retrieved. Please check your database connection.");
    }

    // console.log("[CreatePlayground] Playground created successfully:", {
    //   id: playground.id,
    //   title: playground.title,
    //   userId: playground.userId,
    // });

    // console.log("[CreatePlayground] Revalidating /dashboard path...");
    try {
      revalidatePath("/dashboard");
    } catch (revalidateError) {
      console.error("[CreatePlayground] Revalidation error (non-fatal):", revalidateError);
      // Don't throw - revalidation errors shouldn't prevent success
    }
    
    // console.log("[CreatePlayground] Returning playground:", {
    //   id: playground.id,
    //   title: playground.title,
    // });
    
    // Return a serializable object with only necessary fields
    // Prisma Date objects serialize automatically, but we ensure user object is plain
    return {
      id: createdPlayground.id,
      title: createdPlayground.title,
      description: createdPlayground.description,
      template: createdPlayground.template,
      userId: createdPlayground.userId,
      createdAt: createdPlayground.createdAt,
      updatedAt: createdPlayground.updatedAt,
      user: createdPlayground.user ? {
        id: createdPlayground.user.id,
        name: createdPlayground.user.name,
        email: createdPlayground.user.email,
        image: createdPlayground.user.image,
        role: createdPlayground.user.role,
        createdAt: createdPlayground.user.createdAt,
        updatedAt: createdPlayground.user.updatedAt,
      } : null,
      StarMark: Array.isArray(createdPlayground.StarMark) ? createdPlayground.StarMark.map((mark: any) => ({
        id: mark.id,
        isMarked: mark.isMarked,
        createdAt: mark.createdAt,
      })) : [],
    };
  } catch (error) {
    console.error("[CreatePlayground] Error creating playground:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CreatePlayground] Error details:", errorMessage);
    // Re-throw with a serializable error message
    throw new Error(`Failed to create playground: ${errorMessage}`);
  }
};

export const DeletePlayground = async (playgroundId: string): Promise<void> => {
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
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting playground:", error);
    throw error;
  }
};

export const UpdatePlayground = async (
  playgroundId: string,
  data: {
    title?: string;
    description?: string;
  }
): Promise<void> => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const playground = await db.playground.findUnique({
      where: { id: playgroundId },
    });

    if (!playground || playground.userId !== user.id) {
      throw new Error("Unauthorized to update this playground");
    }

    await db.playground.update({
      where: { id: playgroundId },
      data: {
        ...data,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating playground:", error);
    throw error;
  }
};

export const DuplicatePlayground = async (playgroundId: string): Promise<void> => {
  try {
    const user = await currentUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const playground = await db.playground.findUnique({
      where: { id: playgroundId },
    });

    if (!playground || playground.userId !== user.id) {
      throw new Error("Unauthorized to duplicate this playground");
    }

    await db.playground.create({
      data: {
        title: `${playground.title} (Copy)`,
        description: playground.description,
        template: playground.template,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error duplicating playground:", error);
    throw error;
  }
};


