'use client'

import { GroupIcon, LogInIcon, MessageCircle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiHome } from 'react-icons/fi'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type NavItem = {
    icon: React.ElementType
    label: string
    href: string
}

const navItems: NavItem[] = [
    { icon: FiHome, label: 'Home', href: '/' },
    { icon: LogInIcon, label: 'LogIn', href: '/login' },
    { icon: GroupIcon, label: 'Group', href: '/group' },
    { icon: MessageCircle, label: 'Send Messages', href: '/send-message' },
]

const useSidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const toggle = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)

    return { isOpen, toggle, close }
}

export default function EnhancedGlowingSidebar() {
    const API = process.env.NEXT_PUBLIC_API;
    const { isOpen, toggle, close } = useSidebar()
    const pathname = usePathname();
    const [user, setUser] = useState({ name: '', avatar: '' })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API}whatsapp/user/1`) // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const userData = await response.json()
                setUser(userData)
            } catch (error) {
                console.error('Error fetching user data:', error)
                // Set default values or handle error as needed
                setUser({ name: 'Guest', avatar: '' })
            }
        }

        fetchUserData()
    }, [])

    return (
        <>
            <button
                onClick={toggle}
                className="fixed top-4 left-4 z-50 p-3 bg-gray-500 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 hover:bg-gray-600"
                aria-label="Toggle menu"
            >
                {isOpen ? <FiX className="text-white" size={24} /> : <FiMenu className="text-white" size={24} />}
            </button>
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-50 bg-opacity-90 backdrop-blur-lg shadow-2xl z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col justify-between items-center relative overflow-hidden p-6 pt-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 opacity-50" />
                    <div className="w-full relative z-10">
                        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Ben H.</h1>
                        <ul className="space-y-4">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${pathname.startsWith(item.href)
                                            ? 'bg-gray-500 text-white'
                                            : 'text-gray-800 hover:bg-gray-200'
                                            }`}
                                        onClick={close}
                                    >
                                        <item.icon size={24} />
                                        <span className="text-lg font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-full relative z-10 flex items-center">
                        <div className="mr-4">
                            <Image
                                src={user.avatar || ''}
                                alt={user.name || 'User'}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                            />
                        </div>
                        <div className="bg-gray-200 bg-opacity-50 rounded-lg p-4 text-gray-800 flex-grow">
                            <p className="text-sm font-medium">Logged in as</p>
                            <p className="text-lg font-bold">{user.name || 'Guest'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
