"use server";
import {db} from "@/lib/db/client";
import { TemplateFolder } from "../lib/initialFolder-to-json";
import { currentUser } from "@/modules/auth/actions";

export const getPlaygroundDataById = async (playgroundId: string) => {
    try{
        const playground = await db.playground.findUnique({
            where: { id: playgroundId },
            select:{
                id: true,
                title: true,
                description: true,
                template: true,
                templateFiles:{
                    select:{
                        content:true
                    }
                }
            }

        });
        return playground;
    }catch(error){
        console.error("Error fetching playground by ID:", error);
        return null;
    } 
}


export const SaveUpdatedCode = async(playgroundId:string, data: TemplateFolder)=>{
    const user = await currentUser();
    if(!user){
        throw new Error("Unauthorized");
    }

    try{
        const updatedPlayground = await db.templateFile.upsert({
            where:{
                playgroundId
            },
            update:{
                content:JSON.stringify(data)
            },
            create:{
                playgroundId,
                content:JSON.stringify(data)
            }
        })
        return updatedPlayground;
    }catch(error){
        console.error("Error saving updated code:", error);
        throw new Error("Failed to save updated code");
    }
}