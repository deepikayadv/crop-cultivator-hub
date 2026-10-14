import { describe, expect, it } from "vitest";
import { canAccess } from "./access";

describe("canAccess", () => {
  it("blocks anonymous visitors from farmer pages", () => {
    expect(canAccess(null, "farmer")).toBe(false);
  });
  it("lets farmers into farmer pages", () => {
    expect(canAccess("farmer", "farmer")).toBe(true);
  });
  it("blocks farmers from admin pages", () => {
    expect(canAccess("farmer", "admin")).toBe(false);
  });
  it("lets admins into admin pages", () => {
    expect(canAccess("admin", "admin")).toBe(true);
  });
});
