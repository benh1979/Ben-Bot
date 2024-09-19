'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ProfileData {
  name: string
  number: string
  avatar: string
  isLoggedIn: number
}

interface BotStatus {
  isConnected: boolean
  lastConnected: string | null
  lastDisconnected: string | null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API || ''

function ReloginMessage() {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3 mt-3" role="alert">
      <strong className="font-bold">Relogin
        Required: </strong>
      <span className="block sm:inline">Please log in again to continue using the bot.</span>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfileAndStatus = async () => {
      try {
        const [profileResponse, statusResponse] = await Promise.all([
          fetch(`${API_BASE_URL}whatsapp/user/1`),
          fetch(`${API_BASE_URL}whatsapp/status/1`)
        ])
        const profileData = await profileResponse.json()
        const statusData = await statusResponse.json()

        setProfile({
          name: profileData.name,
          number: profileData.number,
          avatar: profileData.avatar,
          isLoggedIn: profileData.isLoggedIn,
        })
        setBotStatus(statusData.status)
        console.log(statusData, profileData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndStatus()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}whatsapp/logout/1`, {
        method: 'POST',
      })
      const data = await response.json()
      console.log(data.message)
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleBotToggle = async () => {
    try {
      if (botStatus?.isConnected) {
        const response = await fetch(`${API_BASE_URL}whatsapp/close-connection/1`, {
          method: 'POST',
        })
        const data = await response.json()
        console.log(data.message)
      } else {
        const response = await fetch(`${API_BASE_URL}whatsapp/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: '1' }),
        })
        const data = await response.json()
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 1 second
        }, 1000);
        console.log(data.message)
      }
      // Fetch the updated status after toggling
      const statusResponse = await fetch(`${API_BASE_URL}whatsapp/status/1`)
      const statusData = await statusResponse.json()
      setBotStatus(statusData.status)
    } catch (error) {
      console.error('Error toggling bot status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full">
        <div className="relative mb-8">
          {loading ? (
            <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={profile?.avatar || '/placeholder.svg?height=200&width=200'}
                alt={profile?.name || ''}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        <div className="text-center mb-6">
          {profile?.isLoggedIn === 0 && botStatus?.isConnected === false && <ReloginMessage />}
          {loading ? (
            <>
              <div className="h-8 w-48 mx-auto mb-2 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{profile?.name}</h1>
              <p className="text-base sm:text-lg text-gray-600 mb-4 flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile?.number}
              </p>
            </>
          )}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${botStatus?.isConnected // Check both conditions
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
            }`}>
            Bot Status: {
              botStatus?.isConnected
                ? "Active"
                : "Inactive"
            }
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            onClick={handleLogout}
          >
            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <button
            className={`px-6 py-2 ${botStatus?.isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
            onClick={handleBotToggle}
          >
            <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {botStatus?.isConnected ? "Stop Bot" : "Start Bot"}
          </button>
        </div>
      </div>
    </div>
  )
}