import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Camera, 
  Leaf, 
  FileText, 
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Waste Inventory', icon: Layers },
    { id: 'scan', label: 'Image Analysis', icon: Camera },
    { id: 'sustainability', label: 'Sustainability stats', icon: Leaf },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'matching', label: 'B2B Sourcing Hub', icon: Sparkles },
  ];

  return (
    <aside className="w-64 glass border-r border-slate-800 flex flex-col justify-between py-6">
      <div className="space-y-6">
        <div className="px-6">
          <div className="flex items-center gap-2 p-3 bg-secondary-500/10 border border-secondary-500/20 rounded-xl">
            <Sparkles size={16} className="text-secondary-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Circular Mode Active
            </span>
          </div>
        </div>

        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-secondary-500/20 to-accent-500/20 text-secondary-400 border border-secondary-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-6 text-[10px] text-slate-500 font-medium">
        <p>© 2026 TexCycle Inc.</p>
        <p className="mt-1">Version 1.0.0 (Stable)</p>
      </div>
    </aside>
  );
}
