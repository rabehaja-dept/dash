import { allProducts, productQuery } from "../../app/shopify/index";

test("allProducts works", async () => {
  const products = await allProducts();
  expect(products.length).toBe(21);
});

test("productQuery works", async () => {
  const handle = "led-high-tops";
  const product = await productQuery(handle);
  expect(product.product.id).toBe("gid://shopify/Product/7356490809508");
});
