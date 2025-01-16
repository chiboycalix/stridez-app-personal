import { useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import liveicon from "../../assets/icons/liveicon.png";
import courseManagement from "../../assets/icons/CourseManagement.svg";
import uploadVideo from "../../assets/icons/UploadVideo.svg";
import Calender from "../../assets/icons/Calender.svg";
import Divider from "../../assets/Divider.png";
import Toastify from "../Toastify";
import Spinner from "../Spinner";
import Image from "next/image";

const Sidebar = ({ auth }) => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  const learnersAndExplorerMenuItems = useMemo(
    () => [
      { title: "Explore For You", icon: exploreicon, tag: "", link: "/" },
      { title: "Following", icon: followingicon, tag: "", link: "/Following" },
      { title: "LIVE", icon: liveicon, tag: "", link: "/Live" },
      { title: "Profile", icon: profileicon, tag: "", link: "/SetupProfile" },
      {
        title: "Upload Video",
        icon: uploadVideo,
        tag: "",
        link: "/UploadVideo",
      },
      { title: "Calender", icon: Calender, tag: "", link: "/SchedulePage" },
      {
        title: "Course Management",
        icon: courseManagement,
        tag: "",
        link: "/CourseManagement",
      },
    ],
    []
  );

  return (
    <>
      <Toastify message={alert} />
      <div className="sidebar fixed top-0 left-0 pt-6 h-full grid grid-rows-[auto,1fr,auto] justify-start items-center gap-y-4 px-5 bg-white pb-8 border">
        <div className="mb-6">
          <div className="flex justify-start pb-4">
            <Image
              src={"/assets/icons/stridelogo.png"}
              alt="Logo"
              className="w-35 h-9"
            />
          </div>

          <ul className="mt-2">
            {loading ? (
              <div className="flex items-center justify-center pt-10">
                <Spinner className="text-purple-600" />
              </div>
            ) : (
              learnersAndExplorerMenuItems.map((item, index) => (
                <NavLink
                  to={item.title === "LIVE" && !auth ? "/Auth" : item.link}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg h-12 cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "hover:text-blue-700 hover:bg-blue-50"
                    }`
                  }
                  key={index}
                >
                  <Image src={item.icon} alt="" className="icon-image" />
                  <span className="icon-menu-list">{item.title}</span>
                  {item.tag && (
                    <span className="ml-auto text-sm bg-blue-100 text-blue-900 rounded-full px-2 py-0.5">
                      {item.tag}
                    </span>
                  )}
                </NavLink>
              ))
            )}
          </ul>
        </div>

        <Image src={Divider} alt="Horizontal Divider" className="my-1" />

        <div className="mt-2">
          <ul className="flex text-xs text-gray-600">
            <li className="py-1">
              <Link to="/">Company</Link>
            </li>
            <li className="py-1 px-2">
              <Link to="/">About</Link>
            </li>
            <li className="py-1">
              <Link to="/">Contact</Link>
            </li>
          </ul>
          <ul className="grid grid-cols-4 items-center justify-center text-xs text-gray-600 gap-y-1 mt-4">
            <li className="hover:font-bold cursor-pointer">Help</li>
            <li className="hover:font-bold cursor-pointer">Safety</li>
            <li className="hover:font-bold cursor-pointer">Privacy</li>
            <li className="hover:font-bold cursor-pointer">Center</li>
            <li className="text-xs mb-2 hover:font-bold cursor-pointer">
              Terms & Policies
            </li>
          </ul>
          <div className="mt-2 text-xs text-gray-500">
            <p>Community Guidelines</p>
            <p className="mt-2">© 2024 STRIDEZ</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
