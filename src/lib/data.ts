import { computeModel, type ModelOutput } from "./model";

export type Tag = "Case" | "Sourced" | "Assumed" | "Missing";
export type Status = "Met" | "Partly" | "Not met";
export type PropStatus = "Keep" | "Sell" | "Rent out" | "Redevelop";

export interface Fact {
  value: string;
  source: string;
  tag: Tag;
  assumption: string;
}

export const people = [
  {
    id: "mr",
    name: "Mr. Mehta",
    role: "Father, 62",
    wish: "Legacy",
    line: "Property is what you leave behind; gift Arjun the Worli flat.",
  },
  {
    id: "mrs",
    name: "Mrs. Mehta",
    role: "Mother, 58",
    wish: "Closeness",
    line: "Keep the family close after the wedding; happy to sell Alibaug.",
  },
  {
    id: "riya",
    name: "Riya",
    role: "Daughter, 34",
    wish: "Liquidity",
    line: "60% in property is too much; sell something rather than borrow.",
  },
  {
    id: "arjun",
    name: "Arjun",
    role: "Son, 30",
    wish: "Independence",
    line: "My own place in Worli, not chosen by my father; happy to rent.",
  },
] as const;

export type PersonId = (typeof people)[number]["id"];

export const priorityOptions = [
  "Legacy",
  "Closeness",
  "Liquidity",
  "Independence",
  "Fairness",
  "Income",
];

export const properties = [
  {
    id: "malabar",
    name: "Malabar Hill 5BHK",
    value: 47.0,
    status: "Keep" as PropStatus,
    note: "Self-occupied family home",
    tag: "Assumed" as Tag,
    source: "Anchored to MagicBricks 5BHK avg (₹45.61 Cr)",
  },
  {
    id: "worli_existing",
    name: "Worli 3BHK (1985 bldg)",
    value: 15.0,
    status: "Rent out" as PropStatus,
    note: "Tenanted, redevelopment vote pending",
    tag: "Assumed" as Tag,
    source: "Case-aligned estimate",
  },
  {
    id: "bkc",
    name: "BKC office floor",
    value: 47.0,
    status: "Rent out" as PropStatus,
    note: "10,000 sq ft leased to bank",
    tag: "Sourced" as Tag,
    source: "Rent rate Sourced (Cushman & Wakefield), area 10,000 sq ft Assumed",
  },
  {
    id: "alibaug",
    name: "Alibaug bungalow",
    value: 8.0,
    status: "Keep" as PropStatus,
    note: "Kihim villa, 4 weekends/year",
    tag: "Assumed" as Tag,
    source: "Kihim villa listings ₹6-8 Cr",
  },
  {
    id: "thane",
    name: "Thane 2BHK × 2",
    value: 3.0,
    status: "Keep" as PropStatus,
    note: "₹1.5 Cr each, delayed possession",
    tag: "Assumed" as Tag,
    source: "Current project benchmarks ₹0.87-1.73 Cr/unit",
  },
];

export const moves = [
  {
    id: "buy",
    label: "Buy & gift Worli flat",
    hint: "₹15 Cr purchase + 7% duty (₹16.05 Cr outlay)",
    category: "Real Estate",
  },
  {
    id: "rent",
    label: "Rent for Arjun (5 yrs)",
    hint: "₹0.375 Cr/yr (2.5% yield), ₹1.88 Cr total",
    category: "Housing",
  },
  {
    id: "fund",
    label: "Housing fund for Arjun",
    hint: "₹10 Cr ring-fenced capital",
    category: "Liquidity",
  },
  {
    id: "alibaug",
    label: "Sell Alibaug villa",
    hint: "Net +₹7.2 Cr after 1% brokerage & 14.95% LTCG",
    category: "Divestment",
  },
  {
    id: "bkc",
    label: "Sell BKC floor at lease end",
    hint: "Net +₹41.26 Cr after brokerage & capital gains",
    category: "Divestment",
  },
  {
    id: "equal",
    label: "Equalise for Riya",
    hint: "Match Arjun's transfer rupee-for-rupee in cash",
    category: "Fairness",
  },
  {
    id: "borrow",
    label: "Borrow any shortfall",
    hint: "Loan Against Property (LAP) @ 9.5% floating",
    category: "Financing",
  },
] as const;

export type MoveId = (typeof moves)[number]["id"];

