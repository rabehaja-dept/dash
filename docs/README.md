# Introduction

DEPT DASH™ is a template for quickly spinning up new web apps. It is opinionated and particularly tuned for content-heavy and e-commerce sites.

### IMPORTANT:

> If you're wanting to use the Next.js version of DASH, the docs are still a work in progress and this docs site might not be very helpful. Please reach out to us in the _#dash-support_ channel on Slack for help getting started.

Out of the box, DEPT DASH™ sets up either:

- [Remix](https://remix.run) app with TypeScript and server-rendered React

  - Deployment to AWS ECS with Docker
  - RDS Postgres database, including migrations on deploy
  - Github Actions to deploy on merge to production and staging environments
  - Email/Password Authentication with cookie-based sessions
  - Database ORM with [Prisma](https://prisma.io)
  - Styling with [Tailwind](https://tailwindcss.com) (optional)
  - Storybook with pre-built components
  - Blog and marketing pages
    - editable through [Contentful](https://www.contentful.com)
    - or through [Strapi](https://strapi.io)
    - or through [Kontent.ai](https://kontent.ai)
  - End-to-end testing with [Playwright](https://playwright.dev/)
  - Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com/)
  - Code formatting with [Prettier](https://prettier.io)
  - Linting with [ESLint](https://eslint.org)
  - Login, register, and forgot password user flows
  - Error reporting with [Sentry](https://sentry.io)
  - Site Analytics with [Google Analytics](https://https://analytics.google.com/)
  - Internationalization with [i18next](https://i18next.com)
  - E-commerce with [Shopify's Hydrogen Framework](https://hydrogen.shopify.dev/)
  - An enterprise-ready [Commercetools](https://commercetools.com/) setup
  - Payment processing with [Stripe](https://stripe.com) and [Adyen](https://adyen.com)
  - User account and e-commerce related emails with [SendGrid](https://sendgrid.com/)

- [Next.js](https://nextjs.org) app with TypeScript and statically-generated React
  - Styling frameworks
    - with [Tailwind](https://tailwindcss.com) (optional)
    - or with CSS Modules (optional)
    - or with [Headless UI](https://headlessui.dev/) (optional)
  - Blog and marketing pages
    - editable through [Contentful](https://www.contentful.com)
    - or through [Sanity](https://www.sanity.io)
    - or through [Kontent.ai](https://kontent.ai)
  - E-commerce pages and checkout flow
    - with [Shopify](https://shopify.com)
    - or with [Commercetools](https://commercetools.com/)

In order to get all these things working nicely together, we make some assumptions about how a project should be structured. If these rub you the wrong way, you might prefer using [cdk-webapp](./cdk-webapp.md), which deploys a docker image and makes fewer assumptions about the code itself.
