import { ProductCard } from "./ProductCard";

export default function Store({ products }) {
  const gridTemplateColumns = "3fr 3fr 3fr";
  return (
    <div style={{ display: "grid", gridTemplateColumns }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
