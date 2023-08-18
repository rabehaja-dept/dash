import {
  getRandomString,
  parseCategories,
  parseDeploymentTarget,
  toKebabCase,
} from "./initStack";

test("getRandomString works", () => {
  expect(getRandomString(10).length).toBe(20);
  expect(getRandomString(20).length).toBe(40);
  expect(getRandomString(30).length).toBe(60);
  expect(getRandomString(40).length).toBe(80);
});

test("toKebabCase works", () => {
  expect(toKebabCase("thisIsATestString")).toBe("this-is-a-test-string");
});

test("parseCategories works", () => {
  const categories = parseCategories(["base"]);
  expect(categories.includes("base")).toBe(true);
  expect(() => {
    parseCategories(["notValid"]);
  }).toThrow("Attempted to parse invalid array of categories: notValid");
});

test.each([
  ["AWS", "AWS"],
  ["Fly.io", "Fly.io"],
  ["Vercel", "Vercel"],
])("parseDeploymentTarget valid target works", (input, expected) => {
  const deploymentTarget = parseDeploymentTarget(input);
  expect(deploymentTarget).toBe(expected);
});

test("parseDeploymentTarget invalid target throws", () => {
  expect(() => {
    parseDeploymentTarget("notValid");
  }).toThrow("Attempted to parse invalid deployment target: notValid");
});
