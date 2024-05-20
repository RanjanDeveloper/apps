'use server';
import { DEFAULT_LOGIN_REDIRECT } from "@root/routes";
import { signIn } from "@root/auth";
export async function handleGithubSignIn() {
    await signIn('github', { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  }
  
  export async function handleGoogleSignIn() {
    await signIn('google', { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  }
  
  
