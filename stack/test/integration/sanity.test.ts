import { getProductFromSlug } from "../../app/sanity/index.server";

test("getProductFromSlug works", async () => {
  const slug = "led-high-tops";
  const product = await getProductFromSlug(slug);
  expect(product.store?.slug.current).toBe(slug);
});
