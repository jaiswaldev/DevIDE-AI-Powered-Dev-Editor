import React from 'react'
import  AddNewProjectButton  from '@/modules/dashboard/components/add-new-project-button'
import AddRepoButton from '@/modules/dashboard/components/add-repo'
import { GetAllPlaygroundForUser } from '@/modules/dashboard/actions'
import EmptyState from '@/modules/dashboard/components/empty-state'
import ProjectTable from '@/modules/dashboard/components/project-table'

const Dashboard = async() => {
  const playgrounds = await GetAllPlaygroundForUser();
  return (
    <div className="flex flex-col items-center justify-start min-h-screen mx-auto max-w-7xl px-4 py-10 z-20"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewProjectButton/>
        <AddRepoButton/>

      </div>

      <div className='mt-10 flex flex-col justify-center item-center w-full'>
        {
          playgrounds && playgrounds.length === 0? (
            <EmptyState/>
          ):(
            <ProjectTable 
            projects = {playgrounds || []} 
            onDeleteProject={()=>{}} 
            onUpdateProject = {()=>{}} 
            onDuplicateProject = {()=>{}}
            />
          )
        }

      </div>
    </div>
  )
}

export default Dashboard