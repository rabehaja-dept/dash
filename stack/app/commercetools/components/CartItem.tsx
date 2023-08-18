import { QuantitySelector } from "./QuantitySelector";
import { Link } from "~/components/interactive/Link";
import { Price } from "./Price";
import { LineItem } from "@commercetools/platform-sdk";

interface CartType {
  data: LineItem;
  cartId: string;
  cartVersion: number;
  locale: string;
  language: string;
}

export function CartItem({
  data,
  cartId,
  cartVersion,
  locale,
  language,
}: CartType) {
  const { id: lineId, name, variant, productSlug, quantity, totalPrice } = data;

  const getLocaleValue = (value: any) => {
    /**
     * Localized key in response may contain only language code or
     * both language-country, so we need to get string from one of these
     */
    return value[locale] ? value[locale] : value[language];
  };

  return (
    <li key={lineId} className="flex items-center gap-4 p-1">
      <div className="flex-shrink">
        <img
          width={112}
          height={112}
          alt={variant?.images?.length ? variant?.images[0]?.label : ""}
          src={variant?.images?.length ? variant?.images[0]?.url : undefined}
          className="h-32 w-32 border object-cover object-center md:h-36 md:w-36"
        />
      </div>

      <div className="flex flex-col justify-center gap-3">
        <Link variant="unstyled" to={`/shopify/${getLocaleValue(productSlug)}`}>
          <h3 className="hover:underline">{getLocaleValue(name)}</h3>
        </Link>

        <div>
          <div className="grid pb-2 text-xs">
            {(variant.attributes || []).map((option) => (
              <div key={option.name}>
                <span className="mr-1 font-bold">{option.name}:</span>
                {getLocaleValue(option.value)}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <div className="text-copy flex justify-start">
              <QuantitySelector
                cartVersion={cartVersion}
                cartId={cartId}
                lineId={lineId}
                quantity={quantity}
              />
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <Price price={totalPrice} locale={locale} className="font-bold" />
          </div>
        </div>
      </div>
    </li>
  );
}
