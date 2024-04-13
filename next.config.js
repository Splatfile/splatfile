/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "api/users/[userid]": ["./app/users/[userid]/__files/**/*"],
    },
  },
};

module.exports = nextConfig;
