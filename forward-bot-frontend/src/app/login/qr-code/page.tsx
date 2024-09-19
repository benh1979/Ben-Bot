"use client";

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Loader2, RefreshCw, Wifi, XCircle } from 'lucide-react'

// TypeScript interfaces
interface QRCodeData {
    qrCode: string
}

interface ConnectionStatus {
    isConnected: boolean
    message: string
}

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'info'
}

// Toast component
const Toast: React.FC<ToastProps> = ({ message, type }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, x: '-50%' }}
        animate={{ opacity: 1, y: 0, x: '-50%' }}
        exit={{ opacity: 0, y: 50, x: '-50%' }}
        className={`fixed bottom-4 left-1/2 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white z-50`}
    >
        {message}
    </motion.div>
)

// Shimmer effect component
const Shimmer: React.FC = () => (
    <div className="absolute inset-0 -inset-y-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent" />
)

// Main QR Code component
export default function EnhancedQRCodeScanner() {
    const API = process.env.NEXT_PUBLIC_API;
    const [qrCodeData, setQRCodeData] = useState<QRCodeData | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
        isConnected: false,
        message: 'Waiting for connection...',
    })
    const [toast, setToast] = useState<ToastProps | null>(null)
    const router = useRouter()

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }, [])

    const connect = useCallback(() => {
        setIsLoading(true);
        setError(null);
        const userId = '1'; // Replace with actual user ID

        let eventSource: EventSource | null = null;

        try {
            eventSource = new EventSource(`${API}whatsapp/qr-stream/${userId}`);

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data)
                if (data.qrCode === "Reconnecting!") {
                    setConnectionStatus({ isConnected: false, message: 'Reconnecting...' });
                    showToast('Reconnecting to the server...', 'info');
                } else if (data.qrCode === 'Connected!') {
                    setConnectionStatus({ isConnected: true, message: 'Connected!' });
                    showToast('Connected successfully!', 'success');
                    eventSource?.close();
                    setTimeout(() => router.push('/'), 2000);
                } else if (data.qrCode.includes("expired")) {
                    setError('QR Code Expired!');
                    showToast('QR Code Expired! Generating new QR code...', 'error');
                    setIsLoading(true);
                    if (eventSource) eventSource.close();
                    setTimeout(connect, 2000); // Reconnect after 2 seconds
                } else {
                    setQRCodeData(data);
                    setIsLoading(false);
                }
            };

            eventSource.onerror = () => {
                console.error('SSE Error');
                setError('Failed to connect to the server. Please try again.');
                showToast('Connection error. Please try again.', 'error');
                eventSource?.close();
                setIsLoading(false);
            };
        } catch (err) {
            console.error('Error setting up SSE:', err);
            setError('Failed to set up connection. Please try again.');
            showToast('Failed to set up connection. Please try again.', 'error');
            setIsLoading(false);
        }

        return () => {
            eventSource?.close();
        };
    }, [API, router, showToast]);

    const handleRefresh = useCallback(() => {
        connect();
    }, [connect]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full mx-auto overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-indigo-200 opacity-50" />
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-500 via-indigo-500 to-blue-500" />
                <div className="relative z-10">
                    <motion.h2
                        className="text-3xl font-extrabold text-center mb-6 text-gray-900 flex items-center justify-center"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <QrCode className="w-8 h-8 mr-2 text-gray-600" />
                        QR Code Scanner
                    </motion.h2>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLoading ? 'loading' : 'content'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Loader2 className="w-16 h-16 text-gray-600" />
                                    </motion.div>
                                    <p className="text-lg font-semibold text-gray-800 mt-4">Connecting...</p>
                                </div>
                            ) : error ? (
                                <div className="text-red-500 text-center" role="alert">
                                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                                    <p className="text-lg font-semibold mb-4">{error}</p>
                                    <motion.button
                                        onClick={handleRefresh}
                                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center justify-center mx-auto"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                        Try Again
                                    </motion.button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8 relative">
                                        <div className="absolute inset-0 bg-gray-100 rounded-2xl overflow-hidden">
                                            <Shimmer />
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        >
                                            <Image
                                                src={`${qrCodeData?.qrCode || 'https://upload.wikimedia.org'}`}
                                                alt="QR Code"
                                                width={250}
                                                height={250}
                                                className="mx-auto relative z-10 rounded-2xl shadow-lg"
                                            />
                                        </motion.div>
                                    </div>
                                    <p className="text-center text-lg text-gray-600 mb-6">
                                        Scan this QR code to connect
                                    </p>
                                    <div className="text-center">
                                        <motion.div
                                            className="flex items-center justify-center mb-4 bg-indigo-100 rounded-full py-2 px-4"
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        >
                                            <Wifi className="w-5 h-5 mr-2 text-indigo-600" />
                                            <p className="text-lg font-semibold text-indigo-700">
                                                Status:
                                                <motion.span
                                                    key={connectionStatus.message}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="ml-2"
                                                >
                                                    {connectionStatus.message}
                                                </motion.span>
                                            </p>
                                        </motion.div>
                                        <motion.button
                                            onClick={handleRefresh}
                                            className="bg-gradient-to-r from-gray-600 to-indigo-600 hover:from-gray-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 ease-in-out flex items-center justify-center mx-auto"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Refresh
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>
        </div>
    )
}