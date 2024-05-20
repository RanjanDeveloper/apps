import UserInfo from '@/components/user-info';
import { currentUser } from '@/lib/auth'
import React from 'react'

type Props = {}

export default async function ServerPage({}: Props) {
    const user = await currentUser();
  return (
    <UserInfo user={user} label='💻 Server Component'/>
  )
}