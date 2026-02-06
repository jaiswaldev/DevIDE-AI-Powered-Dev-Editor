"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import {getPlaygroundDataById} from '@/modules/playground/actions/index';
import { usePlayground } from '@/modules/playground/hooks/usePlayground';

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
  return (
    <div>
        Main Playground Page id: {id}
        {/* <button onClick={() => loadTemplate( playgroundData?.template?.toLowerCase() || "react")}>Load React Template</button> */}
    </div>
  )
}

export default MainPlayground
