import { formatDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PROJECT_BY_ID_QUERY } from '@/sanity/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import ApplyModal from '@/components/ApplyModal';
import ProjectButtons from '@/components/ProjectButtons';
import { auth } from '@/auth';

export const experimental_ppr = true;

const md = markdownit();

const Project = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Get the current user session
  const session = await auth();
  const id = (await params).id;

  const post = await client.fetch(PROJECT_BY_ID_QUERY, { id });
  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="heading-container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-xl">{post.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex-gap items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-mediun">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-30-bold">Project Details</h3>
            {session && session.user.id === post.author?._id ? (
              <ProjectButtons project={post} />
            ) : session ? (
              <ApplyModal id={id} />
            ) : null}
          </div>

          {parsedContent ? (
            <article
              className="prose max-w-4xl break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Project;
