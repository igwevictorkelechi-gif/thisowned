import Image from "next/image";
import Link from 'next/link';

export default function WaitlistPage() {
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

                <form className="w-full flex flex-col gap-4">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono"
                        />
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono"
                        />
                    </div>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-transparent border-2 border-dashed border-gray-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ff3b1a] font-mono"
                        />
                    </div>

                    <button className="w-full bg-[#ff3b1a] text-white font-bold py-3 mt-4 rounded hover:bg-[#ff3b1a]/80 transition-opacity uppercase tracking-widest text-sm">
                        Join
                    </button>
                </form>
            </main>

        </div>
    );
}
