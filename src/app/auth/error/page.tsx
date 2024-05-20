import ErrorCard from '@/components/auth/error-card'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
  <div className="h-full flex items-center justify-center">
     <ErrorCard />
  </div>
  )
}