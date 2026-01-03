import React from 'react'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import UserButton from '@/modules/auth/components/user-button'
const Dashboard = () => {
  return (
    <div> 
      <h1>Welcome to the Devide App</h1>
      <Button >
        Get Started
      </Button>
      <UserButton/>
    </div>
  )
}

export default Dashboard