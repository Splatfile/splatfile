/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(otf)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "_next/static/fonts/[name].[ext]",
          },
        },
      ],
    });
    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      "api/users/[userid]": ["./app/api/users/[userid]/__files/**/*"],
    },
  },
};

module.exports = nextConfig;
