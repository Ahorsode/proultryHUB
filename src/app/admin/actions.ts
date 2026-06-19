"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateQuoteSpecification, type CostTier } from "@/lib/calculate-quote";
import {
  addExpense,
  addPayment,
  createProjectFromQuote,
  createQuote,
  getQuote,
  updateProjectStatus,
  updateQuote,
} from "@/lib/data";
import type { Expense, Payment, ProjectStatus, QuoteStatus } from "@/lib/types";

function requiredNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value)) throw new Error(`${key} must be a number`);
  return value;
}

export async function createQuoteAction(formData: FormData) {
  const flockSize = requiredNumber(formData, "flock_size");
  const regionId = String(formData.get("region_id"));
  const regionTier = String(formData.get("region_tier")) as CostTier;
  const override = String(formData.get("cost_tier_override") || "") as CostTier | "";
  const spec = calculateQuoteSpecification({
    flockSize,
    costTier: override || regionTier,
  });

  const quote = await createQuote({
    customer_name: String(formData.get("customer_name") || "") || null,
    customer_contact: String(formData.get("customer_contact") || "") || null,
    flock_size: flockSize,
    region_id: regionId,
    cost_tier_override: override || null,
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
    status: "draft",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${quote.id}`);
}

export async function updateQuoteAction(formData: FormData) {
  const id = String(formData.get("id"));
  await updateQuote(id, {
    customer_name: String(formData.get("customer_name") || "") || null,
    customer_contact: String(formData.get("customer_contact") || "") || null,
    flock_size: requiredNumber(formData, "flock_size"),
    region_id: String(formData.get("region_id")),
    cost_tier_override:
      (String(formData.get("cost_tier_override") || "") as CostTier) || null,
    land_area_sqm: requiredNumber(formData, "land_area_sqm"),
    building_length_m: requiredNumber(formData, "building_length_m"),
    building_width_m: requiredNumber(formData, "building_width_m"),
    building_height_m: requiredNumber(formData, "building_height_m"),
    cage_count: requiredNumber(formData, "cage_count"),
    water_system_notes: String(formData.get("water_system_notes") || ""),
    cost_carpentry: requiredNumber(formData, "cost_carpentry"),
    cost_masonry: requiredNumber(formData, "cost_masonry"),
    cost_electrical: requiredNumber(formData, "cost_electrical"),
    cost_water_system: requiredNumber(formData, "cost_water_system"),
    cost_total: requiredNumber(formData, "cost_total"),
    status: String(formData.get("status")) as QuoteStatus,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
}

export async function convertQuoteToProjectAction(formData: FormData) {
  const id = String(formData.get("id"));
  const quote = await getQuote(id);
  if (!quote) throw new Error("Quote not found");
  if (quote.status !== "accepted") throw new Error("Only accepted quotes can be converted");
  const project = await createProjectFromQuote(quote);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProjectStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  await updateProjectStatus(id, String(formData.get("status")) as ProjectStatus);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
}

export async function addExpenseAction(formData: FormData) {
  const projectId = String(formData.get("project_id"));
  await addExpense({
    project_id: projectId,
    description: String(formData.get("description")),
    amount: requiredNumber(formData, "amount"),
    category: String(formData.get("category")) as Expense["category"],
    date: String(formData.get("date")),
  });
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function addPaymentAction(formData: FormData) {
  const projectId = String(formData.get("project_id"));
  await addPayment({
    project_id: projectId,
    amount: requiredNumber(formData, "amount"),
    date: String(formData.get("date")),
    method: (String(formData.get("method") || "") as Payment["method"]) || null,
    note: String(formData.get("note") || "") || null,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}
