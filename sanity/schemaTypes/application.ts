import { defineField, defineType } from "sanity";

export const application = defineType({
  name: "application",
  title: "Application",
  type: "document",
  fields: [
    defineField({
      name: "applicant",
      title: "Applicant",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Accepted", value: "accepted" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "url",
    }),
    defineField({
      name: "portfolio",
      title: "Portfolio",
      type: "url",
    }),
    defineField({
        name: "discord",
        title: "Discord Username",
        type: "string",
        validation: (Rule) => Rule.required().error("Discord username is required"),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      description: "An optional note to the project owner",
    }),
  ],
  preview: {
    select: {
      status: "status",
      applicantName: "applicant.name",
      projectTitle: "project.title",
    },
    prepare({ status, applicantName, projectTitle }) {
      return {
        title: `${applicantName} -> ${projectTitle}`,
        subtitle: status,
      };
    },
  },
});
