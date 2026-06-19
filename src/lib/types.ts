import type { CostTier } from "@/lib/calculate-quote";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
export type ProjectStatus = "registered" | "in_progress" | "stocked" | "complete";

export type Region = {
  id: string;
  name: string;
  cost_tier: CostTier;
  created_at?: string;
  updated_at?: string;
};

export type Quote = {
  id: string;
  customer_name: string | null;
  customer_contact: string | null;
  flock_size: number;
  region_id: string;
  cost_tier_override: CostTier | null;
  land_area_sqm: number;
  building_length_m: number;
  building_width_m: number;
  building_height_m: number;
  cage_count: number;
  water_system_notes: string;
  cost_carpentry: number;
  cost_masonry: number;
  cost_electrical: number;
  cost_water_system: number;
  cost_total: number;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  regions?: Region | null;
};

export type Expense = {
  id: string;
  project_id: string;
  description: string;
  amount: number;
  category: "carpentry" | "masonry" | "electrical" | "water_system" | "other";
  date: string;
  created_at: string;
  updated_at?: string;
};

export type Payment = {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  method: "cash" | "bank_transfer" | "mobile_money" | null;
  note: string | null;
  created_at: string;
  updated_at?: string;
};

export type Project = {
  id: string;
  quote_id: string | null;
  customer_name: string;
  customer_contact: string;
  region_id: string;
  flock_size: number;
  specification_snapshot: Record<string, unknown>;
  status: ProjectStatus;
  budget_total: number;
  created_at: string;
  updated_at: string;
  regions?: Region | null;
  expenses?: Expense[];
  payments?: Payment[];
  amount_spent?: number;
  amount_received?: number;
  amount_outstanding?: number;
};
