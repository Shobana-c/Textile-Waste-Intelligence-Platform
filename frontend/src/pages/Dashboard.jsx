import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Leaf, 
  Droplet, 
  Trash2, 
  Scale, 
  Layers, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  User as UserIcon,
  Cpu,
  Database,
  Users
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { LineTrendChart, FabricBarChart, CircularProgress } from '../components/Charts';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulator State Hooks
  const [simPurity, setSimPurity] = useState(85);
  const [simMaterial, setSimMaterial] = useState('Cotton');
  const [simCondition, setSimCondition] = useState('Good');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Simulator calculations
  const calculateSimScore = () => {
    let recyclability = 85.0;
    if (simMaterial === 'Cotton') recyclability = 90.0;
    else if (simMaterial === 'Polyester') recyclability = 80.0;
    else if (simMaterial === 'Wool') recyclability = 75.0;
    else if (simMaterial === 'Blend') recyclability = 50.0;
    else if (simMaterial === 'Denim') recyclability = 85.0;

    let conditionScore = 100.0;
    if (simCondition === 'Worn') conditionScore = 70.0;
    else if (simCondition === 'Damaged') conditionScore = 40.0;
    else if (simCondition === 'Contaminated') conditionScore = 10.0;

    let recyclabilityAdj = recyclability * (conditionScore / 100.0) * (simPurity / 100.0);
    let reuseScore = conditionScore;
    if (simCondition === 'Contaminated') reuseScore = 10.0;

    let sustainability = simMaterial === 'Cotton' || simMaterial === 'Wool' ? 85.0 : 45.0;
    let feasibility = simMaterial === 'Cotton' || simMaterial === 'Wool' ? 100.0 : (simMaterial === 'Blend' ? 55.0 : 85.0);
    if (simCondition === 'Contaminated') feasibility = 10.0;

    let circularity = (
      (recyclabilityAdj * 0.35) +
      (conditionScore * 0.20) +
      (reuseScore * 0.20) +
      (sustainability * 0.15) +
      (feasibility * 0.10)
    );
    return Math.round(circularity * 10) / 10;
  };

  const simCircularity = calculateSimScore();
  
  let simCategory = "Disposal Recommended";
  let simStrategy = "Disposal";
  let simOffsetYears = 0.5;

  if (simCircularity >= 80.0) {
    simCategory = "Excellent Recovery";
    simStrategy = simMaterial === 'Denim' ? "Fabric Reuse" : "Donation";
    simOffsetYears = 5.0;
  } else if (simCircularity >= 60.0) {
    simCategory = "High Recovery";
    simStrategy = simMaterial === 'Polyester' ? "Chemical Recycling" : "Mechanical Recycling";
    simOffsetYears = 3.5;
  } else if (simCircularity >= 40.0) {
    simCategory = "Moderate Recovery";
    simStrategy = "Upcycling";
    simOffsetYears = 2.0;
  } else if (simCircularity >= 20.0) {
    simCategory = "Limited Recovery";
    simStrategy = "Fiber Recycling";
    simOffsetYears = 1.0;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const { summary, fabric_distribution, monthly_trends, circularity_distribution } = stats || {};

  // ==========================================
  // 1. RECYCLING FACILITY DASHBOARD (OPERATOR)
  // ==========================================
  const renderOperatorDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Textile Waste Processed" 
          value={summary?.total_weight || 0} 
          unit="kg"
          icon={Scale}
          description="Total raw weight sorted"
          trend="+14.2% MoM"
          color="indigo"
        />
        <StatCard 
          title="Average Quality Grade" 
          value={summary?.average_quality_score || 0} 
          unit="%"
          icon={Activity}
          description="Mean batch quality score"
          trend="+3.1% MoM"
          color="accent"
        />
        <StatCard 
          title="Avg Circularity Score" 
          value={summary?.average_circularity_score || 0} 
          unit="%"
          icon={ShieldCheck}
          description="Circular economy grading"
          trend="+5.4% MoM"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-secondary-400" />
                <span>Textile Collection Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Diverted waste volumes (last 6 months)</p>
            </div>
          </div>
          <LineTrendChart data={monthly_trends} />
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-secondary-400" />
              <span>Circularity Index</span>
            </h3>
            <p className="text-xs text-slate-400">Current batch recovery gauge</p>
          </div>
          <div className="my-2 flex justify-center">
            <CircularProgress score={summary?.average_circularity_score || 0} title="Circularity" />
          </div>
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Formula balances: 35% Recyclability, 20% Condition, 20% Reuse, 15% ESG Benefit, 10% Feasibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-secondary-400" />
              <span>Material Sorting Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Raw fiber weights categorized</p>
          </div>
          <FabricBarChart data={fabric_distribution} />
        </div>

        {/* ESG Simulator widget */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-secondary-400" />
              <span>ESG Circularity Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">Interactively adjust inputs to compute recovery ratings dynamically</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Material Purity</span>
                <span className="text-secondary-400 font-bold">{simPurity}% Purity</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={simPurity}
                onChange={(e) => setSimPurity(parseInt(e.target.value))}
                className="w-full accent-secondary-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Material Type</label>
                <select
                  value={simMaterial}
                  onChange={(e) => setSimMaterial(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Blend">Poly-Cotton Blend</option>
                  <option value="Wool">Wool</option>
                  <option value="Denim">Denim</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Condition</label>
                <select
                  value={simCondition}
                  onChange={(e) => setSimCondition(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
                >
                  <option value="Good">Good (Clean)</option>
                  <option value="Worn">Worn</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Contaminated">Contaminated</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Simulated Circularity</span>
                <div className="text-2xl font-black text-white">{simCircularity}%</div>
                <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full font-bold border ${
                  simCircularity >= 80 ? 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30' :
                  simCircularity >= 60 ? 'bg-accent-500/20 text-accent-400 border-accent-500/30' :
                  simCircularity >= 40 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-550' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {simCategory}
                </span>
              </div>
              
              <div className="text-right space-y-1 border-l border-slate-800 pl-4">
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">Recommended Stream</span>
                <strong className="text-secondary-400 text-xs font-bold block">{simStrategy}</strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">Offset: <strong>+{simOffsetYears} Years</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 2. SUSTAINABILITY MANAGER DASHBOARD (MANAGER)
  // ==========================================
  const renderManagerDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Carbon Footprint Saved" 
          value={summary?.total_co2_savings || 0} 
          unit="kg CO₂"
          icon={Leaf}
          description="CO₂ emissions avoided"
          trend="+18.5% MoM"
          color="emerald"
        />
        <StatCard 
          title="Water Resources Offset" 
          value={summary?.total_water_savings || 0} 
          unit="Liters"
          icon={Droplet}
          description="Water consumption offset"
          trend="+22.1% MoM"
          color="cyan"
        />
        <StatCard 
          title="Landfill Diversion Rate" 
          value={summary?.total_landfill_reduction || 0} 
          unit="kg"
          icon={Trash2}
          description="Solid waste diverted from landfills"
          trend="+12.4% MoM"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Leaf className="text-primary-400" size={18} />
            <span>ESG Sustainability Coefficients (per kg)</span>
          </h3>
          <p className="text-xs text-slate-400">Database multipliers mapped to registered fibers:</p>
          
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-450 uppercase font-bold tracking-wider">
                  <th className="py-3 px-2">Material Type</th>
                  <th className="py-3 px-2">CO₂ Offset (kg/kg)</th>
                  <th className="py-3 px-2">Water Saved (L/kg)</th>
                  <th className="py-3 px-2">Landfill Diverted (kg/kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-3 px-2 font-semibold">Cotton</td>
                  <td className="py-3 px-2 text-emerald-400">8.5 kg CO₂</td>
                  <td className="py-3 px-2 text-cyan-400">4,500 L</td>
                  <td className="py-3 px-2">1.0 kg</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold">Wool</td>
                  <td className="py-3 px-2 text-emerald-400">9.0 kg CO₂</td>
                  <td className="py-3 px-2 text-cyan-400">2,000 L</td>
                  <td className="py-3 px-2">1.0 kg</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold">Denim</td>
                  <td className="py-3 px-2 text-emerald-400">5.7 kg CO₂</td>
                  <td className="py-3 px-2 text-cyan-400">2,375 L</td>
                  <td className="py-3 px-2">1.0 kg</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 font-semibold">Polyester</td>
                  <td className="py-3 px-2 text-emerald-400">3.8 kg CO₂</td>
                  <td className="py-3 px-2 text-cyan-400">600 L</td>
                  <td className="py-3 px-2">1.0 kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-secondary-400" size={16} />
            <span>ESG Reporting Status</span>
          </h3>
          <p className="text-xs text-slate-400">Audit logs and certification pipeline</p>
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">GHG Scope 3 Audit</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-bold">COMPLIANT</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Water Footprint log</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-bold">VERIFIED</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Circular Material log</span>
              <span className="px-2 py-0.5 bg-secondary-500/20 text-secondary-400 border border-secondary-500/30 rounded-md font-bold">IN PROGRESS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 3. MANUFACTURER DASHBOARD (MANUFACTURER)
  // ==========================================
  const renderManufacturerDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="Average Sourced Fiber Quality" 
          value={summary?.average_quality_score || 0} 
          unit="%"
          icon={Activity}
          description="Average raw quality grade of batches"
          trend="+3.1% MoM"
          color="indigo"
        />
        <StatCard 
          title="Diverted Raw Materials" 
          value={summary?.total_weight || 0} 
          unit="kg"
          icon={Scale}
          description="Total recyclables sourced for production"
          trend="+14.2% MoM"
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div>
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-secondary-400" />
              <span>Material Composition insights</span>
            </h3>
            <p className="text-xs text-slate-400">Total sorting breakdown by raw fabric type</p>
          </div>
          <FabricBarChart data={fabric_distribution} />
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Activity size={16} className="text-secondary-400" />
            <span>Circularity Grades Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400">Count of batches by circular recovery grading</p>
          
          <div className="space-y-3 pt-2">
            {circularity_distribution && circularity_distribution.length > 0 ? (
              circularity_distribution.map((item, index) => {
                const getBadgeColor = (cat) => {
                  if (cat.includes("Excellent")) return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                  if (cat.includes("High")) return "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30";
                  if (cat.includes("Moderate")) return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
                  return "bg-red-500/20 text-red-400 border border-red-500/30";
                };
                return (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl border border-slate-800/50 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-bold border ${getBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {item.count} batches
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-400 text-xs text-center py-4">No batches classified yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 4. ADMIN DASHBOARD (ADMIN)
  // ==========================================
  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="System Status" 
          value="100" 
          unit="%"
          icon={ShieldCheck}
          description="All endpoints operational"
          trend="Uptime active"
          color="emerald"
        />
        <StatCard 
          title="API Response Latency" 
          value="45" 
          unit="ms"
          icon={Cpu}
          description="Mean query roundtrip time"
          trend="Fast"
          color="indigo"
        />
        <StatCard 
          title="Active DB Connections" 
          value="12" 
          unit="pools"
          icon={Database}
          description="SQLite active pools"
          trend="Healthy"
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management List */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-secondary-400" />
              <span>Platform User Management</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-bold">4 Seeded Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-450 uppercase font-bold tracking-wider">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">System Role</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-3 font-semibold">Jane Operator</td>
                  <td className="py-3 text-slate-400">operator@factory.com</td>
                  <td className="py-3 text-secondary-400 font-bold">Operator</td>
                  <td className="py-3"><span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">David Manager</td>
                  <td className="py-3 text-slate-400">manager@sustainability.org</td>
                  <td className="py-3 text-emerald-400 font-bold">Manager</td>
                  <td className="py-3"><span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Sarah Manufacturer</td>
                  <td className="py-3 text-slate-400">brand@fashion.com</td>
                  <td className="py-3 text-accent-400 font-bold">Manufacturer</td>
                  <td className="py-3"><span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Alex Administrator</td>
                  <td className="py-3 text-slate-400">admin@texcycle.com</td>
                  <td className="py-3 text-indigo-400 font-bold">Admin</td>
                  <td className="py-3"><span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">ACTIVE</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Monitoring logs */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Cpu size={16} className="text-secondary-400" />
            <span>Recent System Events</span>
          </h3>
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-400 space-y-2 h-[220px] overflow-y-auto">
            <p className="text-emerald-400">[INFO] DB connection pools initialized.</p>
            <p className="text-slate-400">[INFO] Seeding completed: 4 users created.</p>
            <p className="text-slate-400">[INFO] SQLite tables verified: 3 schemas active.</p>
            <p className="text-accent-400">[WARN] Cache miss on dashboard stats; pulling from DB.</p>
            <p className="text-emerald-400">[INFO] API /auth/login - POST 200 OK</p>
            <p className="text-emerald-400">[INFO] API /analysis/upload - POST 201 CREATED</p>
            <p className="text-slate-450">[DEBUG] WatchFiles: watching backend/ for alterations.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Router to target layouts
  const getRoleDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Manager': return renderManagerDashboard();
      case 'Manufacturer': return renderManufacturerDashboard();
      case 'Admin': return renderAdminDashboard();
      default: return renderOperatorDashboard(); // Operator
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome banner */}
      <div className="flex justify-between items-center glass p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Hello, {user?.full_name}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access role-tailored details as a <span className="text-secondary-400 font-bold">{user?.role}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2 rounded-xl text-slate-300 border border-slate-700">
          <ShieldCheck size={16} className="text-secondary-400" />
          <span>System Status: <strong className="text-secondary-400">Secure & Active</strong></span>
        </div>
      </div>

      {getRoleDashboard()}
    </div>
  );
}
