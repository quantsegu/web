/**
 * Hosts the static planner when the SPA is served for /wealth-tools/retirement-income-planner
 * (e.g. after serve strips .html or hosting falls back to index.html).
 */
export default function RetirementPlannerFrame() {
  return (
    <iframe
      src="/wealth-tools/retirement-income-planner.html"
      title="Retirement Income Planner"
      className="fixed inset-0 w-full h-full border-0 z-40 bg-[#f4f4f2]"
      style={{ top: 0 }}
    />
  );
}
