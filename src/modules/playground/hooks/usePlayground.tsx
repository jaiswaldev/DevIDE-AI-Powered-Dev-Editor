import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { TemplateFolder } from "../lib/initialFolder-to-json";
import { getPlaygroundDataById, SaveUpdatedCode } from "../actions";
import { Save } from "lucide-react";
import { set } from "date-fns";


interface PlaygroundData {
   id: string;
   name?: string;
   template?: string;
   [key: string]: any;
}


interface UsePlaygroundReturn {
    plagroundData: PlaygroundData | null;
    templateData: TemplateFolder | null;
    isLoading: boolean;
    error: string | null;
    loadPlayground: () => Promise<void>;
    saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
    const [plagroundData, setPlaygroundData] = useState<PlaygroundData | null>(null);
    const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPlayground = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);

            const data = await getPlaygroundDataById(id);
            setPlaygroundData(data);

            const rawContent = data?.templateFiles?.[0]?.content;

            if (typeof rawContent === "string") {
                const parsedContent = JSON.parse(rawContent);
                setTemplateData(parsedContent);
                toast.success("Playground loaded successfully");
                return;
            }

            // Load template from API if not in saved content
            const res = await fetch("/api/template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ framework: data?.template?.toLowerCase() })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`Failed to load template: ${res.status} - ${errorData.error || 'Unknown error'}`);
            }

            const templateRes = await res.json();

            // Handle the TemplateFolder response from the API
            if (templateRes.templateJson) {
                setTemplateData(templateRes.templateJson);
            } else {
                setTemplateData({
                    folderName: "Root",
                    items: [],
                });
            }

            toast.success("Template loaded successfully");
        } catch (error) {
            console.error("Error Loading Playground:", error);
            setError("Failed to load Playground data");
            toast.error("Failed to load Playground data");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const saveTemplateData = useCallback(async (data: TemplateFolder) => {
        try {
            
            await SaveUpdatedCode(id, data);
            setTemplateData(data);
            toast.success("Template data saved successfully");
        } catch (error) {
            console.error("Error saving template data:", error);
            toast.error("Failed to save template data");
        }
    }, []);

    // Load playground data on component mount
    useEffect(() => {
        loadPlayground();
    }, [loadPlayground]);

    return {
        plagroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData
    };
};



