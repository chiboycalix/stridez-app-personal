import React from 'react'
import Link from 'next/link'

type PostLinkType = {
  postId: number
  children: React.ReactNode
}
export default function PostLink({ postId, children }: PostLinkType) {
  return <Link href={`/p/${postId}`}>{children}</Link>
}
