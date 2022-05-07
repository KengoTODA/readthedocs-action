import { describe, expect, it } from "@jest/globals";
import { escape } from "../src/rtd";

describe("#escape()", () => {
  it('replaces "/" with "-"', () => {
    const result = escape("dependabot/npm_and_yarn/foobar");
    expect(result).toBe("dependabot-npm_and_yarn-foobar");
  });
  it("throws error if ? exists in text", () => {
    expect(() => {
      escape("what-is-this?");
    }).toThrow('name should not contains ? mark, but it was "what-is-this?"');
  });
  it("does nothing otherwise", () => {
    const result = escape("branch-name");
    expect(result).toBe("branch-name");
  });
});
