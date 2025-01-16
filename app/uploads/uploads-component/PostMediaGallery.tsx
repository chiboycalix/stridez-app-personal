"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PostMediaPreview from './PostMediaPreview'

const PostMediaGallery = ({ mediaFiles }: any) => {
  const [featuredIndex, setFeaturedIndex] = useState(0)

  if (!mediaFiles || mediaFiles.length === 0) {
    return <p>No media available</p>
  }

  const handleClick = (index: number) => {
    setFeaturedIndex(index)
  }

  return (
    <div>
      {/* Featured Media */}
      <div className="w-full h-64 flex justify-center items-center mb-4">
        <PostMediaPreview file={mediaFiles[featuredIndex]} iconSize={false} />
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex flex-wrap gap-2 mb-4 w-1/2">
        {mediaFiles.map((file: File, index: number) => (
          <motion.div
            key={index}
            className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => handleClick(index)}
          >
            <PostMediaPreview file={file} iconSize />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PostMediaGallery
