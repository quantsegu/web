interface ProgressBarProps {
  done: number;
  total: number;
  percent: number;
  label?: string;
}

export default function ProgressBar({ done, total, percent, label }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{label}</span>
          <span className="font-medium text-slate-800">
            {done}/{total} ({percent}%)
          </span>
        </div>
      )}
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
