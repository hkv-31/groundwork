/**
 * Pure mathematical scoring engine for Groundwork.
 * Implements formulas directly from Section 7 & 8 of "The Sunday Table: Final Plan, Formulas and Build Spec".
 * Zero external dependencies.
 */

export type MoveId = "buy" | "rent" | "fund" | "alibaug" | "bkc" | "equal" | "borrow";
export type Status = "Met" | "Partly" | "Not met";
export type PersonId = "mr" | "mrs" | "riya" | "arjun";

export interface PropertyInput {
  id: string;
  name: string;
  value: number; // in ₹ Cr
  basisPct?: number; // 0.4 for Alibaug, 0.25 for BKC
}

export interface ModelSetup {
  liquid: number; // ₹ Cr (default: 80)
  reserve: number; // ₹ Cr (default: 30)
  plantNeed: number; // ₹ Cr (default: 40)
  offerPrice: number; // ₹ Cr (default: 15)
  negotiationPct: number; // default 0%
  housingFund: number; // ₹ Cr (default: 10)
  props: PropertyInput[];
}

export interface ModelOutput {
  propertyTotal: number;
  liquidTotal: number;
  netWorth: number;
  propertyShare: number; // percentage rounded to 1 decimal
  targetShare: number;
  cashForPlant: number; // ₹ Cr rounded to 2 decimals
  plantNeed: number;
  plantGap: number; // ₹ Cr (+ = shortfall, - = spare)
  debt: number;
  transferArjun: number;
  equaliseRiya: number;
  fairnessGap: number; // ₹ Cr
  status: Record<PersonId, Status>;
  deadlines: Record<string, Status>;
}

export const defaultModelSetup: ModelSetup = {
  liquid: 80.0,
  reserve: 30.0,
  plantNeed: 40.0,
  offerPrice: 15.0,
  negotiationPct: 0,
  housingFund: 10.0,
  props: [
    { id: "malabar", name: "Malabar Hill 5BHK", value: 47.0 },
    { id: "worli", name: "Worli 3BHK", value: 15.0 },
    { id: "bkc", name: "BKC office floor", value: 47.0, basisPct: 0.25 },
    { id: "alibaug", name: "Alibaug bungalow", value: 8.0, basisPct: 0.4 },
    { id: "thane", name: "Thane 2BHK × 2", value: 3.0 },
  ],
};

/**
 * Computes exact outputs for any set of active moves and setup parameters.
 */
