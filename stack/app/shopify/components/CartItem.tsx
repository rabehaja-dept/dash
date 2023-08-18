import { useCartLine } from "@shopify/hydrogen";
import { QuantitySelector } from "./QuantitySelector";
import { Link } from "~/components/interactive/Link";
import { Price } from "./Price";
export function CartItem() {
  const { id: lineId, quantity, merchandise } = useCartLine();

  return (
    <li key={lineId} className="flex items-center gap-4 p-1">
      <div className="flex-shrink">
        <img
          width={112}
          height={112}
          alt={merchandise.title}
          src={merchandise.image?.url}
          className="h-32 w-32 border object-cover object-center md:h-36 md:w-36"
        />
      </div>

      <div className="flex flex-col justify-center gap-3">
        <Link variant="unstyled" to={`/shopify/${merchandise.product.handle}`}>
          <h3 className="hover:underline">{merchandise.product.title}</h3>
        </Link>

        <div>
          <div className="grid pb-2 text-xs">
            {(merchandise?.selectedOptions || []).map((option) => (
              <div key={option.name}>
                <span className="font-bold">{option.name}:</span> {option.value}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <div className="text-copy flex justify-start">
              <QuantitySelector lineId={lineId} quantity={quantity} />
            </div>
          </div>

          <div className="mt-4 md:hidden">
            <Price
              amount={parseFloat(merchandise.priceV2.amount) * quantity}
              currencyCode={merchandise.priceV2.currencyCode}
              className="font-bold"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
