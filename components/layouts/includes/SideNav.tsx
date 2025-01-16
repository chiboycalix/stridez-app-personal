'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MenuItem from './MenuItem'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import {
  AnalyticsIcon, CalenderIcon,
  ClassroomIcon, CourseManagementIcon,
  ExploreIcon, LiveIcon, OverviewIcon,
  ProfileIcon, VideoConferencingIcon,
  UploadIcon, MyLearningIcon,
  CommunitiesIcon, DirectMessageIcon,
  MarketPlaceIcon
} from '@/components/Icons'
import { LockIcon } from '@/public/assets'

const Sidebar = () => {
  const { isOpen, close } = useSidebar()
  const { currentUser } = useAuth();
  const user = currentUser;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`
          bg-white w-64 min-h-screen fixed top-0 left-0 bottom-0 z-50
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4">
          <div className="my-6 flex justify-start">
            <Link href="/" className="relative">
              <Image
                width={144}
                height={50}
                className="w-36"
                src="/assets/icons/logo.png"
                alt="STRIDEZ logo"
                priority
              />
            </Link>
          </div>

          <nav className="space-y-2">
            <MenuItem
              icon={ExploreIcon}
              label="Explore For You"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={32}
              path={"/"}
              onClose={close}
            />

            <MenuItem
              icon={LiveIcon}
              label="LIVE"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={32}
              path="/live"
              onClose={close}
            />

            <MenuItem
              icon={UploadIcon}
              label="Upload Video"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path="/uploads"
              onClose={close}
            />

            <MenuItem
              icon={CalenderIcon}
              label="Calendar"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path="/schedule"
              onClose={close}
            />

            <MenuItem
              icon={CourseManagementIcon}
              label="Course Management"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path="/courses"
              onClose={close}
            />

            <MenuItem
              icon={MarketPlaceIcon}
              label="Market Place"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path="/market-place"
              onClose={close}
            />

            <MenuItem
              icon={ProfileIcon}
              label="Profile"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path={user ? `/profile/${user.id}` : "/auth"}
              onClose={close}
            />

            <div className="border-b mx-3 my-6" />

            <div className="flex items-center gap-6 px-3 mb-4 pt-2">
              <span className="text-sm font-thin text-gray-800">PREMIUM</span>
              <div className='w-4 h-4 bg-black flex items-center justify-center rounded-sm'>
                <Image src={LockIcon} alt="LockIcon" />
              </div>
            </div>

            <MenuItem
              icon={VideoConferencingIcon}
              label="Video Conferencing"
              colorString="#000000"
              activeColorString="#37169C"
              sizeString={24}
              path="/video-conferencing"
              onClose={close}
            />

            <MenuItem
              icon={ClassroomIcon}
              label="Classroom"
              colorString="#454545"
              activeColorString="#37169C"
              sizeString={24}
              path="#"
              onClose={close}
              subMenuItems={[
                {
                  icon: OverviewIcon,
                  label: "Overview",
                  path: "/classroom/overview",
                  activeColor: "#37169C",
                  inactiveColor: "#454545",
                },
                {
                  icon: CourseManagementIcon,
                  label: "Courses",
                  path: "/classroom/courses",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                },
                {
                  icon: MyLearningIcon,
                  label: "My Learning",
                  path: "/classroom/my-learning",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                },
                {
                  icon: VideoConferencingIcon,
                  label: "Trainee/Learner",
                  path: "/classroom/trainee",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                },
                {
                  icon: DirectMessageIcon,
                  label: "Direct Message",
                  path: "/classroom/messaging",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                },
                {
                  icon: CommunitiesIcon,
                  label: "Communities",
                  path: "/classroom/communities",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                },
                {
                  icon: AnalyticsIcon,
                  label: "Analytics",
                  path: "/classroom/analytics",
                  activeColor: "#37169C",
                  inactiveColor: "#454545"
                }
              ]}
            />

            <div className="border-b mx-3 my-6" />

            <div className="mt-4 px-3 text-[11px] text-gray-500">
              <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
                <li className="hover:font-medium cursor-pointer transition-all">Company</li>
                <li className="hover:font-medium cursor-pointer transition-all">About</li>
                <li className="hover:font-medium cursor-pointer transition-all">Contact</li>
              </ul>
              <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
                <li className="hover:font-medium cursor-pointer transition-all">Help</li>
                <li className="hover:font-medium cursor-pointer transition-all">Safety</li>
                <li className="hover:font-medium cursor-pointer transition-all">Privacy Center</li>
                <li className="text-xs hover:font-medium cursor-pointer transition-all">
                  Terms & Policies
                </li>
                <li className="text-xs hover:font-medium cursor-pointer transition-all">
                  Community Guidelines
                </li>
              </ul>

              <p className="mt-2">© 2024 STRIDEZ</p>
            </div>

            <div className="pb-6" />
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar;