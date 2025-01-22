"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/context/AuthContext'
import { HandIcon, Share } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute'

const LeaveMeeting = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const channelName = searchParams.get("channelName");
  const { currentUser } = useAuth();

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="flex flex-col items-center justify-center h-[85vh] text-center px-4 bg-primary-950">
        <HandIcon className="w-16 h-16 text-amber-400 mb-6" />
        <h2 className="text-3xl font-semibold mb-2 text-white">You left the meeting</h2>
        <p className="text-gray-400 mb-6">Have a nice day!</p>
        <div className='flex items-center gap-4'>
          <p className="text-gray-400 mb-2 text-sm">Left by mistake?</p>
          <Button
            onClick={() =>
              router.push(`${ROUTES.VIDEO_CONFERENCING.MEETING_CHANNEL(channelName!)}?username=${currentUser?.profile?.firstName}`)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            Rejoin
          </Button>
        </div>
      </div >
    </ProtectedRoute>
  )
}

export default LeaveMeeting