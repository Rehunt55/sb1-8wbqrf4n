interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  accent?: 'violet' | 'emerald' | 'cyan';
}

const accentGradients: Record<string, string> = {
  violet: 'from-violet-400 to-violet-600',
  emerald: 'from-emerald-400 to-emerald-600',
  cyan: 'from-cyan-400 to-cyan-600',
};

export function BarChart({ data, height = 120, accent = 'violet' }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const gradient = accentGradients[accent];

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d) => {
        const pct = Math.max(8, (d.value / max) * 100);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md bg-gradient-to-t ${gradient} transition-all duration-500`}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
