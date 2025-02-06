"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify"
import { client } from "@/sanity/lib/client";
import { GET_USER_BY_EMAIL, HAS_USER_APPLIED_QUERY, UPDATE_APPLICATION_STATUS_MUTATION } from "@/sanity/lib/queries";



export const createProject = async (state: any, form: FormData, pitch: string) => {
    const session = await auth();

    if (!session)
        return parseServerActionResponse({
          error: "Not signed in",
          status: "ERROR",
        });
    const { title, description, category, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch"),
    );
        
    const slug = slugify(title as string, { lower: true, strict: true });
        
    try {
        const project = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: "reference",
                _ref: session?.user?.id,
            },
            pitch,
        };
        
        const result = await writeClient.create({ _type: "project", ...project });
        
        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);
        
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};

export const updateProject = async (
  projectId: string,
  form: FormData,
  pitch: string
) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });


  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );
  const slug = slugify(title as string, { lower: true, strict: true });
  
  try {
    const project = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug", 
        current: slug,
      },
      pitch,
    };

    
    const result = await writeClient.patch(projectId).set(project).commit();

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error: any) {
    console.error("Update error:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const deleteProject = async (projectId: string) => {
  const session = await auth();
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  try {
    await writeClient.delete(projectId);
    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const applyToProject = async (state: any, form: FormData) => {
    // 1. Check for an active user session
    const session = await auth();
  
    if (!session) {
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
      });
    }
  
    // 2. Extract data from the FormData
    const { projectId, github, portfolio, message } = Object.fromEntries(
      Array.from(form)
    );
  
    if (!projectId) {
      return parseServerActionResponse({
        error: "Missing projectId",
        status: "ERROR",
      });
    }
  
    // 3. Build the Sanity document
    try {
      const applicationDoc = {
        _type: "application",
        project: {
          _type: "reference",
          _ref: projectId,
        },
        applicant: {
          _type: "reference",
          _ref: session.user.id, 
        },
        github,       
        portfolio,    
        message,      
        status: "pending", 
      };
  
      // 4. Create the document in Sanity
      const result = await writeClient.create(applicationDoc);
  
      // 5. Return the newly created document (plus success status)
      return parseServerActionResponse({
        ...result,
        error: "",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error(error);
      return parseServerActionResponse({
        error: JSON.stringify(error),
        status: "ERROR",
      });
    }
};

export const checkUserApplicationStatus = async (projectId: string) => {
    const session = await auth();
    if (!session) {
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
        applied: false,
      });
    }
  
    try {
      const result = await client.fetch(HAS_USER_APPLIED_QUERY, {
        userId: session.user.id,
        projectId,
      });

  
      return parseServerActionResponse({
        error: "",
        status: "SUCCESS",
        applied: !!result, // Returns true if the user has applied
      });
    } catch (error) {
      console.error("Error fetching application status:", error);
      return parseServerActionResponse({
        error: JSON.stringify(error),
        status: "ERROR",
        applied: false,
      });
    }
};

export const acceptApplication = async (applicationId: string) => {
    const session = await auth();
    
    if (!session) {
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
      });
    }
  
    try {
      const existingApplication = await client.fetch(UPDATE_APPLICATION_STATUS_MUTATION, { applicationId });
  
      if (!existingApplication) {
        return parseServerActionResponse({
          error: "Application not found",
          status: "ERROR",
        });
      }
  
      // Update status to accepted
      await writeClient.patch(applicationId).set({ status: "accepted" }).commit();
  
      return parseServerActionResponse({
        error: "",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Error accepting application:", error);
      return parseServerActionResponse({
        error: JSON.stringify(error),
        status: "ERROR",
      });
    }
};

export const rejectApplication = async (applicationId: string) => {
    const session = await auth();
    
    if (!session) {
      return parseServerActionResponse({
        error: "Not signed in",
        status: "ERROR",
      });
    }
  
    try {
      const existingApplication = await client.fetch(UPDATE_APPLICATION_STATUS_MUTATION, { applicationId });
  
      if (!existingApplication) {
        return parseServerActionResponse({
          error: "Application not found",
          status: "ERROR",
        });
      }
  
      // Update status to rejected
      await writeClient.patch(applicationId).set({ status: "rejected" }).commit();
  
      return parseServerActionResponse({
        error: "",
        status: "SUCCESS",
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      return parseServerActionResponse({
        error: JSON.stringify(error),
        status: "ERROR",
      });
    }
};

export async function getUserByEmail(email: string) {
  return await client.fetch(GET_USER_BY_EMAIL, { email });
}




  