export type FarmPerformanceSummary = {
  currentBirdCount: number;
  stockedBirdCount: number;
  mortalityRate: number;
  eggProduction?: number;
  lastUpdated: string;
};

function mockSummary(customerId: string): FarmPerformanceSummary | null {
  if (!customerId || customerId.toLowerCase().includes("pending")) {
    return null;
  }

  const seed = customerId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const stockedBirdCount = 5000 + (seed % 8) * 1000;
  const mortalityRate = Number((1.4 + (seed % 18) / 10).toFixed(1));

  return {
    stockedBirdCount,
    currentBirdCount: Math.round(stockedBirdCount * (1 - mortalityRate / 100)),
    mortalityRate,
    eggProduction: seed % 2 === 0 ? Math.round(stockedBirdCount * 0.76) : undefined,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getFarmPerformanceSummary(
  customerId: string,
): Promise<FarmPerformanceSummary | null> {
  const apiUrl = process.env.EXISTING_PLATFORM_API_URL;
  const apiKey = process.env.EXISTING_PLATFORM_API_KEY;

  // TODO: replace customer_name matching with a stable external customer ID
  // once the client confirms the cross-system identifier.
  // TODO: replace with real endpoint once client provides existing-platform credentials.
  if (!apiUrl || !apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return mockSummary(customerId);
  }

  try {
    const url = new URL(apiUrl);
    url.searchParams.set("customer_id", customerId);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`External farm API returned ${response.status}`);
    return (await response.json()) as FarmPerformanceSummary;
  } catch (error) {
    console.error("Unable to load external farm performance data", error);
    return null;
  }
}
