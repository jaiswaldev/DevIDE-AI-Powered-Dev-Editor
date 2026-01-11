
"use client";

import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";
import TemplateSelevtionModal from "./template-selection-modal"
import { CreatePlayground } from "@/modules/dashboard/actions";

const AddNewProjectButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    description?: string | undefined;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    description?: string | undefined;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  }) => {
    try {
      setSelectedTemplate(data);
      // console.log("Creating Playground with data:", data);
      const res = await CreatePlayground(data);
      // console.log("Created Playground:", res);
      
      if (!res?.id){
        toast.error("Failed to create project: No ID returned");
        return;
      }
      
      toast.success("Project created successfully");
      setIsModalOpen(false);
      
      // Refresh the router cache to update the dashboard with the new project
      router.refresh();
      
      // Navigate to the playground page after a short delay to ensure refresh completes
      setTimeout(() => {
        router.push(`/playground/${res.id}`);
      }, 100);
    } catch (error) {
      console.error("Error creating playground:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error details:", errorMessage);
      toast.error(`Failed to create project: ${errorMessage}`);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group px-6 py-6 flex flex-row justify-between items-center border rounded-lg bg-muted cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:bg-background hover:border-[#E93F3F] hover:scale-[1.02]
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:shadow-[0_10px_30px_rgba(233,63,63,0.15)]"
      >
        <div className="flex flex-row justify-center items-start gap-4">
          <Button
            variant={"outline"}
            className="flex justify-center items-center bg-white group-hover:bg-[#fff8f8] group-hover:border-[#E93F3F] group-hover:text-[#E93F3F] transition-colors duration-300"
            size={"icon"}
          >
            <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">Add New</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Create a new playground</p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <Image
            src={"/add-new.svg"}
            alt="Create new playground"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-100"
          />
        </div>
      </div>
      
    {/* //   Todo Implement Template Selecting Model here */}

      <TemplateSelevtionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewProjectButton
