import { describe, expect, it } from "vitest";
import { assetUrl } from "../src/utils/assets";

describe("assetUrl", () => {
  it("returns a requestable URL for local assets", () => {
    expect(assetUrl("/assets/portada.jpg")).toBe("/assets/portada.jpg");
    expect(assetUrl("/favicon.svg")).toBe("/favicon.svg");
  });

  it("repairs legacy hash-based asset URLs", () => {
    expect(assetUrl("/#/assets/portada.jpg")).toBe("/assets/portada.jpg");
    expect(assetUrl("/jpdesigner/#/assets/portada.jpg")).toBe("/assets/portada.jpg");
    expect(assetUrl("/#/favicon.svg")).toBe("/favicon.svg");
  });

  it("preserves external URLs and regular values", () => {
    expect(assetUrl("https://example.com/image.jpg")).toBe("https://example.com/image.jpg");
    expect(assetUrl("data:image/svg+xml;base64,abc")).toBe("data:image/svg+xml;base64,abc");
  });
});
