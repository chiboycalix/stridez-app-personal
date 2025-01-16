import { useEffect, useState, useCallback } from "react";
import Navbar from "../Components/Explore/Navbar";
import Post from "../Components/Explore/Post";
import SideBar from "../Components/Explore/SideBar";
import imageBike from "../assets/imageBike.png";
import image4 from "../assets/image4.png";
import imageCrowd from "../assets/imageCrowd.png";
import imageFood from "../assets/imageFood.png";
import userpix from "../assets/userpix.png";
import Dropdown from "../Components/Explore/Dropdown";
import { useAuth } from "../Providers/AuthProvider";
import SubscriptionModal from "../Components/Explore/SubscriptionModal"; // Ensure correct path

const MainScreen = () => {
  const { auth, setAuth, getCurrentUser, getAuth } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // State to manage modal visibility
  const [videos, setVideos] = useState([]);
  const [videos2, setVideos2] = useState([]);
  const baseUrl = process.env.REACT_APP_BASEURL;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };




  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.pexels.com/videos/popular?per_page=1&&per_page=5",
        {
          headers: {
            Authorization: `4ShdZA1RRuWuWtX0Fy25mtuTBsZQfoWajJ6UPgsfjgqIO9xsYoGjZ0Q4`,
          },
        }
      );

      const response2 = await fetch(`${baseUrl}/posts?page=1&&limit=20`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setVideos(data.videos);
      }
      const data2 = await response2.json();
      if (response2.ok) {
        setVideos2(data2.data.posts);
        console.log(data2.data2.posts);
      }
    } catch (error) {
      console.log(error);
    }
  }, [baseUrl]);

  useEffect(() => {
    console.log("getCurrentUser, getAuth", getCurrentUser(), getAuth());
    fetchVideos();
  }, [fetchVideos, getAuth, getCurrentUser]);

  const SubscribedGuides = [
    {
      name: "Kambani Kimberly",
      profilePic: userpix,
    },
    {
      name: "Kambani Kimberly",
      profilePic: userpix,
    },
    {
      name: "Kambani Kimberly",
      profilePic: userpix,
    },
  ];

  return (
    <div className="main-content flex flex-row justify-items-center items-start bg-white min-h-screen">
      <SideBar auth={getAuth()} setAuth={setAuth} user={getCurrentUser()} />
      <div className="flex flex-col ml-24">
        <Navbar
          toggleDropdown={toggleDropdown}
          auth={getAuth()}
          setAuth={setAuth}
          user={getCurrentUser()}
        />
        <div className="container">
          <div className="md:col-span-3 grid grid-cols rounded bg-gray-50 gap-4 pl-10 ">
            {videos &&
              videos.map((video, index) => {
                return (
                  <Post
                    key={index}
                    className="col-span-1 md:w-2/3 py-2 rounded border"
                    media={video.video_files[0].link}
                    profilePic={userpix}
                    title="How to ride a bike in summer"
                    description="#byp #biker #bikergirls #bikerboys #bikerpeople #bikerchick #bikerclown #bikerwarrior"
                    author="John Doe"
                    likes={22}
                    comments={2156}
                    pin={188.9}
                    views={202.2}
                    shares={202.2}
                  />
                );
              })}

            {videos2 &&
              videos2.map((video, index) => {
                return (
                  <Post
                    key={index}
                    className="col-span-1 md:w-2/3 py-2 rounded border"
                    media={video.thumbnailUrl}
                    profilePic={video.thumbnailUrl}
                    title={video.title}
                    description={video.body}
                    author="John Doe"
                    likes={22}
                    comments={2156}
                    pin={188.9}
                    views={202.2}
                    shares={202.2}
                  />
                );
              })}

            <Post
              className="col-span-1 md:w-2/3 py-2 rounded border"
              media={imageBike}
              profilePic={userpix}
              title="How to ride a bike in summer"
              description="#byp #biker #bikergirls #bikerboys #bikerpeople #bikerchick #bikerclown #bikerwarrior"
              author="John Doe"
              likes={22}
              comments={2156}
              pin={188.9}
              views={202.2}
              shares={202.2}
            />
            <Post
              className="col-span-1 md:w-2/3 py-2 rounded border"
              media={image4}
              profilePic={userpix}
              title="Top 10 detailed list for pennies"
              author="Jane Smith"
              description="#byp #biker #bikergirls #bikerboys #bikerpeople #bikerchick #bikerclown #bikerwarrior"
              likes={22}
              comments={2156}
              pin={188.9}
              views={202.2}
              shares={202.2}
            />

            <Post
              className="col-span-1 md:w-2/3 py-2 rounded border"
              media={imageCrowd}
              profilePic={userpix}
              title="Etiquette of greeting in public"
              author="Mark Johnson"
              description="#byp #biker #bikergirls #bikerboys #bikerpeople #bikerchick #bikerclown #bikerwarrior"
              likes={22}
              comments={2156}
              pin={188.9}
              views={202.2}
              shares={202.2}
            />
            <Post
              className="col-span-1 md:w-2/3 py-2 rounded border"
              media={imageFood}
              profilePic={userpix}
              title="How to code in python"
              author="David Wood"
              description="#byp #biker #bikergirls #bikerboys #bikerpeople #bikerchick #bikerclown #bikerwarrior"
              likes={22}
              comments={2156}
              pin={188.9}
              views={202.2}
              shares={202.2}
            />
            {/* <Comments comments={comments} /> */}
            {isDropdownOpen && <Dropdown auth={auth} setAuth={setAuth} />}
            <SubscriptionModal
              isOpen={isModalOpen}
              onClose={toggleModal}
              subscribedGuides={SubscribedGuides}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