export const presets: { id: string; name: string; moves: MoveId[]; desc: string }[] = [
  {
    id: "P0",
    name: "Do nothing",
    moves: [],
    desc: "Maintain status quo. ₹10 Cr cash spare for plant, property share at 60%.",
  },
  {
    id: "P1",
    name: "Mr. Mehta's plan",
    moves: ["buy"],
    desc: "Buy Worli flat & gift. Creates ₹6.05 Cr plant cash shortfall, property share rises to 67.9%.",
  },
  {
    id: "P2",
    name: "Buy it, fund it",
    moves: ["buy", "alibaug"],
    desc: "Sell Alibaug to fund Worli flat. Clears plant gap with ₹1.15 Cr spare, but leaves ₹15 Cr fairness gap.",
  },
  {
    id: "P3",
    name: "Fair buy",
    moves: ["buy", "alibaug", "equal"],
    desc: "Buy flat, sell Alibaug, and match ₹15 Cr cash for Riya. Creates ₹13.85 Cr shortfall for plant.",
  },
  {
    id: "P4",
    name: "Rent first",
    moves: ["rent", "alibaug"],
    desc: "Rent 5 years for Arjun & sell Alibaug. Generates ₹16.45 Cr cash spare, leaves ₹1.88 Cr fairness gap.",
  },
  {
    id: "P5",
    name: "Housing fund (Hypothesis)",
    moves: ["rent", "fund", "alibaug", "equal"],
    desc: "Rent + ₹10 Cr fund, sell Alibaug, match Riya. Perfect fairness, ₹5.42 Cr plant shortfall to bridge.",
  },
  {
    id: "P6",
    name: "Big lever (BKC exit)",
    moves: ["rent", "fund", "bkc", "equal"],
    desc: "Sell BKC at lease end. Clears all gaps with ₹28.64 Cr cash surplus, drops property share to 37.7%.",
  },
];

export interface Deadline {
  date: string;
  label: string;
  key: string;
  targetDate: string;
  flagged?: boolean;
}

export function relativeTimeline(targetDate: string, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(`${targetDate}T00:00:00`);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (days === 0) return "today";
  if (days === 1) return "in 1 day";
  if (days === -1) return "1 day ago";
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
}

export const deadlines: Deadline[] = [
  {
    date: "Sat 31 Oct 2026",
    label: "Broker price lapses (ask for extension)",
    key: "broker",
    targetDate: "2026-10-31",
  },
  {
    date: "~13 Dec 2026",
    label: "Worli society redevelopment vote (6 wks post-meeting)",
    key: "vote",
    targetDate: "2026-12-13",
    flagged: true,
  },
  {
    date: "Mar 2027",
    label: "Arjun's wedding",
    key: "wedding",
    targetDate: "2027-03-01",
  },
  {
    date: "~May 2028",
    label: "BKC lease ends",
    key: "bkc",
    targetDate: "2028-05-01",
  },
  {
    date: "~Nov 2028",
    label: "Plant cash needed (₹40 Cr capex)",
    key: "plant",
    targetDate: "2028-11-01",
  },
];

export interface DecisionQueueItem {
  id: string;
  label: string;
  date: string;
  targetDate?: string;
  owner: string;
  scenarios: string[];
  badge?: string;
}

export const decisionQueue: DecisionQueueItem[] = [
  {
    id: "worli-decision",
    label: "Sign for Worli flat or ask for extension",
    date: "Sat 31 Oct",
    targetDate: "2026-10-31",
    owner: "Anika + family",
    scenarios: ["P1", "P2", "P3"],
    badge: "decision that matters most now",
  },
  {
    id: "alibaug-sale",
    label: "Sell Alibaug",
    date: "before Dec",
    targetDate: "2026-12-01",
    owner: "Family + CA",
    scenarios: ["P2", "P3", "P4", "P5"],
  },
  {
    id: "redevelopment-vote",
    label: "Redevelopment vote",
    date: "~13 Dec",
    targetDate: "2026-12-13",
    owner: "Worli society + family",
    scenarios: ["P1", "P2", "P3"],
  },
  {
    id: "plant-funding",
    label: "Plant funding route",
    date: "~Nov 2028",
    targetDate: "2028-11-01",
    owner: "Mr. Mehta + CA",
    scenarios: ["P0", "P1", "P2", "P3", "P4", "P5", "P6"],
  },
  {
    id: "succession-fairness",
    label: "Succession and fairness",
    date: "later",
    owner: "Family + lawyer",
    scenarios: ["P3", "P5", "P6"],
  },
];

export const worliComps: {
  bldg: string;
  area: string;
  ask: number | null;
  psf: number;
  tag: string;
  note: string;
}[] = [
  {
    bldg: "Omkar 1973 3BHK",
    area: "2,000 sq ft carpet",
    ask: 15.0,
    psf: 75000,
    tag: "Sourced listing",
    note: "Asking listing, comparable grade",
  },
  {
    bldg: "Lodha Trump Tower 3BHK",
    area: "1,374 sq ft carpet",
    ask: 15.0,
    psf: 109170,
    tag: "Sourced listing",
    note: "Ultra-luxury premium tower",
  },
  {
    bldg: "Worli 3BHK Median Asking",
    area: "2,079 sq ft carpet",
    ask: null,
    psf: 72165,
    tag: "Sourced analytics",
    note: "Property Butler Oct 2026 benchmark",
  },
];

export interface Setup {
  priorities: Record<PersonId, string>;
  props: { id: string; status: PropStatus; value: number }[];
  meetingDate: string;
  plantNeed: number;
  liquid: number;
  reserve: number;
  offerPrice: number;
  negotiationPct: number;
}

