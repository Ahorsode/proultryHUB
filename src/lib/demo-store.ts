import { calculateQuoteSpecification } from "@/lib/calculate-quote";
import { GHANA_REGIONS } from "@/lib/regions";
import type { Expense, Payment, Project, Quote } from "@/lib/types";

type DemoStore = {
  quotes: Quote[];
  projects: Project[];
  expenses: Expense[];
  payments: Payment[];
};

const now = new Date("2026-06-19T09:00:00.000Z");
const isoDaysAgo = (days: number) =>
  new Date(now.getTime() - days * 86_400_000).toISOString();

function makeQuote(
  id: string,
  customer: string,
  regionIndex: number,
  flockSize: number,
  status: Quote["status"],
  daysAgo: number,
): Quote {
  const region = GHANA_REGIONS[regionIndex];
  const spec = calculateQuoteSpecification({
    flockSize,
    costTier: region.cost_tier,
  });
  return {
    id,
    customer_name: customer,
    customer_contact: "+233 24 000 0000",
    flock_size: flockSize,
    region_id: region.id,
    cost_tier_override: null,
    land_area_sqm: spec.landAreaSqm,
    building_length_m: spec.buildingLengthM,
    building_width_m: spec.buildingWidthM,
    building_height_m: spec.buildingHeightM,
    cage_count: spec.cageCount,
    water_system_notes: spec.waterSystemNotes,
    cost_carpentry: spec.costCarpentry,
    cost_masonry: spec.costMasonry,
    cost_electrical: spec.costElectrical,
    cost_water_system: spec.costWaterSystem,
    cost_total: spec.costTotal,
    status,
    created_at: isoDaysAgo(daysAgo),
    updated_at: isoDaysAgo(Math.max(0, daysAgo - 1)),
    regions: region,
  };
}

