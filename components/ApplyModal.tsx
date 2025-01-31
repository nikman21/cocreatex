"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useActionState } from "react";
import { applyToProject, checkUserApplicationStatus } from "@/lib/actions"; // Import the new action
import { z } from "zod";
import { applySchema } from "@/lib/validation";

interface ApplyModalProps {
  id: string; 
}

const ApplyModal: React.FC<ApplyModalProps> = ({ id }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await checkUserApplicationStatus(id);
        if (response.applied) {
          setHasApplied(response.applied);
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [id]);

  const handleApplyFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        projectId: formData.get("projectId") as string,
        github: formData.get("github") as string,
        discord: formData.get("discord") as string,
        portfolio: formData.get("portfolio") as string,
        message: formData.get("message") as string,
      };

      await applySchema.parseAsync(formValues);

      const result = await applyToProject(prevState, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Application Sent",
          description: "Your application has been submitted successfully!",
          variant: "destructive",
        });
        setHasApplied(true); // Update state after applying
      } else {
        toast({
          title: "Error",
          description: "Could not submit your application.",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Validation Error",
          description: "Check your inputs and try again.",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "Unexpected error",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleApplyFormSubmit, {
    error: "",
    status: "ERROR",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="border-[5px] border-black shadow-100"
          disabled={hasApplied || loading}
        >
          {loading ? "Checking..." : hasApplied ? "Applied" : "Apply"}
        </Button>
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Apply to Project</DialogTitle>
          <DialogDescription>
            Provide your GitHub, portfolio, and a message for the project owner.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={id} />

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="github">*GitHub</Label>
            <Input id="github" name="github" placeholder="https://github.com/username" />
            {errors.github && <p className="text-red-600 text-sm">{errors.github}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="discord">*Discord Username</Label>
            <Input id="discord" name="discord" placeholder="username#1234" required />
            {errors.discord && <p className="text-red-600 text-sm">{errors.discord}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="portfolio">Portfolio</Label>
            <Input id="portfolio" name="portfolio" placeholder="https://myportfolio.com" />
            {errors.portfolio && <p className="text-red-600 text-sm">{errors.portfolio}</p>}
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Tell us why you'd be a great collaborator..." />
            {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="border-[5px] border-black bg-primary text-white shadow-100 hover:shadow-none"
              disabled={isPending || hasApplied}
            >
              {isPending ? "Applying..." : "Send Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
