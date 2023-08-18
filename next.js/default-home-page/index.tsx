import styles from "./index.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export type DefaultHomePageProps = {
  contentfulPages: string[]; // @dash-remove contentful
};

export default function DefaultHomePage({
  contentfulPages, // @dash-remove contentful
}: DefaultHomePageProps) {
  return (
    <section className={styles.root}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        whileHover={{ scale: 1.15 }}
      >
        <Image
          src="/DEPT-DASH-LOGO.png"
          alt="DEPT DASH™ Logo"
          height="250"
          width="500"
        />
      </motion.div>
      <div className={styles.grid}>
        <div className={`${styles.container} ${styles.intro}`}>
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Get started</h3>
          <br />
          <p>
            To edit this page, simply update
            <code className={styles.code}>pages/index.tsx</code>
            in your project directory.
            <br />
            Click on each integration's name to learn more about it or on the
            links below to explore its functionality.
          </p>
        </div>
        {/* @dash-remove-start contentful */}
        <div className={styles.container}>
          <Image
            src={"/logos/contentful-logo.png"}
            alt="Contentful Logo"
            height="50"
            width="50"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Contentful</h3>
          <ul>
            <li>
              <Link href="/contentful/posts">Posts</Link>
            </li>
            <li>
              <Link href="/contentful/posts/search">Search</Link>
            </li>
          </ul>
        </div>
        {/* @dash-remove-end */}
        {/* @dash-remove-start kontent.ai */}
        <div className={styles.container}>
          <Image
            src={"/logos/kontent-ai-logo.png"}
            alt="Kontent.ai Logo"
            height="50"
            width="50"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Kontent.ai</h3>
          <ul>
            <li>
              <Link href="/kontent.ai">Posts</Link>
            </li>
          </ul>
        </div>
        {/* @dash-remove-end */}
        {/* @dash-remove-start sanity */}
        <div className={styles.container}>
          <Image
            src={"/logos/sanity-logo.png"}
            alt="Sanity Logo"
            height="50"
            width="50"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Sanity</h3>
          <ul>
            <li>
              <Link href="/sanity/studio">Studio</Link>
            </li>
            <li>
              <Link href="/sanity">Index</Link>
            </li>
            <li>
              <Link href="/sanity/search">Search</Link>
            </li>
          </ul>
        </div>
        {/* @dash-remove-end */}
        {/* @dash-remove-start shopify */}
        <div className={styles.container}>
          <Image
            src={"/logos/shopify-logo.png"}
            alt="Shopify Logo"
            height="50"
            width="50"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>Shopify</h3>
          <ul>
            <li>
              <Link href="/shopify">Store</Link>
            </li>
            <li>
              <Link href="/shopify/search">Search</Link>
            </li>
            <li>
              <Link href="/shopify/cart">Cart</Link>
            </li>
          </ul>
        </div>
        {/* @dash-remove-end */}

        {/* @dash-remove-start commercetools */}
        <div className={styles.container}>
          <Image
            src="/logos/commercetools-logo.png"
            alt="Shopify Logo"
            height="50"
            width="50"
            style={{ marginBottom: "1rem" }}
          />
          <h3 style={{ fontWeight: "bold", fontSize: "18px" }}>
            Commercetools
          </h3>
          <ul>
            <li>
              <Link href="/commercetools">Store</Link>
            </li>
            <li>
              <Link href="/commercetools/cart">Cart</Link>
            </li>
          </ul>
        </div>
        {/* @dash-remove-end */}
      </div>
      <div className={styles.disclaimer}>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "grey",
            marginTop: "2rem",
          }}
        >
          The Next.js edition of DASH™ is minimally styled and built for speed!
        </p>
      </div>
    </section>
  );
}
