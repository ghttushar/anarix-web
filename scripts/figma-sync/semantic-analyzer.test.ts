import { describe, expect, it } from "vitest";
import { analyzeDomSnapshot } from "./semantic-analyzer";
import type { DomSnapshotNode } from "./types";

function domNode(overrides: Partial<DomSnapshotNode>): DomSnapshotNode {
  return {
    tag: "div",
    rect: { x: 0, y: 0, width: 100, height: 40 },
    styles: {},
    children: [],
    ...overrides,
  };
}

function analyze(child: DomSnapshotNode) {
  return analyzeDomSnapshot(
    {
      root: domNode({
        tag: "body",
        rect: { x: 0, y: 0, width: 1440, height: 900 },
        children: [
          domNode({
            id: "root",
            rect: { x: 0, y: 0, width: 1440, height: 900 },
            children: [child],
          }),
        ],
      }),
      truncated: false,
    },
    {
      routeId: "fixture",
      routeTitle: "Fixture",
      documentSize: { width: 1440, height: 900 },
      quality: "high",
    },
  );
}

describe("figma sync semantic analyzer", () => {
  it("converts flex rows into Auto Layout metadata", () => {
    const tree = analyze(
      domNode({
        className: "flex items-center justify-between gap-4 px-6 py-3",
        rect: { x: 24, y: 24, width: 640, height: 64 },
        styles: {
          display: "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
          "align-items": "center",
          gap: "16px",
          "padding-left": "24px",
          "padding-right": "24px",
          "padding-top": "12px",
          "padding-bottom": "12px",
        },
        children: [
          domNode({ text: "Search", rect: { x: 48, y: 40, width: 96, height: 20 } }),
          domNode({ text: "Export", rect: { x: 560, y: 40, width: 72, height: 20 } }),
        ],
      }),
    );

    const frame = tree?.children[0];
    expect(frame?.layout.mode).toBe("HORIZONTAL");
    expect(frame?.layout.gap).toBe(16);
    expect(frame?.layout.padding.left).toBe(24);
    expect(frame?.layout.primaryAlign).toBe("SPACE_BETWEEN");
    expect(frame?.layout.counterAlign).toBe("CENTER");
  });

  it("reconstructs HTML tables as rows and cells", () => {
    const tree = analyze(
      domNode({
        tag: "table",
        rect: { x: 32, y: 96, width: 720, height: 120 },
        children: [
          domNode({
            tag: "tbody",
            rect: { x: 32, y: 96, width: 720, height: 120 },
            children: [
              domNode({
                tag: "tr",
                rect: { x: 32, y: 96, width: 720, height: 40 },
                children: [
                  domNode({ tag: "td", text: "Campaign", rect: { x: 32, y: 96, width: 240, height: 40 } }),
                  domNode({ tag: "td", text: "Spend", rect: { x: 272, y: 96, width: 120, height: 40 } }),
                ],
              }),
              domNode({
                tag: "tr",
                rect: { x: 32, y: 136, width: 720, height: 40 },
                children: [
                  domNode({ tag: "td", text: "Brand", rect: { x: 32, y: 136, width: 240, height: 40 } }),
                  domNode({ tag: "td", text: "$1,200", rect: { x: 272, y: 136, width: 120, height: 40 } }),
                ],
              }),
            ],
          }),
        ],
      }),
    );

    const table = tree?.children[0];
    expect(table?.kind).toBe("table");
    expect(table?.layout.mode).toBe("VERTICAL");
    expect(table?.children).toHaveLength(2);
    expect(table?.children[0].kind).toBe("row");
    expect(table?.children[0].layout.mode).toBe("HORIZONTAL");
    expect(table?.children[0].children.map((child) => child.kind)).toEqual(["cell", "cell"]);
  });
});
