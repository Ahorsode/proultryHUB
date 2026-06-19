"use client";

import { useState } from "react";
import { createQuoteAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import type { Region } from "@/lib/types";

export function NewQuoteForm({ regions }: { regions: Region[] }) {
  const [regionId, setRegionId] = useState(regions[0]?.id ?? "");
  const activeRegion = regions.find((region) => region.id === regionId);

  return (
    <form action={createQuoteAction} className="grid gap-5">
      <input type="hidden" name="region_tier" value={activeRegion?.cost_tier ?? "medium"} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Customer name" hint="Optional for early-stage estimates">
          <Input name="customer_name" placeholder="e.g. Adom Poultry Farms" />
        </Field>
        <Field label="Customer contact">
          <Input name="customer_contact" placeholder="+233..." />
        </Field>
        <Field label="Flock size">
          <Input name="flock_size" type="number" min={100} step={100} defaultValue={5000} required />
        </Field>
        <Field label="Region">
          <Select name="region_id" value={regionId} onChange={(event) => setRegionId(event.target.value)}>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Cost tier override" hint={`Regional default: ${activeRegion?.cost_tier ?? "medium"}`}>
          <Select name="cost_tier_override" defaultValue="">
            <option value="">Use regional default</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Generate draft quote</Button>
      </div>
    </form>
  );
}
