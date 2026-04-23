/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow tunnel URLs (ngrok, localtunnel, cloudflare) for local sharing
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.loca.lt",
    "*.trycloudflare.com",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.ngrok-free.app",
        "*.ngrok.io",
        "*.loca.lt",
        "*.trycloudflare.com",
      ],
    },
  },
}

export default nextConfig
