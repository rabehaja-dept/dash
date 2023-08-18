import { QuantitySelector } from "./QuantitySelector";
import { Price } from "./Price";
import { LineItem } from "@commercetools/platform-sdk";

interface MiniCartLineItemType {
  line: LineItem;
  locale: string;
  currencyCode: string;
  cartId: string;
  cartVersion: number;
}

export function MiniCartLineItem({
  line,
  locale,
  currencyCode,
  cartId,
  cartVersion,
}: MiniCartLineItemType) {
  const { id: lineId, name, variant, quantity } = line;

  const price =
    variant?.prices?.filter(
      (price) => price.value?.currencyCode === currencyCode
    )[0].value || null;

  return (
    <li
      key={lineId}
      className="flex items-center gap-4 rounded-md p-1 outline outline-1 outline-border"
    >
      <div className="flex-shrink">
        <img
          width={112}
          height={112}
          alt={variant?.images?.length ? variant?.images[0]?.label : ""}
          src={variant?.images?.length ? variant?.images[0]?.url : undefined}
          className="h-32 w-32 border object-cover object-center md:h-36 md:w-36"
        />
      </div>

      <div className="flex flex-grow justify-between">
        <div className="w-full">
          <div className="flex flex-row items-center justify-between gap-2">
            <h4>{name[locale]}</h4>
            <div className="flex gap-1">
              <Price price={price} locale={locale} />
            </div>
          </div>

          <hr className="my-2 border-border" />

          <div className="grid pb-2 text-xs">
            {(variant.attributes || []).map((option) => (
              <div key={option.name}>
                <span className="font-bold">{option.name}:</span>{" "}
                {option.value[locale]}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-copy flex justify-start">
              <QuantitySelector
                cartId={cartId}
                cartVersion={cartVersion}
                lineId={lineId}
                quantity={quantity}
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
