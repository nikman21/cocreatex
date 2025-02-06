import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import {
  AUTHOR_BY_ID_QUERY,
  PENDING_APPLICATIONS_FOR_USER_PROJECTS_QUERY,
  USER_NOTIFICATIONS_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import UserProjects from "@/components/UserProjects";
import UserNotifications from "@/components/UserNotifications";
import { ProjectCardSkeleton } from "@/components/ProjectCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/UserProfile";

export const experimental_ppr = true;

const Profile = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  // Fetch Applications & Notifications on the Server
  const applications = await client.fetch(PENDING_APPLICATIONS_FOR_USER_PROJECTS_QUERY, {
    userId: id,
  });
  const notifications = await client.fetch(USER_NOTIFICATIONS_QUERY, {
    userId: id,
  });

  return (
    <section className="profile_container">
      {/* User Profile Section */}
      <UserProfile user={user} />

      {/* Tabs for Projects & Notifications */}
      <Tabs defaultValue="projects" className="w-full mt-6">
        <TabsList className="flex justify-center space-x-4 border-b">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">
              {session?.id == id ? "Your" : "All"} Projects
            </p>
            <ul className="card_grid-sm">
              <Suspense fallback={<ProjectCardSkeleton />}>
                <UserProjects id={id} />
              </Suspense>
            </ul>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">Notifications</p>
            <UserNotifications
              userId={id}
              applications={applications}
              notifications={notifications}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Profile;
