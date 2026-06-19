"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle, FloppyDisk } from "@phosphor-icons/react";
import {
  convertQuoteToProjectAction,
  updateQuoteAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { calculateQuoteSpecification, type CostTier } from "@/lib/calculate-quote";
import type { Quote, Region } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type EditableValues = {
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
};

export function QuoteEditor({ quote, regions }: { quote: Quote; regions: Region[] }) {
  const [flockSize, setFlockSize] = useState(quote.flock_size);
  const [regionId, setRegionId] = useState(quote.region_id);
  const [override, setOverride] = useState<CostTier | "">(quote.cost_tier_override ?? "");
  const [status, setStatus] = useState(quote.status);
  const [values, setValues] = useState<EditableValues>({
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
  });
  const region = useMemo(() => regions.find((item) => item.id === regionId), [regions, regionId]);

  function updateNumber(key: keyof EditableValues, value: string) {
    setValues((current) => ({ ...current, [key]: Number(value) }));
  }

  function recalculate() {
    if (!window.confirm("Recalculate and replace all generated specification and cost fields?")) return;
    const spec = calculateQuoteSpecification({
      flockSize,
      costTier: override || region?.cost_tier || "medium",
    });
    setValues({
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
    });
  }

  return (
    <div className="grid gap-4">
      <form action={updateQuoteAction} className="grid gap-4">
        <input type="hidden" name="id" value={quote.id} />
        <Card>
          <CardHeader className="flex-row items-center justify-between border-b">
            <div>
              <CardTitle>Customer &amp; quote basis</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Every generated value below remains editable.</p>
            </div>
            <StatusBadgeSelect value={status} onChange={setStatus} />
          </CardHeader>
          <CardContent className="grid gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Customer name">
              <Input name="customer_name" defaultValue={quote.customer_name ?? ""} />
            </Field>
            <Field label="Customer contact">
              <Input name="customer_contact" defaultValue={quote.customer_contact ?? ""} />
            </Field>
            <Field label="Flock size">
              <Input
                name="flock_size"
                type="number"
                value={flockSize}
                onChange={(event) => setFlockSize(Number(event.target.value))}
              />
            </Field>
            <Field label="Region">
              <Select name="region_id" value={regionId} onChange={(event) => setRegionId(event.target.value)}>
                {regions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Cost tier override" hint={`Regional default: ${region?.cost_tier ?? "medium"}`}>
              <Select
                name="cost_tier_override"
                value={override}
                onChange={(event) => setOverride(event.target.value as CostTier | "")}
              >
                <option value="">Use regional default</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </Field>
            <input type="hidden" name="status" value={status} />
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader className="border-b"><CardTitle>Facility specification</CardTitle></CardHeader>
            <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
              <NumberField label="Land area (m²)" name="land_area_sqm" value={values.land_area_sqm} onChange={(v) => updateNumber("land_area_sqm", v)} />
              <NumberField label="Building length (m)" name="building_length_m" value={values.building_length_m} onChange={(v) => updateNumber("building_length_m", v)} />
              <NumberField label="Building width (m)" name="building_width_m" value={values.building_width_m} onChange={(v) => updateNumber("building_width_m", v)} />
              <NumberField label="Building height (m)" name="building_height_m" value={values.building_height_m} onChange={(v) => updateNumber("building_height_m", v)} />
              <NumberField label="Cage count" name="cage_count" value={values.cage_count} onChange={(v) => updateNumber("cage_count", v)} />
              <Field label="Water system notes" className="sm:col-span-2">
                <Textarea
                  name="water_system_notes"
                  value={values.water_system_notes}
                  onChange={(event) => setValues((current) => ({ ...current, water_system_notes: event.target.value }))}
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Cost breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
              <NumberField label="Carpentry (GHS)" name="cost_carpentry" value={values.cost_carpentry} onChange={(v) => updateNumber("cost_carpentry", v)} />
              <NumberField label="Masonry (GHS)" name="cost_masonry" value={values.cost_masonry} onChange={(v) => updateNumber("cost_masonry", v)} />
              <NumberField label="Electrical (GHS)" name="cost_electrical" value={values.cost_electrical} onChange={(v) => updateNumber("cost_electrical", v)} />
              <NumberField label="Water system (GHS)" name="cost_water_system" value={values.cost_water_system} onChange={(v) => updateNumber("cost_water_system", v)} />
              <Field label="Total quote (GHS)" className="sm:col-span-2">
                <Input
                  name="cost_total"
                  type="number"
                  value={values.cost_total}
                  onChange={(event) => updateNumber("cost_total", event.target.value)}
                  className="h-14 font-mono text-xl font-bold"
                />
                <p className="text-xs text-muted-foreground">Current formatted total: {formatCurrency(values.cost_total)}</p>
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={recalculate}>
            <Calculator size={18} /> Recalculate
          </Button>
          <Button type="submit">
            <FloppyDisk size={18} weight="bold" /> Save changes
          </Button>
        </div>
      </form>

      <Card className={status === "accepted" ? "border-green-300 bg-green-50/40" : ""}>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Project conversion</p>
            <p className="text-sm text-muted-foreground">
              Accept the quote first, then create an immutable project specification snapshot.
            </p>
          </div>
          <form action={convertQuoteToProjectAction}>
            <input type="hidden" name="id" value={quote.id} />
            <Button type="submit" disabled={status !== "accepted"}>
              <CheckCircle size={18} weight="fill" /> Convert to Project
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function NumberField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <Input name={name} type="number" step="0.1" min="0" value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

function StatusBadgeSelect({
  value,
  onChange,
}: {
  value: Quote["status"];
  onChange: (value: Quote["status"]) => void;
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value as Quote["status"])} className="w-36">
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="accepted">Accepted</option>
      <option value="declined">Declined</option>
    </Select>
  );
}
