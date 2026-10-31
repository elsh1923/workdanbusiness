import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // The site opens on the business activities page, without a redirect; the home page lives at /home.
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/business-activities" }], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [
      // Addresses people may type from other free zone sites.
      { source: "/business-activities/general-trading", destination: "/license-categories/general-trading", permanent: true },
      { source: "/business-activities/professional-services", destination: "/license-categories/professional-services", permanent: true },
      { source: "/business-activities/ict", destination: "/license-categories/it-services", permanent: true },
      { source: "/business-activities/ecommerce-license", destination: "/license-categories/e-commerce", permanent: true },
      { source: "/business-activities/administrative-services", destination: "/license-categories/administrative-services", permanent: true },
      { source: "/business-activities/marketing-services", destination: "/license-categories/marketing-services", permanent: true },
      { source: "/invest-in-sharjah", destination: "/invest-in-uae", permanent: true },
      { source: "/refer-a-friend", destination: "/refer-and-earn", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/business-appointment", destination: "/book-appointment", permanent: true },
      { source: "/terms-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/become-a-channel-partner", destination: "/partners#channel-partner", permanent: true },
      { source: "/corporate-banking-assistance", destination: "/workdane-plus/corporate-banking", permanent: true },
      { source: "/spouse-and-dependents-visa-processing", destination: "/workdane-plus/family-visas", permanent: true },
      { source: "/vip-medical", destination: "/workdane-plus/vip-medical", permanent: true },
      { source: "/documentation", destination: "/workdane-plus/documentation", permanent: true },
      { source: "/customs-code", destination: "/workdane-plus/customs-code", permanent: true },
      { source: "/virtual-receptionist", destination: "/workdane-plus/virtual-receptionist", permanent: true },
      { source: "/dedicated-account-manager", destination: "/workdane-plus/dedicated-account-manager", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
