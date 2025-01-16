"use client";

import React from 'react'

type CourseMediaPreviewProps = {
  file: any
  iconSize: boolean
}
const CourseMediaPreview = ({
  file,
  iconSize = false,
}: CourseMediaPreviewProps) => {
  console.log(file)
  const sizeClass = iconSize ? 'w-20 h-20' : 'w-full h-full'

  return (
    <div className="flex">
      {file.type.startsWith('image') ? (
        <div className="flex gap-1">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className={`object-cover ${sizeClass} `}
          />
          <p>{file?.title}</p>
        </div>
      ) : (
        <div className="flex gap-1">
          <video
            width={iconSize ? 48 : '100%'}
            controls={iconSize ? false : true}
            className={`object-cover ${sizeClass}`}
          >
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
          <p>{file?.title}</p>
        </div>
      )}
    </div>
  )
}

export default CourseMediaPreview
