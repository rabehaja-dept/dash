/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ["en-US", "nl-NL"],
    defaultLocale: "en-US",
    localeDetection: true,
  },
  // @dash-remove-start commercetools
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.lumens.com",
      },
    ],
  },
  // @dash-remove-end
};
