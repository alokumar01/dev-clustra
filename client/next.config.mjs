/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    // allowedDevOrigins: [
    //     "local-origin.dev",
    //     "*.local-origin.dev",
    //     "192.168.0.115",
    // ],
};

export default nextConfig;
