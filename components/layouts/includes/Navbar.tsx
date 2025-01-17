'use client'

import Input from '@/components/ui/Input'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlignVerticalJustifyStart, Menu, Search, X } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useScroll } from '@/hooks/useScroll'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { BiBell } from 'react-icons/bi'
import {
  Menu as NavMenu,
  Transition,
  Switch,
  MenuItems,
  MenuButton,
  MenuItem,
} from '@headlessui/react'
import { Fragment } from 'react'
import { FaUser, FaCog, FaBookmark, FaSignOutAlt, FaMoon } from 'react-icons/fa'
import { BsPlusCircle } from 'react-icons/bs'
import Image from 'next/image'
const Header = () => {
  const { isOpen, toggle } = useSidebar()
  const [darkMode, setDarkMode] = useState(false)
  const [profile, setProfile] = useState<any | null>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const { scrollDirection, isPassedThreshold } = useScroll(60)
  const { currentUser, isAuthenticated, signOut } = useAuth()

  const router = useRouter()

  const styles: { active: React.CSSProperties; hidden: React.CSSProperties } = {
    active: {
      visibility: 'visible',
      transition: 'all 0.5s',
      transform: 'translateY(0)',
    },
    hidden: {
      visibility: 'hidden',
      transition: 'all 0.5s',
      transform: 'translateY(-100%)',
    },
  }

  const navbarStyle = isPassedThreshold
    ? scrollDirection === 'up'
      ? styles.active
      : styles.hidden
    : styles.active

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
  }

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser.profile)
    }
  }, [currentUser])

  return (
    <header
      style={navbarStyle}
      className="bg-white fixed top-0 right-0 left-0 md:left-64 z-30"
      aria-label="Main Navigation"
    >
      <div className="px-4 sm:px-6 lg:px-8 w-full py-2">
        <div className="flex h-16 justify-between items-center w-full">
          {/* Left Section */}
          <div className="flex items-center flex-1 md:basis-1/4">
            <button
              onClick={toggle}
              className="md:hidden -ml-2 mr-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <div className="hidden md:block flex-1 max-w-md">
              <Input variant='search' placeholder='Search' />
            </div>

            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-600"
              aria-label="Toggle search"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex items-center space-x-4 justify-end">
            {!isAuthenticated ? (
              <button
                onClick={() => router.push('/auth?tab=signin')}
                className="bg-purple-900 min-w-24 sm:min-w-32 text-sm text-white px-4 py-1 rounded-lg h-10 sm:h-12"
                aria-label="Sign In"
              >
                Sign In
              </button>
            ) : (
              <>
                <button
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Notifications"
                >
                  <BiBell size="24" color="#838383" />
                </button>

                <NavMenu as="div" className="relative inline-block text-left">
                  <MenuButton
                    className="inline-flex justify-center relative"
                    aria-label="User Menu"
                  >
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
                      {
                        profile?.avatar ? <Image
                          src={profile?.avatar}
                          alt="User Avatar"
                          fill
                          sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                          className="rounded-full border bg-center object-cover border-gray-200 cursor-pointer"
                          priority
                        /> : <Image
                          src={"/assets/avatar.svg"}
                          alt="User Avatar"
                          fill
                          sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                          className="rounded-full border bg-center object-cover border-gray-200 cursor-pointer"
                          priority
                        />
                      }

                    </div>
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      className="absolute right-0 w-52 mt-2 px-1 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      aria-label="User menu options"
                    >
                      <div className="py-1">
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href={'/profile'}
                              className={`${focus ? 'bg-gray-100' : ''} flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700`}
                            >
                              <FaUser className="mr-2" />
                              View Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href={'/profile'}
                              className={`${focus ? 'bg-gray-100' : ''
                                } flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700`}
                              role="menuitem"
                            >
                              <BsPlusCircle className="mr-2" />
                              Add New Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href={'/settings'}
                              className={`${focus ? 'bg-gray-100' : ''
                                } flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700`}
                              role="menuitem"
                            >
                              <FaCog className="mr-2" />
                              Settings
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href={'/saved'}
                              className={`${focus ? 'bg-gray-100' : ''
                                } flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700`}
                              role="menuitem"
                            >
                              <FaBookmark className="mr-2" />
                              Saved
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          <div
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg"
                            role="menuitem"
                            aria-label="Toggle Dark Mode"
                          >
                            <span className="text-sm text-gray-700 flex items-center">
                              <FaMoon className="mr-2" />
                              Dark Mode
                            </span>
                            <Switch
                              checked={darkMode}
                              onChange={handleDarkModeToggle}
                              className={`${darkMode ? 'bg-gray-400' : 'bg-gray-200'
                                } relative inline-flex items-center h-6 rounded-full w-11`}
                              aria-label={`Switch to ${darkMode ? 'light' : 'dark'
                                } mode`}
                            >
                              <span
                                className={`${darkMode ? 'translate-x-6' : 'translate-x-1'
                                  } inline-block w-4 h-4 transform bg-white rounded-full transition`}
                              />
                            </Switch>
                          </div>
                        </MenuItem>
                      </div>
                      <div className="py-1">
                        <MenuItem>
                          {({ focus }) => (
                            <Link
                              href="/"
                              className={`${focus ? 'bg-gray-100' : ''
                                } flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700`}
                              role="menuitem"
                            >
                              Get Stridez App
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ focus }) => (
                            <div
                              onClick={async () => {
                                signOut()
                                router.push('/')
                              }}
                              className={`${focus ? 'bg-gray-100' : ''
                                } flex items-center px-3.5 py-2.5 rounded-lg text-sm text-gray-700 cursor-pointer`}
                              role="menuitem"
                              tabIndex={0}
                            >
                              <FaSignOutAlt className="mr-2" />
                              Sign Out
                            </div>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </NavMenu>
              </>
            )}
          </nav>
        </div>
        <Transition
          show={isSearchVisible}
          enter="transition-all duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-4"
        >
          <Input variant='search' placeholder='Search' className="w-full" />
        </Transition>
      </div>
    </header>
  )
}

export default Header
