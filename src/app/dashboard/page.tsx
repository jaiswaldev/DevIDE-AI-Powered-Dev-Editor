import React from 'react'
import  AddNewProjectButton  from '@/modules/dashboard/components/add-new-project-button'
import AddRepoButton from '@/modules/dashboard/components/add-repo'
import { DuplicatePlayground, UpdatePlayground, DeletePlayground, GetAllPlaygroundForUser } from '@/modules/dashboard/actions'
import EmptyState from '@/modules/dashboard/components/empty-state'
import ProjectTable from '@/modules/dashboard/components/project-table'
import type { Project } from '@/modules/dashboard/types'

const Dashboard = async() => {
  const playgrounds = await GetAllPlaygroundForUser();
  // console.log("Playgrounds:", playgrounds);
  // Map playgrounds to Project type format
  const projects: Project[] = playgrounds.map((playground) => ({
    id: playground.id,
    title: playground.title,
    description: playground.description ?? null,
    template: playground.template,
    createdAt: playground.createdAt,
    updatedAt: playground.updatedAt,
    userId: playground.userId,
    user: {
      ...playground.user,
      name: playground.user.name ?? "",
      image: playground.user.image ?? "",
    },
    Starmark: playground.StarMark?.map((mark: { isMarked: boolean }) => ({ isMarked: mark.isMarked })) || [],
  }));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen mx-auto max-w-7xl px-4 py-10 z-20"> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <AddNewProjectButton/>
        <AddRepoButton/>

      </div>

      <div className='mt-10 flex flex-col justify-center item-center w-full'>
        {
          projects && projects.length === 0? (
            <EmptyState/>
          ):(
            <ProjectTable 
            projects = {projects || []} 
            onUpdateProject = { UpdatePlayground } 
            onDeleteProject={ DeletePlayground } 
            onDuplicateProject = { DuplicatePlayground }
            />
          )
        }

      </div>
    </div>
  )
}

export default Dashboard