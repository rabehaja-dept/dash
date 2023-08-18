import { Label } from "~/components/interactive";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "@remix-run/react";
import { Customer, ProductProjection } from "@commercetools/platform-sdk";
import { Price } from "./Price";
import { fallbackLanguage } from "~/i18n-config";
import { useTranslation } from "react-i18next";

export type ProductCardProps = {
  product: ProductProjection;
  currencyCode: string;
  locale: string;
  language: string;
  customer: Customer | null;
};

export const ProductCard = ({
  product,
  currencyCode,
  locale,
  language,
  customer,
}: ProductCardProps) => {
  const { name, description, slug, masterVariant } = product;
  const { t } = useTranslation("commercetools");
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

    return "/";
  };

  const prices = masterVariant?.prices?.filter(
    (price) => price.value?.currencyCode === currencyCode
  );

  const embeddedPrice = prices?.filter(
    (price) => price.customerGroup?.id === customer?.customerGroup?.id
  );

  const price = embeddedPrice?.length
    ? embeddedPrice[0]?.value
    : prices?.length
    ? prices[0]?.value
    : null;

  return (
    <Link to={getLocaleValue(slug)} prefetch="intent">
      <article className="group relative flex h-full cursor-pointer flex-col items-center justify-center p-4 outline outline-1 outline-border hover:outline-2 hover:outline-black">
        <div className="relative w-full">
          <LazyLoadImage
            className="max-h-[200px] w-full object-cover"
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
            height="200px"
            width="400px"
          />
          <span className="absolute bottom-3 left-2">
            <Label variant="filled" rounded>
              {t("New")}
            </Label>
          </span>
        </div>
        <div className="mt-4 flex w-full flex-col justify-start">
          <h2 className="truncate text-lg font-bold">{getLocaleValue(name)}</h2>
          {description && (
            <h5 className="text-md overflow-hidden text-ellipsis whitespace-nowrap">
              {getLocaleValue(description)}
            </h5>
          )}
          <hr className="my-4" />
          <div className="price mb-4 flex flex-row items-center justify-end">
            {price && (
              <span className="text-xl font-bold">
                <Price price={price} locale={locale} />
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};