export function computeModel(moves: Set<MoveId> | MoveId[], setup: ModelSetup = defaultModelSetup): ModelOutput {
  const on = moves instanceof Set ? moves : new Set(moves);

  const offer = setup.offerPrice;
  const negPct = setup.negotiationPct;
  const price = offer * (1 - negPct / 100);

  // M1: Outlay with 7% stamp duty and registration
  const purchaseCostPct = 0.07;
  const outlay = on.has("buy") ? price * (1 + purchaseCostPct) : 0; // ₹16.05 Cr at ₹15 Cr offer

  // M2: Rent for 5 yrs, 24-month cash impact
  const rentYear = 0.025 * offer; // 2.5% of offer (₹0.375 Cr/yr)
  const rent24 = on.has("rent") ? rentYear * 2 : 0; // 2 yrs before plant need (₹0.75 Cr)
  const rent5 = on.has("rent") ? rentYear * 5 : 0; // 5 yrs total (₹1.875 Cr)

  // M3: Housing fund
  const fund = on.has("fund") ? setup.housingFund : 0;

  // Divestment proceeds after 1% brokerage and 14.95% effective LTCG
  // Effective LTCG = 12.5% base * 1.15 surcharge cap * 1.04 cess = 14.95%
  const ltcgEff = 0.125 * 1.15 * 1.04; // 0.1495

  // Alibaug: value 8.0, cost basis 40% -> gain 4.8 Cr -> LTCG tax 0.7176 Cr, brokerage 0.08 Cr -> net 7.2024 Cr
  const alibaugVal = setup.props.find((p) => p.id === "alibaug")?.value ?? 8.0;
  const alibaugTax = alibaugVal * (1 - 0.4) * ltcgEff;
  const alibaugNet = alibaugVal - alibaugVal * 0.01 - alibaugTax;

  // BKC: value 47.0, cost basis 25% -> gain 35.25 Cr -> LTCG tax 5.269875 Cr, brokerage 0.47 Cr -> net 41.260125 Cr
  const bkcVal = setup.props.find((p) => p.id === "bkc")?.value ?? 47.0;
  const bkcTax = bkcVal * (1 - 0.25) * ltcgEff;
  const bkcNet = bkcVal - bkcVal * 0.01 - bkcTax;

  const proceeds = (on.has("alibaug") ? alibaugNet : 0) + (on.has("bkc") ? bkcNet : 0);

  // Arjun transfers & Fairness equalisation
  const transferArjun = (on.has("buy") ? price : 0) + rent5 + fund;
  const equalise = on.has("equal") ? transferArjun : 0;
  const fairnessGap = Math.abs(transferArjun - equalise);

  // Cash for plant = liquid + proceeds - reserve - outlay - rent24 - fund - equalise
  let rawCashForPlant = setup.liquid + proceeds - setup.reserve - outlay - rent24 - fund - equalise;
  let plantGap = setup.plantNeed - rawCashForPlant; // positive = shortfall

  // M7: Borrow any shortfall via Loan Against Property (LAP)
  let debt = 0;
  if (on.has("borrow") && plantGap > 0) {
    debt = plantGap;
    rawCashForPlant += debt;
    plantGap = 0;
  }

  // Property value after sales and acquisition
  let propVal = setup.props.reduce((sum, p) => sum + p.value, 0);
  if (on.has("alibaug")) propVal -= alibaugVal;
  if (on.has("bkc")) propVal -= bkcVal;
  if (on.has("buy")) propVal += price;

  const leakage =
    (on.has("buy") ? price * purchaseCostPct : 0) +
    (on.has("alibaug") ? alibaugVal * 0.01 + alibaugTax : 0) +
    (on.has("bkc") ? bkcVal * 0.01 + bkcTax : 0) +
    rent24;

  const wealthAfter = 200 - leakage;
  const propShare = Math.round((propVal / wealthAfter) * 1000) / 10; // 1 decimal place

  // Goal tick rules from Section 9
  const m1 = on.has("buy");
  const m2 = on.has("rent");
  const m3 = on.has("fund");
  const m4 = on.has("alibaug");

  const mrStatus: Status = m1 ? "Met" : m3 ? "Partly" : "Not met";
  const arjunHoused = m1 || m2;
  const mrsStatus: Status = m4 && arjunHoused ? "Met" : m4 || arjunHoused ? "Partly" : "Not met";
  const riyaStatus: Status =
    plantGap <= 0.01 && propShare <= 55
      ? "Met"
      : plantGap <= 0.01 || propShare <= 60
      ? "Partly"
      : "Not met";
  const arjunStatus: Status = m2 ? "Met" : m1 || m3 ? "Partly" : "Not met";

  const plantDeadlineStatus: Status =
    rawCashForPlant >= setup.plantNeed
      ? "Met"
      : rawCashForPlant >= setup.plantNeed * 0.8
      ? "Partly"
      : "Not met";

  return {
    propertyTotal: Math.round(propVal * 10) / 10,
    liquidTotal: Math.round((setup.liquid + proceeds - outlay - rent24 - fund - equalise + debt) * 10) / 10,
    netWorth: Math.round(wealthAfter * 10) / 10,
    propertyShare: propShare,
    targetShare: 50,
    cashForPlant: Math.round(rawCashForPlant * 100) / 100,
    plantNeed: setup.plantNeed,
    plantGap: Math.round(plantGap * 100) / 100,
    debt: Math.round(debt * 10) / 10,
    transferArjun: Math.round(transferArjun * 100) / 100,
    equaliseRiya: Math.round(equalise * 100) / 100,
    fairnessGap: Math.round(fairnessGap * 100) / 100,
    status: {
      mr: mrStatus,
      mrs: mrsStatus,
      riya: riyaStatus,
      arjun: arjunStatus,
    },
    deadlines: {
      worli: m1 ? "Met" : m2 || m3 ? "Partly" : "Not met",
      bkc: on.has("bkc") ? "Met" : "Partly",
      plant: plantDeadlineStatus,
    },
  };
}
