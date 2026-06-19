import "server-only";
import { getDemoStore } from "@/lib/demo-store";
import { GHANA_REGIONS } from "@/lib/regions";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import type { Expense, Payment, Project, ProjectStatus, Quote, QuoteStatus, Region } from "@/lib/types";

function enrichProject(project: Project, expenses: Expense[], payments: Payment[]) {
  const projectExpenses = expenses.filter((item) => item.project_id === project.id);
  const projectPayments = payments.filter((item) => item.project_id === project.id);
  const amountSpent = projectExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const amountReceived = projectPayments.reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    ...project,
    expenses: projectExpenses.sort((a, b) => b.date.localeCompare(a.date)),
    payments: projectPayments.sort((a, b) => b.date.localeCompare(a.date)),
    amount_spent: amountSpent,
    amount_received: amountReceived,
    amount_outstanding: Math.max(0, Number(project.budget_total) - amountReceived),
  };
}

export async function getRegions(): Promise<Region[]> {
  if (!isSupabaseConfigured()) return GHANA_REGIONS;
  const { data, error } = await getSupabaseAdmin().from("regions").select("*").order("name");
  if (error) throw error;
  return data as Region[];
}

export async function getQuotes(): Promise<Quote[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoStore().quotes].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const { data, error } = await getSupabaseAdmin()
    .from("quotes")
    .select("*, regions(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Quote[];
}

export async function getQuote(id: string): Promise<Quote | null> {
  if (!isSupabaseConfigured()) {
    return getDemoStore().quotes.find((quote) => quote.id === id) ?? null;
  }
  const { data, error } = await getSupabaseAdmin()
    .from("quotes")
    .select("*, regions(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Quote | null;
}

export async function createQuote(input: Omit<Quote, "id" | "created_at" | "updated_at" | "regions">) {
  if (!isSupabaseConfigured()) {
    const region = GHANA_REGIONS.find((item) => item.id === input.region_id) ?? null;
    const quote: Quote = {
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      regions: region,
    };
    getDemoStore().quotes.unshift(quote);
    return quote;
  }
  const { data, error } = await getSupabaseAdmin().from("quotes").insert(input).select().single();
  if (error) throw error;
  return data as Quote;
}

export async function updateQuote(id: string, input: Partial<Quote>) {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const index = store.quotes.findIndex((quote) => quote.id === id);
    if (index < 0) throw new Error("Quote not found");
    store.quotes[index] = {
      ...store.quotes[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return store.quotes[index];
  }
  const payload = { ...input, regions: undefined };
  const { data, error } = await getSupabaseAdmin()
    .from("quotes")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Quote;
}

export async function getProjects(status?: ProjectStatus): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    return store.projects
      .filter((project) => !status || project.status === status)
      .map((project) => enrichProject(project, store.expenses, store.payments))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  let query = getSupabaseAdmin()
    .from("projects")
    .select("*, regions(*), expenses(*), payments(*)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data as Project[]).map((project) =>
    enrichProject(project, project.expenses ?? [], project.payments ?? []),
  );
}

export async function getProject(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const project = store.projects.find((item) => item.id === id);
    return project ? enrichProject(project, store.expenses, store.payments) : null;
  }
  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .select("*, regions(*), expenses(*), payments(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const project = data as Project;
  return enrichProject(project, project.expenses ?? [], project.payments ?? []);
}

export async function createProjectFromQuote(quote: Quote) {
  const payload = {
    quote_id: quote.id,
    customer_name: quote.customer_name || "Unnamed customer",
    customer_contact: quote.customer_contact || "",
    region_id: quote.region_id,
    flock_size: quote.flock_size,
    specification_snapshot: {
      land_area_sqm: quote.land_area_sqm,
      building_length_m: quote.building_length_m,
      building_width_m: quote.building_width_m,
      building_height_m: quote.building_height_m,
      cage_count: quote.cage_count,
      water_system_notes: quote.water_system_notes,
      cost_carpentry: quote.cost_carpentry,
      cost_masonry: quote.cost_masonry,
      cost_electrical: quote.cost_electrical,
      cost_water_system: quote.cost_water_system,
      cost_total: quote.cost_total,
    },
    status: "registered" as const,
    budget_total: quote.cost_total,
  };

  if (!isSupabaseConfigured()) {
    const project: Project = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      regions: quote.regions,
    };
    getDemoStore().projects.unshift(project);
    return project;
  }
  const { data, error } = await getSupabaseAdmin().from("projects").insert(payload).select().single();
  if (error) throw error;
  return data as Project;
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  if (!isSupabaseConfigured()) {
    const project = getDemoStore().projects.find((item) => item.id === id);
    if (!project) throw new Error("Project not found");
    project.status = status;
    project.updated_at = new Date().toISOString();
    return;
  }
  const { error } = await getSupabaseAdmin().from("projects").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function addExpense(input: Omit<Expense, "id" | "created_at" | "updated_at">) {
  if (!isSupabaseConfigured()) {
    getDemoStore().expenses.unshift({
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
    return;
  }
  const { error } = await getSupabaseAdmin().from("expenses").insert(input);
  if (error) throw error;
}

export async function addPayment(input: Omit<Payment, "id" | "created_at" | "updated_at">) {
  if (!isSupabaseConfigured()) {
    getDemoStore().payments.unshift({
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    });
    return;
  }
  const { error } = await getSupabaseAdmin().from("payments").insert(input);
  if (error) throw error;
}

export async function getDashboardData() {
  const [quotes, projects] = await Promise.all([getQuotes(), getProjects()]);
  const statusCounts = projects.reduce(
    (counts, project) => {
      counts[project.status] += 1;
      return counts;
    },
    { registered: 0, in_progress: 0, stocked: 0, complete: 0 },
  );
  return {
    quotes,
    projects,
    recentQuotes: quotes.slice(0, 5),
    recentProjects: projects.slice(0, 5),
    activeProjects: projects.filter((project) => project.status !== "complete").length,
    outstanding: projects.reduce((sum, project) => sum + Number(project.amount_outstanding ?? 0), 0),
    statusCounts,
  };
}

export type { QuoteStatus };
