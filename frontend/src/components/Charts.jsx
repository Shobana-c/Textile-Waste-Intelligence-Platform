import React from 'react';

export function LineTrendChart({ data = [], height = 200 }) {
  if (!data || data.length === 0) return <div className="text-slate-400 text-sm">No trend data available</div>;

  const padding = 40;
  const chartHeight = height - padding * 2;
  const chartWidth = 500; // Reference width
  const svgWidth = chartWidth + padding * 2;
  
  // Find min/max values
  const weights = data.map(d => d.weight || 0);
  const maxWeight = Math.max(...weights, 100);
  const minWeight = 0;
  
  // Convert points to SVG coordinates
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.weight - minWeight) / (maxWeight - minWeight)) * chartHeight;
    return { x, y, label: d.month, value: d.weight };
  });

  // Construct line path
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Construct fill path for the gradient area under the line
  const fillPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${svgWidth} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.0"/>
          </linearGradient>
        </defs>
        
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + chartHeight * ratio;
          const val = Math.round(maxWeight - ratio * (maxWeight - minWeight));
          return (
            <g key={i} className="opacity-20">
              <line x1={padding} y1={y} x2={padding + chartWidth} y2={y} stroke="#94a3b8" strokeDasharray="3,3" />
              <text x={padding - 10} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">{val}kg</text>
            </g>
          );
        })}

        {/* Gradient fill */}
        {fillPath && <path d={fillPath} fill="url(#chartGradient)" />}

        {/* Trend Line */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        )}

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i} className="group">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="5" 
              fill="#0f172a" 
              stroke="#f97316" 
              strokeWidth="3" 
              className="cursor-pointer hover:r-7 transition-all"
            />
            {/* Tooltip on hover */}
            <rect 
              x={p.x - 30} 
              y={p.y - 28} 
              width="60" 
              height="18" 
              rx="4" 
              fill="#1e293b" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <text 
              x={p.x} 
              y={p.y - 16} 
              fill="#f1f5f9" 
              fontSize="9" 
              fontWeight="bold"
              textAnchor="middle" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {p.value} kg
            </text>
            
            {/* X-axis labels */}
            <text x={p.x} y={padding + chartHeight + 20} fill="#94a3b8" fontSize="10" textAnchor="middle">
              {p.label.split('-')[1]}/{p.label.split('-')[0].substring(2)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function FabricBarChart({ data = [] }) {
  if (!data || data.length === 0) return <div className="text-slate-400 text-sm">No distribution data available</div>;

  const totalWeight = data.reduce((sum, d) => sum + (d.weight || 0), 0) || 1;

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = Math.round((item.weight / totalWeight) * 100);
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">{item.fabric_type}</span>
              <span className="text-slate-400">
                {item.weight} kg <span className="text-secondary-400">({percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-secondary-500 to-accent-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CircularProgress({ score = 0, size = 120, strokeWidth = 10, title = "Circularity" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return 'stroke-secondary-400';
    if (val >= 60) return 'stroke-accent-400';
    if (val >= 40) return 'stroke-yellow-500';
    return 'stroke-red-555';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-95">
          {/* Background circle */}
          <circle
            className="stroke-slate-800"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-white">{score}%</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{title}</span>
        </div>
      </div>
    </div>
  );
}