export const defaultSetup: Setup = {
  priorities: {
    mr: "Legacy",
    mrs: "Closeness",
    riya: "Liquidity",
    arjun: "Independence",
  },
  props: properties.map((p) => ({ id: p.id, status: p.status, value: p.value })),
  meetingDate: "2026-11-01",
  plantNeed: 40.0,
  liquid: 80.0,
  reserve: 30.0,
  offerPrice: 15.0,
  negotiationPct: 0.0,
};

export type Result = ModelOutput;

/**
 * Pure mathematical scoring engine delegating to standalone model.ts
 */
export function compute(on: Set<MoveId>, s: Setup): Result {
  return computeModel(on, {
    liquid: s.liquid,
    reserve: s.reserve,
    plantNeed: s.plantNeed,
    offerPrice: s.offerPrice ?? 15.0,
    negotiationPct: s.negotiationPct ?? 0,
    housingFund: 10.0,
    props: s.props.map((p) => ({
      id: p.id,
      name: p.id,
      value: p.value,
      basisPct: p.id === "alibaug" ? 0.4 : p.id === "bkc" ? 0.25 : undefined,
    })),
  });
}

export type FactKey =
  | "netWorth"
  | "property"
  | "propertyShare"
  | "cashForPlant"
  | "plant"
  | "fairness"
  | "debt"
  | "tax"
  | "worli";

export const facts: Record<FactKey, Fact> = {
  netWorth: {
    value: "₹200 Cr",
    source: "Assignment brief",
    tag: "Case",
    assumption: "Excludes operating manufacturing business equity.",
  },
  property: {
    value: "₹120 Cr",
    source: "Assignment brief",
    tag: "Case",
    assumption: "Valuations reallocated across 5 holdings.",
  },
  propertyShare: {
    value: "60%",
    source: "-",
    tag: "Assumed",
    assumption: "Target 50% benchmark (Assumed with no source).",
  },
  cashForPlant: {
    value: "₹50 Cr",
    source: "Liquid assets minus ₹30 Cr reserve, after moves",
    tag: "Assumed",
    assumption: "Break-even reserve is ₹23.95 Cr if no sale is made.",
  },
  plant: {
    value: "₹40 Cr",
    source: "Assignment brief",
    tag: "Case",
    assumption: "Plant cash needed for the expansion.",
  },
  fairness: {
    value: "₹0 Cr",
    source: "Net transfer to Arjun minus cash equalised to Riya",
    tag: "Assumed",
    assumption: "Equalises wealth transfer rupee-for-rupee.",
  },
  debt: {
    value: "₹0 Cr",
    source: "-",
    tag: "Assumed",
    assumption: "9.5% floating rate (Assumed with no source).",
  },
  tax: {
    value: "14.95%",
    source: "Income-tax Act provisions (12.5% base + surcharge + cess)",
    tag: "Assumed",
    assumption: "CA to verify Section 54 reinvestment relief.",
  },
  worli: {
    value: "₹15 Cr",
    source: "Broker asking listing",
    tag: "Sourced",
    assumption: "Broker price deadline; ask for an extension.",
  },
};

export const sourcesTable = [
  {
    item: "Net worth ₹200 Cr",
    tag: "Case" as Tag,
    source: "Assignment brief",
    limit: "Operating business equity and goodwill excluded",
  },
  {
    item: "Property book ₹120 Cr",
    tag: "Case" as Tag,
    source: "Assignment brief",
    limit: "5 asset valuations (Malabar, Worli, BKC, Alibaug, Thane)",
  },
  {
    item: "Liquid assets ₹80 Cr",
    tag: "Case" as Tag,
    source: "Assignment brief",
    limit: "Liquid pool per assignment brief",
  },
  {
    item: "Worli flat target ₹15 Cr",
    tag: "Sourced" as Tag,
    source: "Broker asking listing",
    limit: "Broker price deadline; target flat area/floor missing",
  },
  {
    item: "Plant expansion ₹40 Cr",
    tag: "Case" as Tag,
    source: "Assignment brief",
    limit: "Cash needed for the plant expansion",
  },
  {
    item: "Minimum liquid reserve ₹30 Cr",
    tag: "Assumed" as Tag,
    source: "Advisor recommendation (Anika)",
    limit: "Break-even reserve is ₹23.95 Cr without selling any assets",
  },
  {
    item: "Capital gains tax (14.95%)",
    tag: "Assumed" as Tag,
    source: "Current Income-tax Act LTCG rate with surcharge cap & cess",
    limit: "Awaiting CA confirmation for Section 54 relief",
  },
  {
    item: "BKC rent rate",
    tag: "Sourced" as Tag,
    source: "Cushman & Wakefield",
    limit: "Lease end; bank tenant renewal unconfirmed",
  },
];

export const cr = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(2)} Cr`;
