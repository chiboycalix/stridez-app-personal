// /* eslint-disable react/prop-types */
// import { useCallback, useEffect, useState } from "react";
// // import headhat from "../../assets/headhat.png";
// import backimage from "../../assets/backimage.png";
// // import Bikere from "../../assets/Bikere.png";
// // import guidecom from "../../assets/guidecom.png";
// import Navbar from "./Navbar";
// import SideBar from "./SideBar";
// import CommentSignin from "./CommentSignin";
// import Dropdown from "./Dropdown";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../Providers/AuthProvider";
// import Toastify from "../Toastify";
// import Spinner from "../Spinner";
// const baseUrl = process.env.REACT_APP_BASEURL;

// const Comment = () => {
//   const { auth, setAuth, getCurrentUser, getAuth } = useAuth();
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [comments, setComments] = useState([]);
//   const [alert, setAlert] = useState("");
//   const location = useLocation();
//   const { resource } = location.state;
//   const [loading, SetLoding] = useState(false);
//   const [user, setUser] = useState({});

//   const handleCreateComment = async (e) => {
//     e.preventDefault();

//     if (!getAuth()) {
//       setAlert("You have to login to comment on post");
//       setTimeout(() => {
//         window.location.href = `/Auth?redirect={page:comments,data:${resource?.id}}`;
//       }, 700);
//     } else {
//       if (newComment.trim() !== "") {
//         SetLoding(true);
//         const requestBody = { body: newComment.trim(), postId: resource?.id };
//         try {
//           const response = await fetch(`${baseUrl}/comments`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${Cookies.get("accessToken")}`,
//             },
//             body: JSON.stringify(requestBody),
//           });
//           // const data = await response.json();
//           if (response.ok) {
//             SetLoding(false);
//             const { username, firstName } = getCurrentUser();
//             const newCommentObj = {
//               username: username ? username : firstName,
//               createdAt: new Date(),
//               body: newComment.trim(),
//               user: {
//                 profile: {
//                   avatar: user?.avatar,
//                 },
//               },
//               replies: [],
//             };

//             setComments((prevComments) => [...prevComments, newCommentObj]);
//             setNewComment("");
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }
//   };

//   const fetchPostComments = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/comments?page=1&limit=20&postId=${resource?.id}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const data = await response.json();
//       if (response.ok) {
//         console.log("response: ", data);
//         setComments(data.data.comments);
//       }
//     } catch (error) {
//       console.log(error);
//       SetLoding(false);
//     }
//   }, [resource]);

//   useEffect(() => {
//     setUser(getCurrentUser());    fetchPostComments();
//   }, [fetchPostComments, getCurrentUser, resource]);

//   const handleSubscribe = () => {
//     setIsSubscribed(!isSubscribed);
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleCommentChange = (event) => {
//     setNewComment(event.target.value);
//   };

//   return (
//     <>
//       <Toastify message={alert} />
//       <div className="main-content flex flex-row justify-items-center items-start bg-white min-h-screen">
//         <SideBar auth={getAuth()} setAuth={setAuth} user={getCurrentUser()} />
//         <div className="flex flex-col ml-24 w-full">
//           <Navbar
//             toggleDropdown={toggleDropdown}
//             auth={getAuth()}
//             setAuth={setAuth}
//             user={getCurrentUser()}
//           />
//           <div className="container ">
//             <div className="md:col-span-3 grid grid-cols rounded bg-gray-50 gap-4 pl-10 w-full">
//               <div className="relative">
//                 <img
//                   src={backimage}
//                   alt="Background"
//                   className="w-full h-auto object-cover bg-black"
//                 />
//                 <div className="absolute inset-0 flex justify-center items-center">
//                   <img
//                     src={resource.thumbnailUrl}
//                     alt="Overlay"
//                     className="w-[26rem] h-full object-contain"
//                   />
//                 </div>
//               </div>
//               <div className="relative bg-white z-10 p-4">
//                 <div className="flex items-center space-x-4 mt-4 text-black">
//                   <img
//                     src={resource.user.profile.avatar}
//                     alt="User profile"
//                     className="w-10 h-10 rounded-full"
//                   />
//                   <div>
//                     <div>
//                       <b>{resource.user.profile.firstName}</b>{" "}
//                       {resource.user.profile.lastName}
//                     </div>
//                     <div className="text-sm text-black-300">
//                       <div className="flex space-x-1  mt-2 text-xs text-blue-700">
//                         <p>{resource.body}</p>
//                       </div>
//                       <p>{resource.title}</p>
//                     </div>
//                   </div>
//                   <div className="ml-auto">
//                     <button
//                       className={`py-1 px-4 rounded ${
//                         isSubscribed
//                           ? "bg-purple-100 text-nowrappurple border border-solid purple-blue-800"
//                           : "bg-white border border-purple-950 text-purple-900"
//                       }`}
//                       onClick={handleSubscribe}
//                     >
//                       {isSubscribed ? "Subscribed" : "Subscribe"}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-8">
//                   <div className="flex space-x-2 items-center mb-4">
//                     <h2 className="text-xl font-bold underline decoration-2 decoration-purple-900 py-3">
//                       Comments ({comments.length})
//                     </h2>
//                     <h2 className="flex items-center text-xl font-medium py-3">
//                       Guide Videos
//                     </h2>
//                   </div>

//                   <div className="flex items-center mb-4">
//                     <img
//                       src={resource.user.profile.avatar}
//                       alt="User profile"
//                       className="w-10 h-10 rounded-full mx-20"
//                     />
//                     <form onSubmit={handleCreateComment}>
//                       <input
//                         type="text"
//                         value={newComment}
//                         onChange={handleCommentChange}
//                         placeholder="Add a comment"
//                         className="flex-grow h-12 bg-white rounded-full w-3/4 py-2 px-4 outline-none"
//                       />
//                       <div className="mr-20">
//                         <button
//                           className="bg-purple-900 text-white py-2 px-4 rounded-full"
//                           type="submit"
//                         >
//                           {loading ? <Spinner /> : "Post"}
//                         </button>
//                       </div>
//                     </form>
//                   </div>

//                   <div className="bg-white rounded-lg">
//                     {comments.map((comment, index) => (
//                       <CommentSignin key={index} {...comment} />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {isDropdownOpen && <Dropdown auth={auth} setAuth={setAuth} />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Comment;
