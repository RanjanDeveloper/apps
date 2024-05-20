'use client';
import { useCurrentUser } from '@/app/hooks/use-current-user';
import UserInfo from '@/components/user-info';
import { currentUser } from '@/lib/auth'
import React from 'react'

type Props = {}

export default async function ClientPage({}: Props) {
    const user = useCurrentUser();
  return (
    <UserInfo user={user} label='📱 Client Component'/>
  )
}