function initialStore(): DemoStore {
  const quotes = [
    makeQuote("0276a4b0-6ef5-4ce7-873a-000000000001", "Kwaku Baffour", 1, 10000, "sent", 2),
    makeQuote("0275a4b0-6ef5-4ce7-873a-000000000002", "Akosua Adventures", 0, 5000, "sent", 3),
    makeQuote("0274a4b0-6ef5-4ce7-873a-000000000003", "Danquah Farms", 1, 20000, "draft", 5),
    makeQuote("0273a4b0-6ef5-4ce7-873a-000000000004", "Mensah Farms", 2, 15000, "accepted", 8),
    makeQuote("0272a4b0-6ef5-4ce7-873a-000000000005", "Sarpong Poultry", 9, 8000, "draft", 12),
    makeQuote("0271a4b0-6ef5-4ce7-873a-000000000006", "Nyarko & Sons", 9, 12000, "declined", 18),
  ];

  const projects: Project[] = [
    {
      id: "2580a4b0-6ef5-4ce7-873a-000000000001",
      quote_id: quotes[3].id,
      customer_name: "Kofi Farms Ltd",
      customer_contact: "+233 24 781 4490",
      region_id: GHANA_REGIONS[1].id,
      flock_size: 20000,
      specification_snapshot: { houseCount: 4, cageCount: 223 },
      status: "in_progress",
      budget_total: 1170000,
      created_at: isoDaysAgo(70),
      updated_at: isoDaysAgo(1),
      regions: GHANA_REGIONS[1],
    },
    {
      id: "2510a4b0-6ef5-4ce7-873a-000000000002",
      quote_id: null,
      customer_name: "Yeboah Poultry",
      customer_contact: "+233 55 222 9910",
      region_id: GHANA_REGIONS[0].id,
      flock_size: 15000,
      specification_snapshot: { houseCount: 3, cageCount: 167 },
      status: "in_progress",
      budget_total: 877500,
      created_at: isoDaysAgo(49),
      updated_at: isoDaysAgo(3),
      regions: GHANA_REGIONS[0],
    },
    {
      id: "2470a4b0-6ef5-4ce7-873a-000000000003",
      quote_id: quotes[3].id,
      customer_name: "Mensah Farms",
      customer_contact: "+233 20 488 2020",
      region_id: GHANA_REGIONS[2].id,
      flock_size: 10000,
      specification_snapshot: { houseCount: 2, cageCount: 112 },
      status: "in_progress",
      budget_total: 450000,
      created_at: isoDaysAgo(37),
      updated_at: isoDaysAgo(2),
      regions: GHANA_REGIONS[2],
    },
    {
      id: "2420a4b0-6ef5-4ce7-873a-000000000004",
      quote_id: null,
      customer_name: "Nyarko & Sons",
      customer_contact: "+233 24 912 6621",
      region_id: GHANA_REGIONS[9].id,
      flock_size: 30000,
      specification_snapshot: { houseCount: 6, cageCount: 334 },
      status: "registered",
      budget_total: 1350000,
      created_at: isoDaysAgo(22),
      updated_at: isoDaysAgo(4),
      regions: GHANA_REGIONS[9],
    },
    {
      id: "2390a4b0-6ef5-4ce7-873a-000000000005",
      quote_id: null,
      customer_name: "Abena Farms",
      customer_contact: "+233 50 670 1882",
      region_id: GHANA_REGIONS[6].id,
      flock_size: 5000,
      specification_snapshot: { houseCount: 1, cageCount: 56 },
      status: "stocked",
      budget_total: 225000,
      created_at: isoDaysAgo(120),
      updated_at: isoDaysAgo(1),
      regions: GHANA_REGIONS[6],
    },
    {
      id: "2310a4b0-6ef5-4ce7-873a-000000000006",
      quote_id: null,
      customer_name: "Adom Layers",
      customer_contact: "+233 27 149 3901",
      region_id: GHANA_REGIONS[3].id,
      flock_size: 7000,
      specification_snapshot: { houseCount: 2, cageCount: 78 },
      status: "complete",
      budget_total: 315000,
      created_at: isoDaysAgo(210),
      updated_at: isoDaysAgo(14),
      regions: GHANA_REGIONS[3],
    },
  ];

  const expenses: Expense[] = [
    ["e1", projects[0].id, "Structural timber and roofing", 312000, "carpentry", "2026-04-22"],
    ["e2", projects[0].id, "Blockwork and foundation labor", 283000, "masonry", "2026-05-09"],
    ["e3", projects[1].id, "Foundation works", 205000, "masonry", "2026-05-18"],
    ["e4", projects[1].id, "Roof framing deposit", 205350, "carpentry", "2026-06-02"],
    ["e5", projects[2].id, "Site preparation", 118000, "masonry", "2026-05-27"],
    ["e6", projects[2].id, "Water tank and pipework", 127600, "water_system", "2026-06-12"],
    ["e7", projects[4].id, "Final electrical installation", 47800, "electrical", "2026-03-28"],
    ["e8", projects[4].id, "Construction and stocking closeout", 140700, "other", "2026-04-04"],
  ].map(([id, project_id, description, amount, category, date]) => ({
    id: String(id),
    project_id: String(project_id),
    description: String(description),
    amount: Number(amount),
    category: category as Expense["category"],
    date: String(date),
    created_at: `${date}T08:00:00.000Z`,
  }));

  const payments: Payment[] = [
    ["p1", projects[0].id, 450000, "2026-04-18", "bank_transfer", "Mobilisation"],
    ["p2", projects[0].id, 250000, "2026-05-30", "mobile_money", "Second tranche"],
    ["p3", projects[1].id, 410000, "2026-05-12", "bank_transfer", "Mobilisation"],
    ["p4", projects[2].id, 225000, "2026-05-21", "cash", "Half payment"],
    ["p5", projects[4].id, 200000, "2026-02-05", "bank_transfer", "Construction payment"],
    ["p6", projects[5].id, 315000, "2025-12-10", "bank_transfer", "Paid in full"],
  ].map(([id, project_id, amount, date, method, note]) => ({
    id: String(id),
    project_id: String(project_id),
    amount: Number(amount),
    date: String(date),
    method: method as Payment["method"],
    note: String(note),
    created_at: `${date}T08:00:00.000Z`,
  }));

  return { quotes, projects, expenses, payments };
}

const globalStore = globalThis as typeof globalThis & { __pfcmpDemoStore?: DemoStore };

export function getDemoStore() {
  if (!globalStore.__pfcmpDemoStore) {
    globalStore.__pfcmpDemoStore = initialStore();
  }
  return globalStore.__pfcmpDemoStore;
}
