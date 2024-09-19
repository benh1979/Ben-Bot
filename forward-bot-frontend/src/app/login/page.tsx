'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const API_BASE_URL = process.env.NEXT_PUBLIC_API || ''

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<'qr' | 'pairing' | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isValidPhone, setIsValidPhone] = useState(false)
    const [pairingCode, setPairingCode] = useState<string[]>(Array(8).fill(''))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}whatsapp/status/1`)
                const data = await response.json()

                if (data.status.isConnected) {
                    setError('User already connected')
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                }
            } catch (err) {
                console.error('Error checking user status:', err)
            }
        }

        checkUserStatus()
    }, [router])

    useEffect(() => {
        if (loginMethod === 'qr') {
            router.push('/login/qr-code')
        }
    }, [loginMethod, router])

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 15); // Limit to 15 digits
        setPhoneNumber(value);
        setIsValidPhone(/^[0-9]{10,15}$/.test(value)); // Adjust the regex
    };

    const handleGetPairingCode = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}whatsapp/generate-pairing-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: '1',
                    phoneNumber: '+' + phoneNumber.toString(),
                }),
            })
            const data = await response.json()
            console.log(data)
            if (response.ok) {
                setPairingCode(data.pairingCode.split(''))
            } else {
                setError(data.message || 'Failed to generate pairing code')
            }
        } catch (err) {
            console.error('Error generating pairing code:', err)
            setError('An error occurred while generating the pairing code')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-purple-200 flex flex-col">
            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
                    <div className="text-center mb-8">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
                            alt="WhatsApp Logo"
                            width={80}
                            height={80}
                            className="mx-auto mb-4 animate-pulse"
                        />
                        <h2 className="text-3xl font-bold text-gray-800">Login!</h2>
                        <p className="text-gray-600 mt-2">Choose your login method</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={() => setLoginMethod('qr')}
                            className="w-full py-3 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300 flex items-center justify-center transform hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            Login with QR Code
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full py-3 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 flex items-center justify-center transform hover:scale-105"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 4v16m8-8H4" />
                            </svg>
                            Login with Pairing Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full animate-scaleIn">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Phone Number</h2>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="Enter your phone number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                        />
                        <button
                            onClick={handleGetPairingCode}
                            disabled={!isValidPhone || isLoading}
                            className={`w-full py-2 px-4 rounded-md text-white ${isValidPhone && !isLoading ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400'
                                } transition duration-300 transform hover:scale-105`}
                        >
                            {isLoading ? 'Getting Code...' : 'Get Pairing Code'}
                        </button>

                        {isLoading && (
                            <div className="mt-4 flex justify-between">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="w-8 h-12 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        )}

                        {!isLoading && pairingCode.some(code => code !== '') && (
                            <div className="mt-4 animate-fadeIn">
                                <p className="text-center mb-2 text-gray-700">Your Pairing Code:</p>
                                <div className="flex justify-between">
                                    {pairingCode.map((digit, index) => (
                                        <div key={index} className="w-8 h-12 border-2 border-gray-500 rounded flex items-center justify-center text-lg font-bold text-gray-800 animate-popIn" style={{ animationDelay: `${index * 0.1}s` }}>
                                            {digit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setShowModal(false)
                                setPhoneNumber('')
                                setPairingCode(Array(8).fill(''))
                            }}
                            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}