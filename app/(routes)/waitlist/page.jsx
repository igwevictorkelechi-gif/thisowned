"use client";

import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';

export default function WaitlistPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_WAITLIST_URL || '/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setMessage("You're on the list! We'll be in touch soon.");
                setFormData({ firstName: '', lastName: '', email: '' });
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.message || 'Failed to join waitlist.');
        } finally {
            if (status !== 'success') {
                // Keep loading state if success to show success message consistently without flickering back to form immediately if we wanted to redirect, 
                // but here we just want to stop loading if error.
                // If success, we keep 'success' status which hides the form.
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Main Content */}
            <main className="flex flex-col items-center text-center w-full max-w-md z-10 mt-8 mb-8">
                <div className="mb-8 relative w-64 h-24">
                    <Image
                        src="/logo.png"
                        fill
                        style={{
                            objectFit: "contain",
                        }}
                        alt="ThisOwned Logo"
                        priority
                    />
                </div>

                {status === 'success' ? (
                    <div className="animate-fade-in flex flex-col items-center bg-zinc-900/50 p-8 rounded-lg border border-zinc-800">
                        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Welcome Aboard</h3>
                        <p className="text-gray-400">{message}</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-6 text-sm text-[#ff3b1a] hover:text-[#ff3b1a]/80"
                        >
                            Join another email
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm tracking-[0.2em] mb-10 text-gray-200 uppercase">
                            Stay tuned.
                        </p>

                        <Link href="#" className="flex items-center gap-2 border-b border-gray-600 pb-1 mb-20 text-xs tracking-wider hover:text-[#ff3b1a] transition-colors">
                            {/* Lock Icon SVG */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            ENTER USING PASSWORD
                        </Link>

                        <h2 className="text-2xl font-bold uppercase mb-8 tracking-tighter">
                            Join Waitlist
                        </h2>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                    className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono transition-colors"
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    required
                                    className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono transition-colors"
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono transition-colors"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="text-red-500 text-xs text-center font-mono">
                                    {message}
                                </div>
                            )}

                            <button
                                disabled={status === 'loading'}
                                className="w-full bg-[#ff3b1a] text-white font-bold py-3 mt-4 rounded hover:bg-[#ff3b1a]/80 transition-all uppercase tracking-widest text-sm flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Join"}
                            </button>
                        </form>
                    </>
                )}
            </main>

        </div>
    );
}
