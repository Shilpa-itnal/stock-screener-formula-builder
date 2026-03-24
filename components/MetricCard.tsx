export default function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card">
      <div className="small">{label}</div>
      <div className="metric-value">{value}</div>
      {hint ? <div className="small">{hint}</div> : null}
    </div>
  );
}
