import { LineItem } from "@commercetools/platform-sdk";
import { Price } from "./Price";
import { getLanguageFromLocaleString } from "../utils";

interface CheckoutProductsType {
  data: LineItem[];
  locale: string;
}

export default function CheckoutProducts({
  data,
  locale,
}: CheckoutProductsType) {
  const language = getLanguageFromLocaleString(locale);
  const getLocaleValue = (value: any) => {
    /**
     * Localized key in response may contain only language code or
     * both language-country, so we need to get string from one of these
     */
    return value[locale] ? value[locale] : value[language];
  };

  return (
    <>
      {data?.length &&
        data.map((product) => (
          <div
            key={product.id}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="relative">
                <img
                  width={64}
                  height={64}
                  alt={
                    product.variant?.images?.length
                      ? product.variant?.images[0]?.label
                      : ""
                  }
                  src={
                    product.variant?.images?.length
                      ? product.variant?.images[0]?.url
                      : undefined
                  }
                  className="border-1 h-18 w-18 border border-border-base object-cover object-center md:h-24 md:w-24"
                />
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-text-weak p-2 text-white">
                  {product.quantity}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-md mb-2">
                  {getLocaleValue(product.name)}
                </div>
                {(product.variant.attributes || []).map((option) => (
                  <div key={option.name}>
                    <span className="text-xs text-text-weak">
                      {getLocaleValue(option.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Price price={product.totalPrice} locale={locale} />
          </div>
        ))}
    </>
  );
}
