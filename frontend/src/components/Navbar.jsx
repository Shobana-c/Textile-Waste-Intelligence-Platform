import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Bell, Info } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(data => setNotifications(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'Manager': return 'bg-primary-500/20 text-primary-400 border border-primary-500/30';
      case 'Manufacturer': return 'bg-accent-500/20 text-accent-400 border border-accent-500/30';
      default: return 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30'; // Operator
    }
  };

  return (
    <nav className="h-16 glass px-6 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-2xl">♻️</span>
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-secondary-400 to-accent-400 bg-clip-text text-transparent">
            TexCycle Intelligence
          </h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">
            Textile Waste Intelligence Platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-200">{user.full_name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-secondary-400 shadow-inner">
              <UserIcon size={18} />
            </div>

            {/* Bell Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all relative"
                title="Notifications & Alerts"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-slideDown">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">{notifications.length} active</span>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No active system alerts.</p>
                    ) : (
                      notifications.map(notif => {
                        const getBadgeStyle = (type) => {
                          switch (type) {
                            case 'warning': return 'bg-red-500/20 text-red-400 border border-red-500/25';
                            case 'milestone': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25';
                            case 'opportunity': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/25';
                            default: return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/25';
                          }
                        };
                        return (
                          <div key={notif.id} className={`p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 ${!notif.read ? 'border-l-2 border-l-emerald-500' : ''}`}>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className={`font-extrabold px-2 py-0.5 rounded-full ${getBadgeStyle(notif.type)}`}>
                                {notif.title}
                              </span>
                              <span className="text-slate-500 font-medium">{notif.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed pt-1">{notif.message}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={logout}
              className="p-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
