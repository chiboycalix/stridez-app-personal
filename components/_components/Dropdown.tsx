import { useState } from 'react'
// import dark from '../../assets/icons/dark.png'
// import Logout from '../../assets/icons/Logout.png'
// import personicon from '../../assets/icons/personicon.png'
// import settings from '../../assets/icons/settings.png'
// import saved from '../../assets/icons/saved.png'
import Toastify from '../Toastify'
// import authService from '../../Services/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const Dropdown = ({ auth, setAuth }: any) => {
  const [darkMode, setDarkMode] = useState(false)
  const [alert, setAlert] = useState('')
  const {signOut} = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    if (auth) {
      signOut()
      setAuth(false)
      setAlert('Logged out Successfully')
    } else {
      router.push('/Auth')
    }
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
  }
  return (
    <>
      <Toastify message={alert} />

      <div className="absolute top-12 right-2 mt-8 w-48 bg-white border border-gray-200 rounded shadow-lg">
        <div className="py-2 text-nowrap">
          <Link
            href="/profile"
            className=" px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center "
          >
            <img
              src="/assets/icons/personicon.png"
              alt="personicon"
              className="w-4 h-4 ml-2 mx-2"
            />{' '}
            View Profile{' '}
          </Link>
          <Link
            href="/profile"
            className=" px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
          >
            <img src="/assets/icons/saved.png" alt="new profile" className="w-4 h-4 ml-2 mx-2" />{' '}
            Add new Profile{' '}
          </Link>
          <Link
            href="/settings"
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
          >
            <img src="/assets/icons/settings.png" alt="settings" className="w-4 h-4 ml-2 mx-2" />{' '}
            Settings
          </Link>
          <Link
            href="/saved"
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
          >
            <img src="/assets/icons/saved.png" alt="saved" className="w-4 h-4 ml-2 mx-2" /> Saved
          </Link>
          <div className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
            <img src="/assets/icons/dark.png" alt="space" className="w-4 h-4 ml-2 mx-2" />
            Dark Mode
            <div className="relative inline-block w-10 h-6 ml-2 select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                id="darkModeToggle"
                name="darkModeToggle"
                className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${
                  darkMode ? 'toggle-checked' : 'toggle-unchecked'
                }`}
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              <label
                htmlFor="darkModeToggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>

          {/* <label className="switch ml-2">
          <input type="checkbox" />
        </label> */}
        </div>
        <Link
          href="/Logo"
          className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
        >
          <img
            src={'/icons/assets/Logo2.png'}
            alt="Logo"
            className="w-4 h-4 ml-2 mx-2"
          />{' '}
          Stridez App
        </Link>
        <div onClick={handleLogout}>
          <Link
            href="/"
            className=" px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
          >
            <img src="/assets/icons/Logout.png" alt="Sign out" className="w-4 h-4 ml-2 mx-2" />
            Sign Out
          </Link>
        </div>
      </div>
    </>
  )
}

export default Dropdown
