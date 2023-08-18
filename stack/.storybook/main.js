const webpack = require("webpack");
const path = require("path");

/** @type {import("@storybook/core-common").StorybookConfig} */
module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    "../app/**/GettingStarted.stories.mdx",
    "../app/**/*.stories.mdx",
    "../app/**/*.stories.@(js|jsx|ts|tsx)",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "storybook-addon-designs",
  ],
  framework: "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // Resolve absolute path alias
    config.resolve.alias = {
      "~": path.resolve(__dirname, "../app"),
    };
    // Replace node parts of remix with an empty mock so that webpack builds (otherwise it will fail looking for `fs` and other node modules)
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\/@remix-run\/node/,
        require.resolve("./@remix-run/node.mock.js")
      )
    );

    if (configType === "PRODUCTION" && !process.env.VERCEL_STORYBOOK) {
      config.output.publicPath = "/_/storybook/";
    }

    return config;
  },
  managerWebpack: async (config, { configType }) => {
    if (configType === "PRODUCTION" && !process.env.VERCEL_STORYBOOK) {
      config.output.publicPath = "/_/storybook/";
    }

    return config;
  },
};
