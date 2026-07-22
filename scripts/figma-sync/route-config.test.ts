import { describe, expect, it } from "vitest";
import { extractRoutePatterns, materializeRoute, routeId } from "./route-config";

describe("figma sync route discovery", () => {
  it("extracts nested marketing routes as absolute website paths", () => {
    const source = `
      <Route path="/login" element={<Login />} />
      <Route path="/website" element={<WebsiteLayout />}>
        <Route index element={<WebsiteHome />} />
        <Route path="pricing" element={<WebsitePricing />} />
      </Route>
    `;

    expect(extractRoutePatterns(source)).toEqual(["/login", "/website", "/website/pricing"]);
  });

  it("filters redirect-only and wildcard routes", () => {
    expect(materializeRoute("/desktop")).toBeNull();
    expect(materializeRoute("/mobile/*")).toBeNull();
    expect(materializeRoute("*")).toBeNull();
  });

  it("samples dynamic routes with stable mock ids", () => {
    const route = materializeRoute("/advertising/campaigns/:campaignId/:adGroupId/:productAdId");

    expect(route?.urlPath).toBe("/advertising/campaigns/1/ag-1/pa-1");
    expect(route?.sampleParams).toEqual({
      campaignId: "1",
      adGroupId: "ag-1",
      productAdId: "pa-1",
    });
  });

  it("groups shared component routes separately from settings", () => {
    expect(materializeRoute("/settings/design-system")?.figmaPage).toBe("Shared Components");
    expect(materializeRoute("/settings/component-library/:section")?.figmaPage).toBe("Shared Components");
    expect(materializeRoute("/settings/accounts")?.figmaPage).toBe("Settings");
  });

  it("creates stable ids from URL paths", () => {
    expect(routeId("/website/products/managed-services")).toBe("website-products-managed-services");
  });
});
