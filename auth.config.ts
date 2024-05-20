//auth.config.ts
import { compare } from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import Github  from "next-auth/providers/github"
import Google  from "next-auth/providers/google"


export default {
  providers: [
    Google({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          return {
            ...profile,
            id: profile.sub,
          };
        },
    }),
    Github({
        clientId:process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials): Promise<any> {
        //validate fields
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const publicapiUrl = process.env.NEXT_PUBLIC_APP_URL;
          //get user by email
          const response = await fetch(`${publicapiUrl}/api`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          const user = await response.json();
          if (!user || !user.password) return null;

          const isPasswordMatch = await compare(password, user.password);
          console.log("passwordmatch", isPasswordMatch);
          if (isPasswordMatch) return user;
        }
        return null;
      },
      
    }),
  ],

} satisfies NextAuthConfig;
