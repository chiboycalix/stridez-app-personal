import React from "react";



interface SkeletonLoaderProps {
  type: string;
}

const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
  const classes =
    type === "course"
      ? "h-24 w-full bg-gray-200 rounded-md animate-pulse"
      : "h-48 w-full bg-gray-200 rounded-md animate-pulse";
  return <div className={classes}></div>;
};

export default SkeletonLoader;
