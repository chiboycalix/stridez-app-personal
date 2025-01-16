'use client'

import React, { useEffect } from 'react'
import { PostSkeleton } from '@/components/post/PostSkeleton'
import PostItem from '@/components/post/PostItem'
import { usePost } from '@/context/PostContext'
import Image from 'next/image'

export default function Explore() {
  const { posts, loading, fetchPosts } = usePost()

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="md:col-span-3 mt-1 grid px-3 py-1 gap-4 w-full">
      {loading ? (
        <PostSkeleton count={3} />
      ) : posts.length === 0 ? (
        <div className="items-center justify-center flex text-gray-500 min-h-screen">
          <div className="w-full flex items-center flex-col space-y-3">
            <Image
              width={50}
              height={50}
              src={'/assets/icons/file-error.svg'}
              alt="icon"
              className="aspect-square w-40"
            />
            <div>
              <h3 className="text-lg font-semibold pb-px">
                No posts available
              </h3>
              <p className="text-xs pt-px">{'Refresh or upload post'}</p>
            </div>
          </div>
        </div>
      ) : (
        posts.map(post => <PostItem key={post.id} post={post} />)
      )}
    </div>
  )
}
