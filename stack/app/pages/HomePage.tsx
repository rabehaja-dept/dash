import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

const features: FeatureBlockProps[] = [
  // @dash-remove-start contentful
  {
    title: "Contentful",
    documentationUrl: "https://deptagency.github.io/dash/contentful/index.html",
    logoUrl: "logos/contentful-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start strapi
  {
    title: "Strapi",
    documentationUrl: "https://deptagency.github.io/dash/strapi/index.html",
    logoUrl: "logos/strapi-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start kontent.ai
  {
    title: "Kontent.ai",
    documentationUrl: "https://deptagency.github.io/dash/kontent.ai/index.html",
    logoUrl: "logos/kontent-ai-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start contentstack
  {
    title: "Contentstack",
    documentationUrl:
      "https://deptagency.github.io/dash/contentstack/index.html",
    logoUrl: "logos/contentstack-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start shopify
  {
    title: "Shopify",
    documentationUrl: "https://deptagency.github.io/dash/shopify/index.html",
    logoUrl: "logos/shopify-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start algolia
  {
    title: "Algolia",
    documentationUrl: "https://deptagency.github.io/dash/algolia/index.html",
    logoUrl: "logos/algolia-logo.png",
  },
  // @dash-remove-end
  {
    title: "Storybook",
    documentationUrl: "https://deptagency.github.io/dash/storybook/index.html",
    logoUrl: "logos/storybook-logo.png",
  },
  // @dash-remove-start aws
  {
    title: "AWS",
    documentationUrl: "https://deptagency.github.io/dash/deployment/AWS.html",
    logoUrl: "logos/aws-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start fly
  {
    title: "Fly.io",
    documentationUrl:
      "https://deptagency.github.io/dash/deployment/Fly.io.html",
    logoUrl: "logos/fly-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start vercel
  {
    title: "Vercel",
    documentationUrl:
      "https://deptagency.github.io/dash/deployment/Vercel.html",
    logoUrl: "logos/vercel-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start gtags
  {
    title: "Google Tag Manager",
    documentationUrl:
      "https://deptagency.github.io/dash/analytics/google-tag-manager.html",
    logoUrl: "logos/google-analytics-logo.png",
  },
  // @dash-remove-end
  {
    title: "Google Maps",
    documentationUrl:
      "https://deptagency.github.io/dash/geolocation/index.html",
    logoUrl: "logos/google-maps-logo.png",
  },
  // @dash-remove-start cloudinary
  {
    title: "Cloudinary",
    documentationUrl: "https://deptagency.github.io/dash/cloudinary/index.html",
    logoUrl: "logos/cloudinary-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start optimizely
  {
    title: "Optimizely",
    documentationUrl: "https://deptagency.github.io/dash/optimizely/index.html",
    logoUrl: "logos/optimizely-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start optimizely
  {
    title: "Stripe",
    documentationUrl: "https://deptagency.github.io/dash/stripe/index.html",
    logoUrl: "logos/stripe-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start commercetools
  {
    title: "Commercetools",
    documentationUrl:
      "https://deptagency.github.io/dash/commercetools/index.html",
    logoUrl: "logos/commercetools-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start adyen
  {
    title: "Adyen",
    documentationUrl: "https://deptagency.github.io/dash/adyen/index.html",
    logoUrl: "logos/adyen-logo.png",
  },
  // @dash-remove-end
  // @dash-remove-start sendgrid
  {
    title: "Sendgrid",
    documentationUrl: "https://deptagency.github.io/dash/sendgrid/index.html",
    logoUrl: "logos/sendgrid-logo.png",
  },
  // @dash-remove-end
];

export const HomePage = () => {
  return (
    <section className="mx-4 mb-36 mt-16 flex flex-col items-center">
      <motion.div
        className="px-8 text-left lg:px-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        whileHover={{ scale: 1.15 }}
      >
        <img
          src="/DEPT-DASH-LOGO.png"
          alt="DEPT DASH™"
          height="200"
          width="auto"
          className="h-[200px] w-auto"
        />
      </motion.div>
      <div className="mt-8 grid grid-cols-4 gap-8">
        <motion.div
          className="relative col-span-4 m-[2px] cursor-default rounded-md border-2 border-none bg-gradient-to-t from-primary via-red-500 to-yellow-500 p-[2px]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="group rounded-md bg-white px-4 py-6 md:px-12">
            <SparklesIcon className="absolute right-5 top-5 h-6 text-yellow-500" />
            <h3 className="text-title-md">Get started</h3>
            <div className="wrap mt-2 overflow-hidden break-keep">
              Change this page by replacing
              <span className="mx-1 rounded-md bg-border-weak px-1 font-bold">
                <code>HomePage.tsx</code>
              </span>
              <span className="hidden md:inline-block">in</span>
              <span className="mx-1 hidden rounded-md bg-border-weak px-1 font-bold md:inline-block">
                <code>routes/index.tsx</code>
              </span>
            </div>
            <p className="mt-2">
              Click on each DEPT DASH™ integration to learn more.
            </p>
          </div>
        </motion.div>

        {features.map((feature, i) => (
          <FeatureBlock key={i} {...feature} />
        ))}
      </div>
      <p className="mt-36 text-xs text-border">
        The Remix edition of DASH™ is fully customizable, but is opinionated and
        particularly tuned for content-heavy and e-commerce sites.
      </p>
    </section>
  );
};

type FeatureBlockProps = {
  logoUrl: string;
  title: string;
  documentationUrl: string;
};

export const FeatureBlock = ({
  title,
  logoUrl,
  documentationUrl,
}: FeatureBlockProps) => {
  return (
    <motion.a
      className="col-span-2 cursor-pointer rounded-md border-2 border-border-weak p-[2px] hover:m-[2px] hover:border-none hover:bg-gradient-to-t hover:from-primary hover:via-red-500 hover:to-yellow-500 md:col-span-1"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: 0.35, duration: 0.8 }}
      href={documentationUrl}
      target="_blank"
    >
      <div className="h-full w-full rounded-[4px] bg-white p-4">
        <div className="text-center">
          <img
            src={logoUrl}
            alt={title}
            className="mb-4 h-[40px] w-[40px]"
            height="40"
            width="40"
          />
        </div>
        <h3 className="overflow-clip text-2xl font-bold">{title}</h3>
      </div>
    </motion.a>
  );
};
