import { cn, formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Author, Project } from '@/sanity/types'
import { Skeleton } from './ui/skeleton'

export type ProjectTypeCard = Omit<Project, 'author'> & { author?: Author}

const ProjectCard = ({ post } : { post: ProjectTypeCard}) => {
    const { _createdAt, views, author, title, category, _id, image, description} = post;

  return (
    <li className='project-card group'>
        <div className='flex-between'>
            <p className='project_card_date'>
                {formatDate(_createdAt)}
            </p>
            <div className='flex gap-1.5'>
                <EyeIcon className='size-6 text-primary' />
                <span className='text-16-medium'>{views}</span>
            </div>
        </div>

        <div className='flex-between mt-5'>
            <div className='flex-1'>
                <Link href={`/user/${author?._id}`}>
                    <p className='text-16-medium line-clamp-1'>{author?.name}</p>
                </Link>
                <Link href={`/project/${_id}`}>
                    <h3 className='text-26-semibold line-clamp-1'>{title}</h3>
                </Link>
            </div>
            <Link href={`/user/${author?._id}`}>
                <Image 
                    src={ author?.image || "https://placehold.co/48x48"} 
                    alt="placeholder"
                    width={48}
                    height={48}
                    className="rounded-full"
                />
            </Link>    
        </div>
        <Link href={`/project/${_id}`}>
            <p className='project-card_desc'>
                {description}
            </p>
            <img src={image} alt='placeholder' className='project-card_img'/>
        </Link>

        <div className='flex-between gap-3 mt-5'>
            <Link href={`/query=${category?.toLowerCase()}`}>
                <p className='text-16-medium'>
                    {category}
                </p>
            </Link>
            <Button className='project-car_btn' asChild>
                <Link href={`/project/${_id}`}>
                    Details
                </Link>
            </Button>
        </div>

    </li>
  )
}

export const ProjectCardSkeleton = () => (
    <>
      {[0, 1, 2, 3, 4].map((index: number) => (
        <li key={cn("skeleton", index)}>
          <Skeleton className="project-card_skeleton" />
        </li>
      ))}
    </>
  );

export default ProjectCard