/** @type {import('next').NextConfig} */
// Use /Nodexity basePath only for GitHub Pages; on Vercel use root (VERCEL=1).
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const basePath = isVercel ? '' : (isProduction ? '/Nodexity' : '');

const nextConfig = {
  reactStrictMode: true,
  // No output: 'export' — forum and auth need a Node server (dynamic routes, Supabase)
  images: {
    unoptimized: true,
  },
  basePath: basePath,
  assetPrefix: basePath,
};

module.exports = nextConfig;

