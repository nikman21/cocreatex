import SearchForm from "@/components/SearchForm";
import ProjectCard, { ProjectTypeCard } from "@/components/ProjectCard";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
// import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {

  const query = (await searchParams).query;
  const params = { search: query || null }; 

  // const session = await auth();

  
  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });
  
  return (
    <>
    <section className="heading-container">

      <h1 className="heading">
        Code, Collaborate, <br />
        and Gain Experience
      </h1>

      <p className="sub-heading !max-w-3xl">
        Contribute to meaningful projects, sharpen your skills, and build something great together.
      </p>

      <SearchForm  query={query}/>
    
    </section>

    <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Projects"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: ProjectTypeCard) => (
              <ProjectCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No Projects found</p>
          )}
        </ul>
      </section>

      <SanityLive />
      
    </>
  );
}
