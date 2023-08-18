import { Customer, ProductProjection } from "@deptdash/commercetools";
import Link from "next/link";
import Image from "next/image";
import { Price } from "~/components/price";
import styles from "./productCard.module.css";
import { motion } from "framer-motion";

const myScaleUp = {
  hover: { scale: 1.01 },
};

export type ProductCardProps = {
  product: ProductProjection;
  currencyCode: string;
  locale: string;
  language: string;
  customer: Customer | null;
};

const fallbackLanguage = "en-US"; //TODO: support internationalization

export const ProductCard = ({
  product,
  currencyCode,
  locale,
  language,
  customer,
}: ProductCardProps) => {
  const { name, description, slug, masterVariant } = product;

  const getLocaleValue = (value: any) => {
    /**
     * Localized key in response may contain only language code or
     * both language-country, so we need to get string from one of these
     */
    const localized = value[locale] ? value[locale] : value[language];
    if (localized) {
      return localized;
    } else {
      if (value[fallbackLanguage]) {
        return value[fallbackLanguage];
      }
    }
  };

  const prices = masterVariant?.prices?.filter(
    (price) => price.value?.currencyCode === currencyCode
  );

  const embeddedPrice = prices.filter(
    (price) => price.customerGroup?.id === customer?.customerGroup?.id
  );

  const price = embeddedPrice.length ? embeddedPrice[0].value : prices[0].value;

  return (
    <Link href={`/commercetools/${getLocaleValue(slug)}`}>
      <motion.article
        className={styles.article}
        initial="hidden"
        animate="show"
        whileHover="hover" // Add a hover state
        variants={myScaleUp} // Add the scaleUp animation
      >
        <div>
          <Image
            src={
              masterVariant?.images?.length
                ? masterVariant?.images[0]?.url
                : undefined
            }
            alt={
              masterVariant?.images?.length
                ? masterVariant?.images[0]?.label
                : undefined
            }
            width={
              masterVariant?.images?.length
                ? masterVariant?.images[0].dimensions?.w
                : 0
            }
            height={
              masterVariant?.images?.length
                ? masterVariant?.images[0].dimensions?.h
                : 0
            }
          />
          <span>
            <label>New</label>
          </span>
        </div>
        <div>
          <h2>{getLocaleValue(name)}</h2>
          {description && <h5>{getLocaleValue(description)}</h5>}
          <div>
            {price && (
              <span>
                <Price price={price} locale={locale} />
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
