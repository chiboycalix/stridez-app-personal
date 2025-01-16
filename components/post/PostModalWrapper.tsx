import React, { useEffect } from 'react'
import PostModal from './post-modal'
import { usePost } from '@/context/PostContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useVideoPlayback } from '@/context/VideoPlaybackContext'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export default function PostModalWrapper() {
  const { getCurrentUser } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const { posts, loading } = usePost()
  const { setIsGloballyPaused } = useVideoPlayback()

  useEffect(() => {
    setIsGloballyPaused(true)
    return () => setIsGloballyPaused(false)
  }, [setIsGloballyPaused])

  if (loading) {
    return null
  }

  const post = posts?.find(p => p.id === Number(id))

  if (!post) {
    return null
  }

  const handleClose = () => {
    router.back()
  }
  const user = getCurrentUser()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
      >
        <PostModal
          isOpen={true}
          onClose={handleClose}
          post={post}
          currentUser={user}
        />
      </motion.div>
    </AnimatePresence>
  )
}
