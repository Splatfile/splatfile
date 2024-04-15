const { resolve, join } = require("path");
/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(otf)$/i,
      // include: [
      //   resolve(__dirname, "/app/api/users/[userid]/"),
      //   resolve(__dirname, "app/lib/utils/server-render-plate.ts"),
      // ],
      exclude: [
        resolve(__dirname, "/public"),
        
        join(__dirname, "/app/globals.css"),
      ],

      use: [
        {
          loader: "file-loader",
          options: {
            name: "/fonts/[name].[ext]",
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
