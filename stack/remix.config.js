/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  // We have to hardcode the dev port because of this remix bug: https://github.com/remix-run/remix/issues/3314
  devServerPort: 8002,
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    /^@shopify\/hydrogen.*/, // @dash-remove shopify
    "instantsearch.js/es/lib/routers/index.js", // @dash-remove algolia
    "parse-domain",
    "is-ip",
    "ip-regex",
  ],
  future: {},
};
