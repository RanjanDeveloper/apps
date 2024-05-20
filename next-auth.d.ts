import { user } from './src/drizzle/schemas/schema';
import { typeAdapterAccount } from '@auth/core/adapters';
import { UserRoleEnum } from "@/db/schemas";
import  {  type DefaultSession } from "next-auth";
// import { UserRole } from "@/db/schemas";
export type defaultUser = DefaultSession["user"];

declare module "next-auth" {


  interface User {
      picture?:string ;
      role?: UserRoleEnum ;
      isTwoFactorEnabled?: boolean | null;
      isOAuth?:boolean ;
      image?:string ;
  }

}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: UserRoleEnum ;
    isTwoFactorEnabled?: boolean;
    isOAuth?:boolean ;
    image?:string ;

  }
}
