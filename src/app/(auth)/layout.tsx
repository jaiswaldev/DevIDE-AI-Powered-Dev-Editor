import React from 'react'
import {Navbar} from "@/components/navbar/navbar";

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <Navbar />
    <main className='flex justify-center items-center flex-col'>
        {children}
    </main>
    </>
  )
}

export default AuthLayout