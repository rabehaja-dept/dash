export async function getActiveCart() {
  const response = await fetch("/api/commercetools/cart/getActiveCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch active cart");
  }

  const data = await response.json();
  return data.result;
}
