import { describe, expect, it } from "vitest";
import {
  getCanonicalCategoryPath,
  resolveCartaFromRoute,
  toCartaSlug,
} from "./cartaSlug";

describe("cartaSlug utils", () => {
  it("generates lowercase slugs", () => {
    expect(toCartaSlug("RESTAURANT")).toBe("restaurant");
    expect(toCartaSlug("PROMOCIONES")).toBe("promociones");
    expect(toCartaSlug("BEBIDAS PREMIUM")).toBe("bebidas-premium");
    expect(toCartaSlug("POSTRES & CAFE")).toBe("postres-y-cafe");
  });

  it("resolves known categories from lowercase slug and legacy uppercase values", () => {
    expect(resolveCartaFromRoute("restaurant")).toBe("RESTAURANT");
    expect(resolveCartaFromRoute("promociones")).toBe("PROMOCIONES");
    expect(resolveCartaFromRoute("BEBIDAS%20PREMIUM")).toBe("BEBIDAS PREMIUM");
    expect(resolveCartaFromRoute("POSTRES%20%26%20CAFE")).toBe("POSTRES & CAFE");
  });

  it("builds canonical paths and falls back to home for unknown values", () => {
    expect(getCanonicalCategoryPath("restaurant")).toBe("/restaurant");
    expect(getCanonicalCategoryPath("POSTRES%20%26%20CAFE")).toBe("/postres-y-cafe");
    expect(getCanonicalCategoryPath("unknown-category")).toBe("/");
    expect(getCanonicalCategoryPath(undefined)).toBe("/");
  });
});
