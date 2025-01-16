"use client";
import React from 'react'

type PostMediaPreviewProps = {
  file: any
  iconSize: boolean
}
const PostMediaPreview = ({
  file,
  iconSize = false,
}: PostMediaPreviewProps) => {
  const sizeClass = iconSize ? 'w-20 h-20' : 'w-full h-full'

  if (!file) return null

  return (
    <div className="flex">
      {file.type.startsWith('image/') ? (
        <div className="flex gap-1">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className={`object-cover ${sizeClass}`}
          />
          <p>{file.name || file?.title}</p>
        </div>
      ) : file.type.startsWith('video/') ? (
        <div className="flex gap-1">
          <video
            width={iconSize ? 48 : '100%'}
            controls={!iconSize}
            className={`object-cover ${sizeClass}`}
          >
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
          <p>{file.name || file?.title}</p>
        </div>
      ) : (
        <p>Unsupported media format</p>
      )}
    </div>
  )
}

export default PostMediaPreview
