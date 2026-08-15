import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteInventory from './pages/WasteInventory';
import ImageAnalysis from './pages/ImageAnalysis';
import Sustainability from './pages/Sustainability';
import Reports from './pages/Reports';
import B2BMatching from './pages/B2BMatching';

function AppContent() {
  const { user, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login'); // login or register
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBatchForScan, setSelectedBatchForScan] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Session check
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-center">
        {authPage === 'login' ? (
          <Login onNavigateToRegister={() => setAuthPage('register')} />
        ) : (
          <Register onNavigateToLogin={() => setAuthPage('login')} />
        )}
      </div>
    );
  }

  const handleSelectBatchForScan = (batch) => {
    setSelectedBatchForScan(batch);
    setActiveTab('scan');
  };

  const handleClearSelectedBatch = () => {
    setSelectedBatchForScan(null);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/10 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl glow-bg-primary pointer-events-none z-0"></div>
      <div className="absolute bottom-1/10 right-1/4 w-[600px] h-[600px] bg-secondary-500/5 rounded-full blur-3xl glow-bg-secondary pointer-events-none z-0"></div>

      <Navbar />
      
      <div className="flex-1 flex overflow-hidden z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard />}
          
          {activeTab === 'inventory' && (
            <WasteInventory onSelectBatchForScan={handleSelectBatchForScan} />
          )}
          
          {activeTab === 'scan' && (
            <ImageAnalysis 
              selectedBatch={selectedBatchForScan} 
              onClearSelection={handleClearSelectedBatch} 
            />
          )}
          
          {activeTab === 'sustainability' && <Sustainability />}
          
          {activeTab === 'reports' && <Reports />}
          
          {activeTab === 'matching' && <B2BMatching />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
