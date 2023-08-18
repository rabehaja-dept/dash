import { Collection } from "@shopify/hydrogen-react/storefront-api-types";
import { Money, Image } from "@shopify/hydrogen-react";
import Link from "next/link";

export type ProductCardProps = {
  product: Collection | any;
};
export function ProductCard({ product }: ProductCardProps) {
  let { handle, title, vendor, price, compareAtPrice, variants, image } =
    product;

  price = variants.nodes[0].priceV2;
  compareAtPrice = variants.nodes[0].compareAtPriceV2;

  return (
    <Link href={`/shopify/${handle}`}>
      <article>
        <Image
          src={variants?.nodes?.length ? variants.nodes[0]?.image?.url : image}
          alt={title}
          width={300}
          height={300}
        />
        <div>
          {vendor && <h5>{vendor}</h5>}
          <h4>{title}</h4>
          <div>
            <span
              style={compareAtPrice ? { textDecoration: "line-through" } : null}
            >
              <Money data={price} />
            </span>
            {compareAtPrice && <Money data={compareAtPrice} />}
          </div>
        </div>
      </article>
      <br />
      <br />
    </Link>
  );
}
