import { withSentryConfig } from "@sentry/nextjs";
import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  async rewrites() {
    return [
      {
        eslint: {
          // Warning: This allows production builds to successfully complete even if
          // your project has ESLint errors.
          // TODO: Should we do this? Need it to deploy to payload cloud
          ignoreDuringBuilds: true,
        },
        source: "/((?!admin|api))tenant-domains/:path*",
        destination: "/tenant-domains/:tenant/:path*",
        has: [
          {
            type: "host",
            value: "(?<tenant>.*)",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(withPayload(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "dealer-pro-edge",
  project: "edgecms-sl",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
