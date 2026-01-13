import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Define paths that should NOT be redirected
    const allowedPaths = [
        '/waitlist',      // The target page
        '/api',           // Backend API routes
        '/_next',         // Next.js static files
        '/favicon.ico',   // Favicon
        '/logo.png',      // Logo used in waitlist page
        '/thisowned-logo.png', // Logo used in login (just in case)
    ];

    // Check if the current path starts with any of the allowed paths
    const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

    // Also allow static files in public folder if they don't have a specific prefix but usually processed by next
    // Ideally, specific public files should be listed or we check for file extensions if needed.
    // For now, the explicit list + _next covers most. 

    if (isAllowed) {
        return NextResponse.next();
    }

    // Redirect everything else to waitlist
    return NextResponse.redirect(new URL('/waitlist', request.url));
}

export const config = {
    matcher: '/:path*',
};
