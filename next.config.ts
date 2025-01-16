import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ui-avatars.com", "avatar.iran.liara.run"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        port: "",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
