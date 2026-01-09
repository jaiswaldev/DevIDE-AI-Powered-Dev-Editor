import React from 'react'

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img src="/empty-state.svg" alt="No Projects" className='w-48 h-48 mb-4' />
      <h2 className="text-2xl font-semibold text-center">No Projects Found</h2>
      <p className="text-center text-muted-foreground">
        Create your first project to get started!
      </p>
    </div>
    )
}

export default EmptyState
