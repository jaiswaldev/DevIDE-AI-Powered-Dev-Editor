"use client"
import React from 'react'
import { useParams } from 'next/navigation';

import { usePlayground } from '@/modules/playground/hooks/usePlayground';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SidebarInset, SidebarTrigger, Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TemplateFileTree } from '@/modules/playground/components/playground-file-explorer';

const MainPlayground = () => {
    const {id} =  useParams<{id:string}>();
    // const [playgroundData, setPlaygroundData] = React.useState<any>(null);

    // React.useEffect(() => { 
    //     const fetchData = async () => {
    //         const data = await getPlaygroundDataById(id);
    //         setPlaygroundData(data);
    //     }
    //     fetchData();
    // }, [id]);

    // // console.log("Playground Data:", playgroundData);
    
    // const loadTemplate = async (framework: string) => {
    //     const res = await fetch("/api/template", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ framework })
    //     });

    //     if (!res.ok) {
    //       const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    //       console.error('Template load failed', err);
    //       alert(err.error || 'Failed to load template');
    //       return;
    //     }

    //     const { files } = await res.json();

    //     // monacoEditor.loadFiles(files);
        
    //     console.log("Loaded files:", files);
    // };

    const {plagroundData, templateData, isLoading, error,saveTemplateData} = usePlayground(id);
    console.log("Playground Data:", plagroundData);
    console.log("Template Data:", templateData);

    const activeFile = "sample.txt"

  return (
    <TooltipProvider>
      <Sidebar>
        <SidebarContent>
          <TemplateFileTree
            data={templateData!}
            onFileSelect={()=>{}}
            selectedFile={activeFile}
            title="File Explorer"
            onAddFile= {()=>{}}
            onAddFolder={()=>{}}
            onDeleteFile= {()=>{}}
            onDeleteFolder={()=>{}}
            onRenameFile={()=>{}}
            onRenameFolder={()=>{}}
          />
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
         <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4 z-10 relative'>
             <SidebarTrigger />
             <Separator orientation="vertical" className = "mr-2 h-4"/>
         </header>

         <div className='flex items-center gap-2'>
           <div className='flex flex-col flex-1'>
            <h1 className='text-sm font-medium'>
              {plagroundData?.title || "Your Vibe Playground"}
            </h1>
           </div>
         </div>
       </SidebarInset>

        {/* <button onClick={() => loadTemplate( playgroundData?.template?.toLowerCase() || "react")}>Load React Template</button> */}
    </TooltipProvider>
  )
}

export default MainPlayground
