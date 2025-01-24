import React from "react";
import { client } from "@/sanity/lib/client";
import { USER_PROJECTS_QUERY } from "@/sanity/lib/queries";
import ProjectCard, { ProjectTypeCard } from "@/components/ProjectCard";

const UserProjects = async ({ id }: { id: string }) => {
  const projects = await client.fetch(USER_PROJECTS_QUERY, { userId: id });

  return (
    <>
      {projects.length > 0 ? (
        projects.map((project: ProjectTypeCard) => (
          <ProjectCard key={project._id} post={project} />
        ))
      ) : (
        <p className="no-result">No projects yet</p>
      )}
    </>
  );
};

export default UserProjects;
