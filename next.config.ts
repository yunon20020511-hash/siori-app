import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stripe WebhookはBody Parsingを無効にする必要があるため、個別に対応
  // 画像最適化の設定
  images: {
    domains: [],
  },
};

export default nextConfig;
