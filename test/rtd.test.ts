import { describe, expect, it, jest } from "@jest/globals";
import RTD, { Project } from "../src/rtd";

require("dotenv").config();

const timeout = 15 * 1000;
const integrationTest = process.env["RTD_TOKEN"] ? describe : describe.skip;

integrationTest("rtd", function () {
  const token = process.env.RTD_TOKEN as string;
  jest.setTimeout(timeout);

  describe("#enableBuild()", () => {
    it("should return false if branch is already activated", async () => {
      const rtd = new RTD(token);
      return rtd
        .enableBuild("your-read-the-docs-project", "master")
        .then((enabled) => {
          expect(enabled).toBeFalsy();
        });
    });
  });

  describe("#disabledBuild()", () => {
    it("should return false if branch is already disabled", async () => {
      const rtd = new RTD(token);
      return rtd
        .disableBuild("your-read-the-docs-project", "v0.1.0")
        .then((enabled) => {
          expect(enabled).toBeFalsy();
        });
    });
  });

  describe("#getProject()", () => {
    it("returns correct ID", async () => {
      const rtd = new RTD(token);
      const result = await rtd.getProject("your-read-the-docs-project");
      expect(result.id).toBe(235403);
      expect(result.language).toBe("en");
    });
    it("returns rejected promise for not existing project", async () => {
      const rtd = new RTD(token);
      return rtd.getProject("not-existing").then(
        () => Promise.reject(new Error("Expected method to reject.")),
        (err) => expect(err).toBeInstanceOf(Error)
      );
    });
  });

  describe("#getTranslates()", () => {
    it("returns single translate", async () => {
      const rtd = new RTD(token);
      const result = await rtd.getTranslates(
        new Project(235403, "en", "your-read-the-docs-project")
      );
      expect(result).toStrictEqual([
        new Project(235403, "en", "your-read-the-docs-project"),
      ]);
    });
    it("returns multiple translates", async () => {
      const rtd = new RTD(token);
      const result = await rtd.getTranslates(
        new Project(79934, "en", "spotbugs-in-kengo-toda")
      );
      expect(result).toStrictEqual([
        new Project(79934, "en", "spotbugs-in-kengo-toda"),
        new Project(
          79941,
          "ja",
          "spotbugs-in-kengo-toda-ja",
          new Project(79934, "en", "spotbugs-in-kengo-toda")
        ),
      ]);
    });
  });
});
