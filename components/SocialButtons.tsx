import React, { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { BsApple, BsLinkedin } from 'react-icons/bs'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const SocialButtons = () => {
  const { setAuth } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    // const account = new Account(client);

    try {
      console.log('Initiating Google OAuth...')
      console.log('Google OAuth session created')

      // Fetch user data from backend after successful OAuth
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL}/auth/google/userdata`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      const data = await response.json()
      console.log('User Data:', data)

      // Save token and user info
      localStorage.setItem('accessToken', data.token)
      setAuth(true, data.user)

      router.push('/dashboard')
    } catch (error) {
      console.log('Error during Google login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full my-3 flex flex-col gap-2">
      {/* Google Sign-In Button */}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="bg-white hover:bg-slate-300 flex justify-center border-gray-600 border p-2.5 text-sm cursor-pointer rounded-lg text-gray-800 w-full font-medium leading-6"
      >
        {loading ? (
          <ImSpinner2 className="animate-spin text-2xl text-gray-600" />
        ) : (
          <div className="flex items-center gap-2">
            <FcGoogle className="text-xl" /> Sign In with Google
          </div>
        )}
      </button>

      {/* LinkedIn Sign-In Button (placeholder) */}
      <button
        type="button"
        disabled={loading}
        className="bg-white hover:bg-slate-300 flex justify-center border-gray-600 border p-2.5 text-sm cursor-pointer rounded-lg text-gray-800 w-full font-medium leading-6"
      >
        {loading ? (
          <ImSpinner2 className="animate-spin text-2xl text-gray-600" />
        ) : (
          <div className="flex items-center gap-2">
            <BsLinkedin className="text-xl" /> Sign In with LinkedIn
          </div>
        )}
      </button>
    </div>
  )
}

export default SocialButtons
