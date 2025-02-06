"use client";
import React, { useState, useActionState, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send, UploadCloud } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from "next/navigation";
import { createProject } from '@/lib/actions';
import { useUploadThing } from '@/lib/uploadthing';

const ProjectForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { startUpload } = useUploadThing('imageUploader');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 4 * 1024 * 1024) { // 4MB check
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

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                pitch,
            };

            await formSchema.parseAsync(formValues);

            
            if (!file) {
                toast({
                    title: "Error",
                    description: "Please upload an image",
                    variant: "destructive",
                });
                return { ...prevState, error: "Image required", status: "ERROR" };
            }

            // Upload image to UploadThing
            const uploadResult = await startUpload([file]);
            
            if (!uploadResult?.[0]?.url) {
                throw new Error("Image upload failed");
            }

            // Create complete project data
            const projectData = new FormData();
              projectData.append('link', uploadResult[0].url);  
              projectData.append('title', formValues.title);
              projectData.append('description', formValues.description);
              projectData.append('category', formValues.category);
              projectData.append('pitch', formValues.pitch);

            // Submit to Sanity
            const result = await createProject(prevState, projectData, pitch);
            
            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Project created successfully",
                });
                router.push(`/project/${result._id}`);
            }

            return result;

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);
                toast({
                    title: "Error",
                    description: "Validation failed - check your inputs",
                    variant: "destructive",
                });
                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Upload failed",
                variant: "destructive",
            });

            return {
                ...prevState,
                error: error instanceof Error ? error.message : "Unknown error",
                status: "ERROR",
            };
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "ERROR"
    });

    return (
        <form action={formAction} className='project-form'>
            {/* Form fields */}
            <div>
                <label htmlFor='title' className='project-form_label'>Title</label>
                <Input id="title" name="title" className='project-form_input' required placeholder='Project Title'/>
                {errors.title && <p className='project-form_error'>{errors.title}</p>}
            </div>

            <div>
                <label htmlFor='description' className='project-form_label'>Description</label>
                <Textarea id="description" name="description" className='project-form_textarea' required placeholder='Project Description'/>
                {errors.description && <p className='project-form_error'>{errors.description}</p>}
            </div>

            <div>
                <label htmlFor='category' className='project-form_label'>Category</label>
                <Input id="category" name="category" className='project-form_input' required placeholder="Project Category (Tech, Health, Education...)"/>
                {errors.category && <p className='project-form_error'>{errors.category}</p>}
            </div>

            {/* Custom file input */}
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
                                <p className="text-xs text-gray-500 mt-2">Max 4MB • PNG, JPG, WEBP</p>
                            </div>
                        )}
                    </div>
                </div>
                {errors.link && <p className="project-form_error">{errors.link}</p>}
            </div>

            {/* Pitch editor */}
            <div data-color-mode="light">
                <label htmlFor="pitch" className="project-form_label">Pitch</label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Briefly describe your idea and what problem it solves",
                    }}
                />
                {errors.pitch && <p className="project-form_error">{errors.pitch}</p>}
            </div>

            <Button
                type="submit"
                className="project-form_btn text-white"
                disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit Your Project"}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    )
}

export default ProjectForm;