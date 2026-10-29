import { describe, it, expect } from "vitest";
import { handleApiRequest } from "@/server/api";

describe("Section 12: Backend API Endpoints", () => {
  it("GET /api/cases - lists cases in demo mode", async () => {
    const req = new Request("http://localhost:3000/api/cases", { method: "GET" });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.cases).toBeDefined();
    expect(data.cases.length).toBeGreaterThan(0);
    expect(data.cases[0].id).toBe("mehta");
  });

  it("GET /api/cases/:id - loads case inputs", async () => {
    const req = new Request("http://localhost:3000/api/cases/mehta", { method: "GET" });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.case.id).toBe("mehta");
    expect(data.case.inputs.liquid).toBe(80.0);
  });

  it("POST /api/cases/:id/scenarios - computes server-side with model.ts", async () => {
    const req = new Request("http://localhost:3000/api/cases/mehta/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moves: ["buy"], label: "Mr. Mehta's Plan" }),
    });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.scenario.outputs.cashForPlant).toBe(33.95);
    expect(data.scenario.outputs.plantGap).toBe(6.05);
    expect(data.scenario.outputs.propertyShare).toBe(67.9);
  });

  it("GET /api/cases/:id/log - returns scenario timeline", async () => {
    const req = new Request("http://localhost:3000/api/cases/mehta/log", { method: "GET" });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.log).toBeDefined();
    expect(data.log.length).toBeGreaterThan(0);
  });

  it("POST /api/cases/:id/decision - records chosen scenario", async () => {
    const req = new Request("http://localhost:3000/api/cases/mehta/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenarioId: "P5",
        chosen: true,
        rationale: "Balances liquidity, independence and legacy.",
      }),
    });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.decision.scenarioId).toBe("P5");
  });

  it("GET /api/cases/:id/summary - deterministic recap and next steps", async () => {
    const req = new Request("http://localhost:3000/api/cases/mehta/summary", { method: "GET" });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.caseId).toBe("mehta");
    expect(data.baseline).toBeDefined();
    expect(data.chosenScenario).toBeDefined();
  });

  it("GET /api/sources - returns data register", async () => {
    const req = new Request("http://localhost:3000/api/sources", { method: "GET" });
    const res = await handleApiRequest(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sources).toBeDefined();
    expect(data.sources.length).toBeGreaterThan(0);
  });
});
