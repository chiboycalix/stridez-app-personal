'use client';

import React, { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FollowLinkProps {
  id: string | number;
  type: string;
  children: string | ReactNode;
  className?: string;
}

const FollowLink: React.FC<FollowLinkProps> = ({ id, type, children, className }) => {
  const router = useRouter();

  const openFollowModal = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(`/profile-details/${type}?background=${window.location.pathname}&id=${id}`);
  };

  return (
    <Link href={`/profile-details/${type}?id=${id}`} onClick={openFollowModal} className={className}>
      {children}
    </Link>
  );
};

export default FollowLink;
