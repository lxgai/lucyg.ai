import type { NextConfig } from "next";

const siteImageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const siteImageBaseUrl = process.env.NEXT_PUBLIC_SITE_IMAGE_BASE_URL;

if (siteImageBaseUrl) {
  try {
    const url = new URL(siteImageBaseUrl);
    siteImageRemotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    });
  } catch {
    // Invalid local env values should not block config loading.
  }
}

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 100],
    remotePatterns: siteImageRemotePatterns,
  },
};

export default nextConfig;
