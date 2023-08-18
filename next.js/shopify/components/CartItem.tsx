import {
  useCartLine,
  Money,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
} from "@shopify/hydrogen-react";
import { Image } from "@shopify/hydrogen-react";
import Link from "next/link";

export default function CartItem() {
  const { id: lineId, quantity, merchandise, cost } = useCartLine();

  return (
    <tr key={lineId}>
      <td>
        <Link href={`/shopify/${merchandise.product.handle}`}>
          <h3>{merchandise.product.title}</h3>
          <Image
            width={112}
            height={112}
            alt={merchandise.title}
            src={merchandise.image?.url}
          />
        </Link>
      </td>
      <td>
        {(merchandise?.selectedOptions || []).map((option) => (
          <div key={option.name}>
            <b>{option.name}:</b> {option.value}
          </div>
        ))}
      </td>
      <td>
        <CartLineQuantityAdjustButton adjust="decrease">
          -
        </CartLineQuantityAdjustButton>
        <CartLineQuantity />
        <CartLineQuantityAdjustButton adjust="increase">
          +
        </CartLineQuantityAdjustButton>
      </td>
      <td>
        <Money data={merchandise.price} />
      </td>
      <td>
        <Money data={cost.totalAmount} />
      </td>
      <td>
        <CartLineQuantityAdjustButton adjust="remove">
          x
        </CartLineQuantityAdjustButton>
      </td>
    </tr>
  );
}
