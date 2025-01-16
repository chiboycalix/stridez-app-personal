// import React from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";

// export default function FollowLink({ id, type, children, className }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const openFollowModal = (e) => {
//     e.preventDefault();
//     navigate(`/profile/${id}/${type}`, {
//       state: { background: location },
//     });
//   };

//   return (
//     <Link
//       to={`/profile/${id}/${type}`}
//       onClick={openFollowModal}
//       className={className}
//     >
//       {children}
//     </Link>
//   );
// }


// import React, { ReactNode, MouseEvent } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface FollowLinkProps {
//   id: string | number;
//   type: string;
//   children: ReactNode;
//   className?: string;
// }

// const FollowLink: React.FC<FollowLinkProps> = ({ id, type, children, className }) => {
//   const router = useRouter();
//   const location = useLocation();

//   const openFollowModal = (e: MouseEvent<HTMLAnchorElement>) => {
//     e.preventDefault();
//     router.push(`/profile/${id}/${type}`, {
//       state: { background: location },
//     });
//   };

//   return (
//     <Link
//       href={`/profile/${id}/${type}`}
//       onClick={openFollowModal}
//       className={className}
//     >
//       {children}
//     </Link>
//   );
// };

// export default FollowLink;


import React, { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FollowLinkProps {
  id: string | number;
  type: string;
  children: ReactNode;
  className?: string;
}

const FollowLink: React.FC<FollowLinkProps> = ({ id, type, children, className }) => {
  const router = useRouter();

  const openFollowModal = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(`/profile/${id}/${type}?background=${window.location.pathname}`);
  };

  return (
    <Link href={`/profile/${id}/${type}`} onClick={openFollowModal} className={className}>
      {children}
    </Link>
  );
};

export default FollowLink;
