import { UserRoleEnum, twoFactorConfirmation } from "@/db/schemas";
import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { user as users } from "@/db/schemas";
import { getUserById } from "@/data/users";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { eq } from "drizzle-orm";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update
} = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user, profile }) {
      await db.update(users).set({ emailVerified: new Date(),image:profile.picture}).where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Only check two-factor for credential accounts
      if (account?.provider !== "credentials")  return true;

      const existingUser = await getUserById(user.id!);

      // Check if user email is verified
      if (!existingUser?.emailVerified) return false;

      // Check if two-factor authentication is enabled
      if (existingUser.isTwoFactorEnabled) {
        const hasTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        // Reject login if no two-factor confirmation exists
        if (!hasTwoFactorConfirmation) return false;

        // Delete two factor confirmation  for next sign in
        await db.delete(twoFactorConfirmation).where(eq(twoFactorConfirmation.id, existingUser.id));
      }
      return true;
    },
    async jwt({ token }) {
      // If no user ID present, return the existing token
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      // If user not found, return the token without modifications
      if (!existingUser) return token;
      
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.userRole;
      token.image = existingUser.image;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
    async session({ token, session }) {
      // Add user ID and role to session if available in token
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRoleEnum;
      }
   
      if (session.user)  {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image= token.image as string;
      }
      return session;
    },
  
  },
  ...authConfig,
});
