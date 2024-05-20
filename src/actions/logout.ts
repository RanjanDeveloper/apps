"use server";

import { signOut } from "@root/auth";

export const logOut = async () => {
  await signOut();
};
