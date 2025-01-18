// import React, { useState, useEffect, useCallback, useRef } from "react";
// import Socket from "../../../../components/Socket";
// import { AnimatePresence, motion } from "framer-motion";
// import { X } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { AUTH_API } from "@/lib/api";
// import { STATUS_CODES } from "@/constants/statusCodes";
// import Toastify from "@/components/Toastify";
// import { cloudinaryCloudName, cloudinaryUploadPreset } from "@/utils/constant";


// interface UserProfile {
//   id: number;
//   username: string;
//   profile: {
//     firstName: string;
//     lastName: string;
//     avatar: string;
//     bio: string;
//   };
// }

// interface EditUserInputModalProps {
//   userProfile: UserProfile & { profile?: UserProfile["profile"] };
//   onClose?: () => void;
// }

// const EditUserInputModal: React.FC<EditUserInputModalProps> = ({
//   userProfile,
//   onClose,
// }) => {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(true);
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [username, setUsername] = useState<string>("");
//   const [bio, setBio] = useState<string>("");
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [alert, setAlert] = useState("")
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const fetchUser = useCallback(() => {
//     setUser(userProfile);
//     setFirstName(userProfile.profile.firstName || "");
//     setLastName(userProfile.profile.lastName || "");
//     setUsername(userProfile.username || "");
//     setBio(userProfile.profile.bio || "");
//     setLoading(false);
//   }, [userProfile]);

//   useEffect(() => {
//     fetchUser();

//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setOpen(false);
//         onClose?.();
//       }
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => {
//       window.removeEventListener("keydown", handleEsc);
//     };
//   }, [fetchUser, onClose]);

//   const uploadImageToCloudinary = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", cloudinaryUploadPreset || "");
//     formData.append("cloud_name", cloudinaryCloudName || "");
//     formData.append("folder", "Stridez/profiles");

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
//       { method: "POST", body: formData }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to upload image");
//     }

//     const data = await response.json();
//     return data.secure_url;
//   };

//   const handleUpdateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = user?.profile.avatar;
//       if (selectedImage) {
//         imageUrl = await uploadImageToCloudinary(selectedImage);
//       }

//       const updatedUserData = {
//         avatar: imageUrl,
//         firstName,
//         lastName,
//         username,
//         bio,
//       };

//       const response = await AUTH_API.updateProfile(updatedUserData) as any
//       if (response.code !== STATUS_CODES.OK) {
//         return;
//       }

//       fetchUser();
//       setAlert("Update was successful")
//       setLoading(false);
//       setOpen(false);
//     } catch (error) {
//       console.log("Error updating user data:", error);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <Toastify message={alert} />
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
//           onClick={() => {
//             setOpen(false);
//             onClose?.();
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             className="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-md"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => {
//                 setOpen(false);
//                 onClose?.();
//               }}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <X size={24} />
//             </button>
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Edit Profile
//             </h3>
//             <form onSubmit={handleUpdateUser} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Avatar
//                 </label>
//                 <div className="flex items-center gap-3 mt-2">
//                   <Image
//                     width={80}
//                     height={80}
//                     src={imagePreview || user?.profile.avatar || "/assets/avatar.svg"}
//                     alt="Profile Preview"
//                     className="w-20 h-20 rounded-full object-cover"
//                   />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     className="hidden"
//                     onChange={handleImageChange}
//                   />
//                   <div>
//                     <button
//                       type="button"
//                       onClick={handleImageClick}
//                       className="px-3 py-1.5 border rounded text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Upload Image
//                     </button>
//                     <p className="text-gray-500 text-[10px] mt-1.5 max-w-xs">
//                       Recommended: 800x800 px. Formats: JPG, PNG, GIF.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => {e.preventDefault(); setUsername(e.target.value)}}
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                 />
//                 {username && <Socket username={username} />}
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-gray-700">
//                   Bio
//                 </label>
//                 <textarea
//                   value={bio}
//                   onChange={(e) => setBio(e.target.value)}
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full py-2 bg-primary text-white rounded hover:bg-primary/85 focus:outline-none"
//                 disabled={loading}
//               >
//                 {loading ? "Updating..." : "Save Changes"}
//               </Button>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default EditUserInputModal;
