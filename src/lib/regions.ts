import type { CostTier } from "@/lib/calculate-quote";

export type RegionSeed = {
  id: string;
  name: string;
  cost_tier: CostTier;
};

// Placeholder tier assignments pending client confirmation.
export const GHANA_REGIONS: RegionSeed[] = [
  { id: "11111111-1111-4111-8111-111111111111", name: "Greater Accra", cost_tier: "high" },
  { id: "22222222-2222-4222-8222-222222222222", name: "Ashanti", cost_tier: "high" },
  { id: "33333333-3333-4333-8333-333333333333", name: "Central", cost_tier: "medium" },
  { id: "44444444-4444-4444-8444-444444444444", name: "Eastern", cost_tier: "medium" },
  { id: "55555555-5555-4555-8555-555555555555", name: "Western", cost_tier: "medium" },
  { id: "66666666-6666-4666-8666-666666666666", name: "Western North", cost_tier: "medium" },
  { id: "77777777-7777-4777-8777-777777777777", name: "Volta", cost_tier: "medium" },
  { id: "88888888-8888-4888-8888-888888888888", name: "Oti", cost_tier: "low" },
  { id: "99999999-9999-4999-8999-999999999999", name: "Bono", cost_tier: "medium" },
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", name: "Bono East", cost_tier: "medium" },
  { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", name: "Ahafo", cost_tier: "medium" },
  { id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", name: "Northern", cost_tier: "low" },
  { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", name: "Savannah", cost_tier: "low" },
  { id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", name: "North East", cost_tier: "low" },
  { id: "ffffffff-ffff-4fff-8fff-ffffffffffff", name: "Upper East", cost_tier: "low" },
  { id: "12121212-1212-4212-8212-121212121212", name: "Upper West", cost_tier: "low" },
];
