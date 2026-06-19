"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/form-controls";
import { calculateQuoteSpecification } from "@/lib/calculate-quote";
import { GHANA_REGIONS } from "@/lib/regions";
import { formatCurrency } from "@/lib/utils";

export function PublicEstimator() {
  const [flockSize, setFlockSize] = useState(5000);
  const [regionId, setRegionId] = useState(GHANA_REGIONS[0].id);
  const [submitted, setSubmitted] = useState(false);
  const region = GHANA_REGIONS.find((item) => item.id === regionId) ?? GHANA_REGIONS[0];
  const estimate = useMemo(
    () => calculateQuoteSpecification({ flockSize, costTier: region.cost_tier }),
    [flockSize, region.cost_tier],
  );
  const rangeLow = estimate.costTotal * 0.9;
  const rangeHigh = estimate.costTotal * 1.1;

  return (
    <div className="rounded-lg border border-white/15 bg-[#1b2122] p-5 text-white shadow-2xl shadow-black/20 sm:p-7">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <Calculator size={22} className="text-[#e0a221]" />
        <h2 className="font-semibold">Get a rough project estimate</h2>
      </div>
      <form
        className="grid gap-5 pt-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="Planned flock size">
          <Input
            type="number"
            min={100}
            step={100}
            value={flockSize}
            onChange={(event) => {
              setFlockSize(Number(event.target.value));
              setSubmitted(false);
            }}
            className="border-white/15 bg-white/5 text-white"
          />
        </Field>
        <Field label="Project region">
          <Select
            value={regionId}
            onChange={(event) => {
              setRegionId(event.target.value);
              setSubmitted(false);
            }}
            className="border-white/15 bg-[#202728] text-white"
          >
            {GHANA_REGIONS.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </Select>
        </Field>
        <Button type="submit" size="lg">
          Calculate estimate <ArrowRight size={18} />
        </Button>
      </form>

      {submitted ? (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d9ae4b]">Estimated range</p>
          <p className="mt-2 font-mono text-2xl font-bold sm:text-3xl">
            {formatCurrency(rangeLow)} – {formatCurrency(rangeHigh)}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/65">
            This is a rough estimate based on placeholder regional pricing. Contact us for a site-specific,
            trade-by-trade quote.
          </p>
        </div>
      ) : null}
    </div>
  );
}
