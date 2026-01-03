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
   const user = await auth();
   return user?.user;
}


