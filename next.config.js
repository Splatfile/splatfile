const { resolve, join } = require("path");

// https://github.com/Automattic/node-canvas/issues/1779#issuecomment-895885846
// 버셀에서 ZLIB이 오류를 일으키는 문제를 해결하기 위한 코드
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

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
