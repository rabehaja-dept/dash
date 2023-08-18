import { useCartLine } from "@shopify/hydrogen";
import { QuantitySelector } from "./QuantitySelector";
import { Price } from "./Price";

export function MiniCartLineItem() {
  const { id: lineId, quantity, merchandise } = useCartLine();

  return (
    <li
      key={lineId}
      className="flex items-center gap-4 rounded-md p-1 outline outline-1 outline-border"
    >
      <div className="flex-shrink">
        <img
          width={112}
          height={112}
          alt={merchandise.title}
          src={merchandise.image?.url}
          className="h-32 w-32 border object-cover object-center md:h-36 md:w-36"
        />
      </div>

      <div className="flex flex-grow justify-between">
        <div className="w-full">
          <div className="flex flex-row items-center justify-between gap-2">
            <h4>{merchandise.product.title}</h4>
            <div className="flex gap-1">
              {merchandise.compareAtPriceV2 && (
                <Price
                  amount={parseFloat(merchandise.compareAtPriceV2?.amount)}
                  currencyCode={merchandise.priceV2.currencyCode}
                  className="text-gray-500 line-through"
                />
              )}

              <Price
                amount={parseFloat(merchandise.priceV2.amount) * quantity}
                currencyCode={merchandise.priceV2.currencyCode}
              />
            </div>
          </div>

          <hr className="my-2 border-border" />

          <div className="grid pb-2 text-xs">
            {(merchandise?.selectedOptions || []).map((option) => (
              <div key={option.name}>
                <span className="font-bold">{option.name}:</span> {option.value}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-copy flex justify-start">
              <QuantitySelector lineId={lineId} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
