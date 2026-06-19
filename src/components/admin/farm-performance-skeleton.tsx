export function FarmPerformanceSkeleton() {
  return (
    <div className="rounded-lg border border-blue-200 bg-[#f4f8fb] p-5">
      <div className="h-5 w-52 animate-pulse rounded bg-blue-100" />
      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded bg-blue-100/70" />
        ))}
      </div>
    </div>
  );
}
