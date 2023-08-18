import * as remove from "./remove";

// These tests are pretty ugly because there's a lot of multi-line strings which makes the indentation look wild

test("executeRemove works", () => {
  const testString = `first line
remove this base
last line`;
  // const result = remove.removeLine(testString, ["test"]);
  const result = remove.executeRemove(
    testString,
    ["base"],
    /.*remove this ([a-zA-Z0-9_]+)\n/g
  );
  expect(result).toBe(`first line
last line`);
});

test("executeReplace works", () => {
  const testString = `first line
replace this base: with this
last line`;
  // const result = remove.removeLine(testString, ["test"]);
  const result = remove.executeReplace(
    testString,
    ["base"],
    /.*replace this ([a-zA-Z0-9_]+): (.*)\n/g
  );
  expect(result).toBe(`first line
with this
last line`);
});

test("removeLine works", () => {
  const testString = `first line
remove this // @dash-remove base
last line`;
  const result = remove.removeLine(testString, ["base"]);
  expect(result).toBe(`first line
last line`);
});

test("removeLine works on the last line", () => {
  const testString = `remove this // @dash-remove base
first line
remove this # @dash-remove base
last line
remove this {/* @dash-remove base */}`;
  const result = remove.removeLine(testString, ["base"]);
  // We know we'll have a trailing newline because it only removes the contents of the last line, not the prior newline
  // This is somewhat unique behavior, but everything should have a trailing newline anyway, so it's okay
  expect(result).toBe(`first line
last line
`);
});

test("removeNextLine works", () => {
  const testString = `first line
// @dash-remove-next-line base
remove this
last line`;
  const result = remove.removeNextLine(testString, ["base"]);
  expect(result).toBe(`first line
last line`);
});

test("removeNextLine works on the last line", () => {
  const testString = `first line
// @dash-remove-next-line base
remove this`;
  const result = remove.removeNextLine(testString, ["base"]);
  expect(result).toBe(`first line
`);
});

test("removeStartAndEnd works", () => {
  const testString = `first line
// @dash-remove-start base
remove this
and also this
// @dash-remove-end
middle line
// @dash-remove-start someOtherCategory
last line
// @dash-remove-end`;
  const result = remove.removeStartAndEnd(testString, ["base"]);
  expect(result).toBe(`first line
middle line
// @dash-remove-start someOtherCategory
last line
// @dash-remove-end`);
});

test("replaceLine works", () => {
  const testString = `first line
replace this // @dash-replace base: with this
last line`;
  const result = remove.replaceLine(testString, ["base"]);
  expect(result).toBe(`first line
with this
last line`);
});

test("replaceLine works on the last line", () => {
  const testString = `first line
replace this // @dash-replace base: with this`;
  const result = remove.replaceLine(testString, ["base"]);
  // The replace process adds a newline intentionally, so we end up with a trailing newline
  expect(result).toBe(`first line
with this
`);
});

test("replaceNextLine works", () => {
  const testString = `first line
// @dash-replace-next-line base: with this
replace this
last line`;
  const result = remove.replaceNextLine(testString, ["base"]);
  expect(result).toBe(`first line
with this
last line`);
});

test("replaceNextLine works on the last line", () => {
  const testString = `first line
// @dash-replace-next-line base: with this
replace this`;
  const result = remove.replaceNextLine(testString, ["base"]);
  // The replace process adds a newline intentionally, so we end up with a trailing newline
  expect(result).toBe(`first line
with this
`);
});
