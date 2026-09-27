/** @type {import('next').NextConfig} */
const nextConfig = {
  /* deploy under projects.nyronic.com/happy-tails via NEXT_PUBLIC_BASE_PATH;
   * unset locally so dev stays at the root */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
