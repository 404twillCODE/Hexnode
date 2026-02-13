/** @type {import('next').NextConfig} */
// Use /Nodexity basePath only for GitHub Pages; on Vercel use root (VERCEL=1).
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const basePath = isVercel ? '' : (isProduction ? '/Nodexity' : '');

/** @type {import('next').NextConfig['headers']} */
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevent clickjacking (allow same-origin iframes only)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features the site doesn't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  reactStrictMode: true,
  // No output: 'export' — forum and auth need a Node server (dynamic routes, Supabase)
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: basePath,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

