import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import UserProjects from "@/components/UserProjects";
import { ProjectCardSkeleton } from "@/components/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import UserProfile from "@/components/UserProfile";

export const experimental_ppr = true;

const User = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) return notFound();

  return (
    <section className="profile_container">
      <UserProfile user={user} />
      <Tabs defaultValue="projects" className="w-full mt-6">
        <TabsList className="flex justify-center space-x-4 border-b">
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">{session?.id == id ? "Your" : "All"} Projects</p>
            <ul className="card_grid-sm">
              <Suspense fallback={<ProjectCardSkeleton />}>
                <UserProjects id={id} />
              </Suspense>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default User;
