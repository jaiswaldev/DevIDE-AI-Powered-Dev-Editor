"use server"
import {auth} from "@/auth/auth";

import {db} from "@/lib/db/client";

export const getUserById =  async (userId: string) => {
    try{
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { accounts: true },
        });
        return user;
    }catch(error){
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export const getAccountByUserId = async (userId: string) => {
    try{
        const account = await db.account.findFirst({    
            where: { userId: userId },
        });
        return account;
    }catch(error){
        console.error("Error fetching account by user ID:", error);
        return null;
    }
}

export const currentUser = async () => {
   try {
     const session = await auth();
     if (!session?.user?.email) {
       return null;
     }

     // Look up the user in the database by email to get the correct database ID
     const dbUser = await db.user.findUnique({
       where: { email: session.user.email }
     });

     if (!dbUser) {
       console.warn("[currentUser] User not found in database for email:", session.user.email);
       return null;
     }

     // Return the database user with session user properties merged
     return {
       id: dbUser.id,
       name: dbUser.name,
       email: dbUser.email,
       image: dbUser.image,
       role: dbUser.role,
     };
   } catch (error) {
     console.error("[currentUser] Error getting current user:", error);
     return null;
   }
}


