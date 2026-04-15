import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Send blocking (non-streamed) metadata to all bots so OG tags
  // are present in the initial HTML for WhatsApp, Facebook, etc.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
