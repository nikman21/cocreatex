import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";
 
export const { handlers, auth, signIn, signOut} = NextAuth({
    providers: [ GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({
            user: { name, email, image },
            profile: { id, login, bio },
          }) {
            const existingUser = await client
              .withConfig({ useCdn: false })
              .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                id,
              });
      
            if (!existingUser) {
              await writeClient.create({
                _type: "author",
                id,
                name,
                username: login,
                email,
                image,
                bio: bio || "",
              });
            }
      
            return true;
          },
          async jwt({ token, account, profile }) {
            if (account && profile) {
              const user = await client
                .withConfig({ useCdn: false })
                .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
                  id: profile?.id,
                });
      
              token.id = user?._id;
            }
      
            return token;
          },
          async session({ session, token }) {
            if (token.id) {
              session.user = {
                ...session.user, 
                id: token.id, 
              };
            }
          
            return session;
          }
          
        },
      });

