import { useMemo } from 'react';
import type { ExpenseSlice } from '@/types';

interface DonutChartProps {
  slices: ExpenseSlice[];
  size?: number;
  thickness?: number;
}

export function DonutChart({ slices, size = 160, thickness = 22 }: DonutChartProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    let offset = 0;
    return slices.map((slice) => {
      const fraction = slice.value / total;
      const length = fraction * circumference;
      const seg = {
        ...slice,
        dashArray: `${length} ${circumference - length}`,
        dashOffset: -offset,
      };
      offset += length;
      return seg;
    });
  }, [slices, circumference, total]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.1)"
          strokeWidth={thickness}
        />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${seg.color}55)` }}
          />
        ))}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-wider text-slate-400">
          Aylık
        </span>
        <span className="text-lg font-bold text-white">₺{total.toLocaleString('tr-TR')}</span>
      </div>
    </div>
  );
}
