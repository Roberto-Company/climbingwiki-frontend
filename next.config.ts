import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  devIndicators: false,
  // Self-contained server in .next/standalone, used by the Docker image.
  output: "standalone",
};

export default withNextIntl(nextConfig);
