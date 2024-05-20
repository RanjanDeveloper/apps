import React from 'react';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@root/routes';
import { useSearchParams } from 'next/navigation';



export default function Social() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const onClick = (provider: "google"|"github")=> {
    signIn(provider,{ callbackUrl:callbackUrl || DEFAULT_LOGIN_REDIRECT })
    }
  return (
    <div className="flex gap-x-3">
      <Button type="button"
        onClick={() => onClick('github')}
        variant="outline"
        className="w-full"
      >
        <FaGithub />
      </Button>
      <Button type="button"
        onClick={() => onClick('google')}
        variant="outline"
        className="w-full"
      >
        <FcGoogle />
      </Button>
    </div>
  );
}