"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteModal from "./DeleteModal";
import { deleteProject } from "@/lib/actions";

type ProjectActionsProps = {
  project: {
    _id: string;
    title: string;
  };
};

const ProjectButtons: React.FC<ProjectActionsProps> = ({ project }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const result = await deleteProject(project._id);
    if (result.status === "SUCCESS") {
      router.push("/");
    } else {
      console.error("Deletion failed:", result.error);
      
    }
  };

  return (
    <div className="flex gap-4">
      <Link href={`/project/edit/${project._id}`}>
        <button className="px-4 py-2 border-[5px] border-black bg-white text-black font-bold rounded-full shadow-100 hover:bg-black hover:text-white transition-all duration-500">
          Edit
        </button>
      </Link>

      <button
        onClick={() => setShowDeleteModal(true)}
        className="px-4 py-2 border-[5px] border-black bg-red-500 text-white font-bold rounded-full shadow-100 hover:bg-red-800  transition-all duration-500"
      >
        Delete
      </button>

      {showDeleteModal && (
        <DeleteModal
          projectName={project.title}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectButtons;
