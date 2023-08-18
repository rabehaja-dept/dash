import { test } from "vitest";
import fetch from "node-fetch";

test("Cloudinary transformed image returns a 200", async () => {
  const url =
    "https://res.cloudinary.com/dept-dash/image/fetch/r_100/q_auto/f_auto/https://images.ctfassets.net/jcdjo56lmw8q/3nM5NslPwNqE2vFbjIniCk/9fa93ee39f580d977f0170f7b5bd93e3/sky.jpg?_a=AJAK9WI0";
  const response = await fetch(url.toString(), { method: "HEAD" });
  expect(response.status).toBe(200);
});
