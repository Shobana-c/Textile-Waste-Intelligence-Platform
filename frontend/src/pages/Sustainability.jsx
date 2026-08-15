import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Leaf, 
  Trash2, 
  Droplet, 
  Activity, 
  Layers, 
  Heart,
  TrendingUp,
  Globe,
  Cpu,
  RefreshCw
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { CircularProgress } from '../components/Charts';

export default function Sustainability() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const lifecycleSteps = [
    { icon: Layers, title: "Intake & Cataloging", desc: "Post-consumer and industrial fabric scraps registered in the central repository." },
    { icon: Cpu, title: "Intelligent AI Scan", desc: "OpenCV edge density and contrast mapping predict raw fabric compositions." },
    { icon: Leaf, title: "Sustainability Audit", desc: "CO2 and water preservation indices calculated per kg of fabric." },
    { icon: RefreshCw, title: "Circular Recommendations", desc: "AI routing engine maps batch into 6 circular waste streams." },
    { icon: Globe, title: "B2B Sourcing Match", desc: "Fiber requisitions are automatically matched with active supplier inventory." }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load sustainability metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary } = stats || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Sustainability & ESG Analytics</h2>
        <p className="text-xs text-slate-400">Environmental footprint offset calculation and circularity metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Carbon Reductions</span>
              <h3 className="text-2xl font-black text-white mt-1">{summary?.total_co2_savings || 0} kg CO₂</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Leaf size={20} />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Equivalent to planting <strong className="text-emerald-400 font-bold">{Math.round((summary?.total_co2_savings || 0) / 22)} trees</strong> or removing emissions from <strong className="text-emerald-400 font-bold">{Math.round((summary?.total_co2_savings || 0) / 4.6)} cars</strong> for one day.
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Water Preserved</span>
              <h3 className="text-2xl font-black text-white mt-1">{summary?.total_water_savings || 0} L</h3>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Droplet size={20} />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Equivalent to the daily drinking water requirement of <strong className="text-cyan-400 font-bold">{Math.round((summary?.total_water_savings || 0) / 3)} people</strong> for a year.
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Landfill Diverted</span>
              <h3 className="text-2xl font-black text-white mt-1">{summary?.total_landfill_reduction || 0} kg</h3>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Trash2 size={20} />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Diverted solid textile waste from accumulating in municipal landfills, conserving municipal landfill space.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Circular scores breakdown */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between items-center text-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 self-start">
            <Activity size={16} className="text-emerald-400" />
            <span>Circularity Index Analysis</span>
          </h3>
          <div className="my-6">
            <CircularProgress score={summary?.average_circularity_score || 0} size={150} strokeWidth={12} title="Circularity" />
          </div>
          <div className="text-xs text-slate-400 px-4">
            Circularity scores are calculated using material purity, degradation status, and feasibility of mechanical/chemical processing loops.
          </div>
        </div>

        {/* Right ESG reporting details */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-emerald-400" />
            <span>ESG Compliance & Benchmarking</span>
          </h3>
          <p className="text-xs text-slate-400">Compliance alignment reports and material resource statistics</p>
          
          <div className="space-y-4 pt-3">
            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                <Heart size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">United Nations SDG Alignment</h4>
                <p className="text-[11px] text-slate-400">
                  Aligns with SDG 12 (Responsible Consumption and Production) and SDG 13 (Climate Action) by mapping and maximizing material sorting recovery efficiencies.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                <Layers size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Resource Substitution Index</h4>
                <p className="text-[11px] text-slate-400">
                  Estimated virgin resource raw savings: <strong className="text-cyan-400 font-bold">{summary?.total_resource_conservation || 0} kg</strong>. Replaces the necessity of cultivating raw cotton or synthesizing oil-derived polyester fibers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                <TrendingUp size={16} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Carbon Credit Estimation</h4>
                <p className="text-[11px] text-slate-400">
                  Equivalent to <strong className="text-purple-400 font-bold">{((summary?.total_co2_savings || 0) / 1000).toFixed(3)} carbon offset credits</strong> accrued under verified emission reduction schemes (Gold Standard / VCS).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Circular Loop Flowchart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw size={16} className="text-emerald-400 animate-spin-slow" />
            <span>Interactive Circular Economy Lifecycle</span>
          </h3>
          <p className="text-xs text-slate-405 mt-1">Hover over each step to explore how TexCycle automates the circular loop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {lifecycleSteps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = activeStep === index;
            return (
              <div 
                key={index}
                onMouseEnter={() => setActiveStep(index)}
                className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px] ${
                  isHovered 
                    ? 'bg-gradient-to-b from-emerald-500/10 to-teal-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)] scale-[1.03]'
                    : 'bg-slate-900/40 border-slate-805 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                    isHovered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    STEP 0{index + 1}
                  </span>
                  <div className={`p-1 rounded-lg ${isHovered ? 'text-emerald-450' : 'text-slate-500'}`}>
                    <Icon size={16} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  <p className="text-[10px] text-slate-450 leading-snug">{step.desc}</p>
                </div>
                
                {/* Arrow connecting to next step */}
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-700 pointer-events-none font-bold text-sm">
                    ➔
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
