import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY =
  defineQuery(`*[_type == "project" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

export const PROJECT_BY_ID_QUERY =
  defineQuery(`*[_type == "project" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  pitch,
}`);

export const PROJECT_VIEWS_QUERY = defineQuery(`
    *[_type == "project" && _id == $id][0]{
        _id, views
    }
`);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
    *[_type == "author" && id == $id][0]{
        _id,
        id,
        name,
        username,
        email,
        image,
        bio
    }
`);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
`);

export const USER_PROJECTS_QUERY = defineQuery(`
  *[
    _type == "project" &&
    (
      author._ref == $userId ||
      _id in *[_type == "application" && applicant._ref == $userId && status == "accepted"].project._ref
    )
  ] | order(_createdAt desc) {
    _id, 
    title, 
    slug,
    _createdAt,
    author -> {
      _id, name, image, bio
    }, 
    views,
    description,
    category,
    image,
  }
`);


/**
 * 1) Check if user has already applied:
 *    Returns the application document if it exists,
 *    otherwise null (if user hasn't applied).
 */
export const HAS_USER_APPLIED_QUERY = defineQuery(`
*[_type == "application" && applicant._ref == $userId && project._ref == $projectId][0]{
  _id
}
`);

/**
 * 2) Get all projects a user has applied to:
 *    Returns a list of application docs, each referencing the project.
 */
export const APPLIED_PROJECTS_BY_USER_QUERY = defineQuery(`
*[_type == "application" && applicant._ref == $userId] | order(_createdAt desc) {
  _id,
  status,
  project->{
    _id,
    title,
    slug,
    image,
    category,
    description
  }
}
`);

/**
 * 3) Get all accepted collaborators for a project:
 *    Returns a list of applications where status == "accepted",
 *    each referencing the applicant author doc.
 */
export const COLLABORATORS_BY_PROJECT_QUERY = defineQuery(`
*[_type == "application" && project._ref == $projectId && status == "accepted"] {
  _id,
  applicant-> {
    _id,
    name,
    username,
    email,
    image
  }
}
`);

/**
 * 4) Get all applications for the projects owned by a specific user:
 *    i.e., user is the author of the project.
 */
export const APPLICATIONS_FOR_USER_PROJECTS_QUERY = defineQuery(`
*[_type == "application" && project->author._ref == $userId] | order(_createdAt desc) {
  _id,
  status,
  project-> {
    _id,
    title,
    slug
  },
  applicant-> {
    _id,
    name,
    username,
    email,
    image
  }
}
`);

export const PENDING_APPLICATIONS_FOR_USER_PROJECTS_QUERY = defineQuery(`
  *[_type == "application" && project->author._ref == $userId && status == "pending"] | order(_createdAt desc) {
    _id,
    status,
    github,
    portfolio,
    message,
    project-> {
      _id,
      title,
      slug
    },
    applicant-> {
      _id,
      name,
      username,
      email,
      image
    }
  }
`);

  
  /**
   * Update an application status (accept or reject)
   */
  export const UPDATE_APPLICATION_STATUS_MUTATION = `
  *[_type == "application" && _id == $applicationId][0]{
    _id
  }
`;

export const USER_NOTIFICATIONS_QUERY = defineQuery(`
  *[_type == "application" && applicant._ref == $userId && status != "pending"] | order(_updatedAt desc) {
    _id,
    status,
    project->{
      _id,
      title,
      slug
    }
  }
`);
  


