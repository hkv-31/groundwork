import { computeModel, defaultModelSetup, type MoveId, type ModelSetup } from "../lib/model";
import { sourcesTable } from "../lib/data";

// In-memory demo data store (Zero environment variables required)
interface CaseData {
  id: string;
  familyName: string;
  inputs: ModelSetup;
  scenarios: {
    id: string;
    moves: MoveId[];
    outputs: ReturnType<typeof computeModel>;
    label: string;
    createdAt: string;
  }[];
  decision?: {
    scenarioId: string;
    chosen: boolean;
    rationale: string;
    nextSteps: { who: string; what: string; when: string }[];
  };
}

const memoryStore: Record<string, CaseData> = {
  mehta: {
    id: "mehta",
    familyName: "Mehta Family",
    inputs: { ...defaultModelSetup },
    scenarios: [
      {
        id: "P0",
        moves: [],
        outputs: computeModel([], defaultModelSetup),
        label: "P0 — Status Quo",
        createdAt: new Date().toISOString(),
      },
    ],
    decision: {
      scenarioId: "P5",
      chosen: true,
      rationale: "Renting Worli + ring-fencing housing fund balances independence, liquidity and fairness.",
      nextSteps: [
        { who: "CA", what: "Confirm capital gains on any sale and gift-tax treatment", when: "20 Nov 2026" },
        { who: "Lawyer", what: "Draft gift deed / family settlement terms", when: "27 Nov 2026" },
        { who: "Anika", what: "Negotiate Worli asking price; get transacted comps", when: "1 Dec 2026" },
        { who: "Family", what: "Reconvene to sign off before Worli offer expires", when: "10 Dec 2026" },
      ],
    },
  },
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

/**
 * Handles all /api/* requests matching Section 12 endpoints.
 */
export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "");
  const method = request.method;

  if (method === "OPTIONS") {
    return json({ ok: true });
  }

  // 1. GET & POST /api/cases
  if (path === "/cases" || path === "/cases/") {
    if (method === "GET") {
      const cases = Object.values(memoryStore).map((c) => ({
        id: c.id,
        familyName: c.familyName,
        createdAt: c.scenarios[0]?.createdAt ?? new Date().toISOString(),
      }));
      return json({ cases, mode: "demo_in_memory" });
    }
    if (method === "POST") {
      try {
        const body = (await request.json()) as Partial<CaseData>;
        const id = body.id || `case_${Date.now()}`;
        memoryStore[id] = {
          id,
          familyName: body.familyName || "New Family Case",
          inputs: { ...defaultModelSetup, ...body.inputs },
          scenarios: [],
        };
        return json({ case: memoryStore[id] }, 201);
      } catch {
        return json({ error: "Invalid JSON body" }, 400);
      }
    }
  }

  // 2. GET /api/sources
  if (path === "/sources" || path === "/sources/") {
    return json({ sources: sourcesTable });
  }

  // Case-specific routes: /cases/:id/...
  const caseMatch = path.match(/^\/cases\/([^/]+)(.*)$/);
  if (!caseMatch) {
    return json({ error: "Not Found", endpoint: path }, 404);
  }

  const caseId = caseMatch[1];
  const subPath = caseMatch[2];
  const currentCase = memoryStore[caseId] ?? memoryStore["mehta"];

  if (!currentCase) {
    return json({ error: `Case not found: ${caseId}` }, 404);
  }

  // 3. GET /api/cases/:id and PUT /api/cases/:id
  if (subPath === "" || subPath === "/") {
    if (method === "GET") {
      return json({ case: currentCase });
    }
    if (method === "PUT") {
      try {
        const body = (await request.json()) as Partial<CaseData>;
        if (body.inputs) {
          currentCase.inputs = { ...currentCase.inputs, ...body.inputs };
        }
        if (body.familyName) {
          currentCase.familyName = body.familyName;
        }
        return json({ case: currentCase });
      } catch {
        return json({ error: "Invalid JSON body" }, 400);
      }
    }
  }

  // 4. POST /api/cases/:id/scenarios
  if (subPath === "/scenarios" && method === "POST") {
    try {
      const body = (await request.json()) as { moves: MoveId[]; label?: string; createdBy?: string };
      const moves = body.moves || [];
      const outputs = computeModel(moves, currentCase.inputs);
      const scenario = {
        id: `sc_${Date.now()}`,
        moves,
        outputs,
        label: body.label || `Scenario with ${moves.length} moves`,
        createdAt: new Date().toISOString(),
      };
      currentCase.scenarios.unshift(scenario);
      return json({ scenario }, 201);
    } catch {
      return json({ error: "Invalid request" }, 400);
    }
  }

  // 5. GET /api/cases/:id/log
  if (subPath === "/log" && method === "GET") {
    return json({
      caseId,
      log: currentCase.scenarios.map((s) => ({
        id: s.id,
        label: s.label,
        moves: s.moves,
        fairnessGap: s.outputs.fairnessGap,
        cashForPlant: s.outputs.cashForPlant,
        propertyShare: s.outputs.propertyShare,
        createdAt: s.createdAt,
      })),
    });
  }

  // 6. POST /api/cases/:id/decision
  if (subPath === "/decision" && method === "POST") {
    try {
      const body = (await request.json()) as {
        scenarioId: string;
        chosen: boolean;
        rationale: string;
        nextSteps?: { who: string; what: string; when: string }[];
      };
      currentCase.decision = {
        scenarioId: body.scenarioId,
        chosen: body.chosen ?? true,
        rationale: body.rationale || "",
        nextSteps: body.nextSteps || currentCase.decision?.nextSteps || [],
      };
      return json({ decision: currentCase.decision }, 200);
    } catch {
      return json({ error: "Invalid request" }, 400);
    }
  }

  // 7. GET /api/cases/:id/summary
  if (subPath === "/summary" && method === "GET") {
    const baseline = computeModel([], currentCase.inputs);
    const chosenScenario = currentCase.scenarios[0] ?? {
      id: "P5",
      moves: ["rent", "fund", "alibaug", "equal"],
      outputs: computeModel(["rent", "fund", "alibaug", "equal"], currentCase.inputs),
      label: "P5 — Housing fund (hypothesis)",
    };

    return json({
      caseId: currentCase.id,
      familyName: currentCase.familyName,
      baseline,
      chosenScenario,
      decision: currentCase.decision,
      deadlines: chosenScenario.outputs.deadlines,
      status: chosenScenario.outputs.status,
    });
  }

  return json({ error: "Endpoint not found" }, 404);
}
