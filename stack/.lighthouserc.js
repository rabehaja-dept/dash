module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
      settings: {
        skipAudits: ["is-on-https"],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.8 }],
        "categories:pwa": "off",
      },
    },
  },
};
