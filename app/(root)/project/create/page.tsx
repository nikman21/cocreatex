import { auth } from '@/auth'
import ProjectForm from '@/components/ProjectForm'
import { redirect } from 'next/navigation';
import React from 'react'

const Create = async () => {
    const session = await auth();

    if(!session) redirect('/')
  return (
    <>
        <section className='heading-container !min-h-[230px]'>
            <h1 className='heading'>Sumbit Your Project</h1>
        </section>

        <ProjectForm />
    </>
  )
}

export default Create