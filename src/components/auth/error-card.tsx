import React from 'react';
import { Card,CardHeader,CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {}

export default function ErrorCard({}: Props) {
  return (
    <Card className='max-w-[400px] shadow-md'>
        <CardHeader>
            <div className='text-red-500'>OOPS! Something went wrong!</div>
        </CardHeader>
        <CardFooter className='justify-center'>
            <Button type='button' asChild>
                <Link href="/auth/login">Back to Login</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}