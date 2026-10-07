import { describe, expect, it } from "vitest";
import { APP_NAME } from "./brand";

describe("brand configuration", () => {
  it("defines a single application name constant", () => {
    expect(APP_NAME).toBe("Cuídame");
  });
});
