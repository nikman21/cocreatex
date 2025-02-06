"use client";

import React, { useState, useEffect, useRef, useActionState
 } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProject } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, UploadCloud } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { PROJECT_BY_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";


const EditProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { toast } = useToast();
  const { startUpload } = useUploadThing("imageUploader");
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    pitch: "",
  });
 
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    (async () => {
      const data = await client.fetch(PROJECT_BY_ID_QUERY, { id: projectId });
      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          link: data.image, 
          pitch: data.pitch,
        });
      }
      setLoading(false);
    })();
  }, [projectId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size exceeds 4MB limit",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  
  const handleFormSubmit = async (prevState: any, formElData: FormData) => {
    try {
      const formValues = {
        title: formElData.get("title") as string,
        description: formElData.get("description") as string,
        category: formElData.get("category") as string,
        pitch: formElData.get("pitch") as string,
      };

      await formSchema.parseAsync(formValues);

      let imageLink = formData.link;
      if (file) {
        const uploadResult = await startUpload([file]);
        if (!uploadResult?.[0]?.url) {
          throw new Error("Image upload failed");
        }
        imageLink = uploadResult[0].url;
      }

      const updatedForm = new FormData();
      updatedForm.append("link", imageLink);
      updatedForm.append("title", formValues.title);
      updatedForm.append("description", formValues.description);
      updatedForm.append("category", formValues.category);
      updatedForm.append("pitch", formValues.pitch);

      const result = await updateProject(projectId, updatedForm, formValues.pitch);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
        router.push(`/project/${projectId}`);
      } else {
        toast({
          title: "Error",
          description: "Update failed: " + result.error,
          variant: "destructive",
        });
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error",
          description: "Validation failed - check your inputs",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return {
        ...prevState,
        error: error instanceof Error ? error.message : "Unknown error",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "ERROR",
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <form action={formAction} className="project-form">
        {/* Title */}
        <div>
          <label htmlFor="title" className="project-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="project-form_input"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="project-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="project-form_textarea"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="project-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            required
            placeholder="Project Category (Tech, Health, Education...)"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="project-form_input"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="project-form_label">Project Image</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer relative group border-gray-300 hover:border-primary transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-primary" />
              {file ? (
                <p className="text-sm">{file.name}</p>
              ) : (
                <div>
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Max 4MB • PNG, JPG, WEBP
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pitch Editor */}
        <div data-color-mode="light">
          <label htmlFor="pitch" className="project-form_label">
            Pitch
          </label>
          <MDEditor
            id="pitch"
            preview="edit"
            height={300}
            value={formData.pitch}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, pitch: value as string }))
            }
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
            }}
          />
          <input type="hidden" name="pitch" value={formData.pitch} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="project-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Update Project"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </div>
  );
};

export default EditProjectPage;
