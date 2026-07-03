import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, Plus, RefreshCw, Layers, Scale, CheckCircle, 
  MapPin, AlertTriangle, Calendar, FileText, Upload, Brain,
  Sparkles, Image as ImageIcon, Loader2, Leaf, Droplet, 
  Trash, ArrowRight, BarChart2, ShieldAlert, CheckCircle2,
  Database, Award, Shield, User as UserIcon
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Navigation tabs: 'inventory' | 'sustainability'
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Selected Batch Detail Modal
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Form fields
  const [fabricType, setFabricType] = useState('Cotton');
  const [source, setSource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState('Clean');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Analysis & Drag-Drop states
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [recyclabilityScore, setRecyclabilityScore] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [colorPalette, setColorPalette] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = 'http://localhost:8000/api';

  const analysisSteps = [
    "Uploading textile image to analysis cluster...",
    "Initializing YOLOv8 object segmentation detector...",
    "Extracting primary fabric weave & texture descriptors...",
    "Evaluating color histograms and dye saturation...",
    "Computing recyclability & circularity score matrix...",
    "Inference complete! Syncing recommendations..."
  ];

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [token]);

  // Drag and Drop File Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setColorPalette(null);
    triggerImageAnalysis(file);
  };

  const triggerImageAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setError('');

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 700);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/inventory/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      setTimeout(async () => {
        clearInterval(stepInterval);
        if (response.ok) {
          const data = await response.json();
          setFabricType(data.fabric_type);
          setCondition(data.condition);
          setColor(data.color);
          setConfidenceScore(data.confidence_score);
          setRecyclabilityScore(data.recyclability_score);
          setImageUrl(data.image_url);
          setColorPalette(data.palette || [data.color]);
          setAnalysisStep(analysisSteps.length);
        } else {
          const errData = await response.json();
          setError(errData.detail || 'Image classification failed.');
        }
        setIsAnalyzing(false);
      }, 4200);

    } catch (err) {
      clearInterval(stepInterval);
      setError('Connection to classification server failed.');
      setIsAnalyzing(false);
    }
  };

  const handleRegisterBatch = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!source || !quantity || !color || !collectionDate) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fabric_type: fabricType,
          source,
          quantity_kg: parseFloat(quantity),
          color,
          condition,
          collection_date: collectionDate,
          image_url: imageUrl,
          confidence_score: confidenceScore,
          recyclability_score: recyclabilityScore
        })
      });

      if (response.ok) {
        setIsModalOpen(false);
        setSource('');
        setQuantity('');
        setColor('');
        setCondition('Clean');
        setFabricType('Cotton');
        setSelectedFile(null);
        setImagePreview(null);
        setConfidenceScore(null);
        setRecyclabilityScore(null);
        setImageUrl('');
        setColorPalette(null);
        fetchBatches();
      } else {
        const errData = await response.json();
        setError(errData.detail || 'Failed to register waste batch.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canRegister = user && (
    user.role === 'Recycling Facility Operator' || 
    user.role === 'Textile Manufacturer' || 
    user.role === 'Administrator'
  );

  // --- REPORTS & DATA EXPORTS ---
  const handleExportCSV = () => {
    if (batches.length === 0) return;
    const headers = [
      "Batch ID", "Fabric Type", "Source Location", "Quantity (KG)", 
      "Color", "Condition", "Circularity Score (%)", "Confidence Score (%)", 
      "CO2 Savings (KG)", "Water Savings (L)", "Recycling Action Plan", "Date Logged"
    ];
    const rows = batches.map(b => [
      b.batch_id,
      b.fabric_type,
      b.source.replace(/,/g, " "),
      b.quantity_kg,
      b.color,
      b.condition,
      b.circularity_score || "",
      b.confidence_score || "",
      b.co2_savings_kg || "",
      b.water_savings_liters || "",
      `"${(b.recycling_strategy || "").replace(/"/g, '""')}"`,
      new Date(b.collection_date).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `texcycle_inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // --- STATS CALCULATIONS ---
  const totalWeight = batches.reduce((acc, curr) => acc + curr.quantity_kg, 0);
  const totalCO2Saved = batches.reduce((acc, curr) => acc + (curr.co2_savings_kg || 0), 0);
  const totalWaterSaved = batches.reduce((acc, curr) => acc + (curr.water_savings_liters || 0), 0);
  const activeBatchesCount = batches.length;
  
  const cleanPercentage = activeBatchesCount > 0 
    ? Math.round((batches.filter(b => b.condition === 'Clean').length / activeBatchesCount) * 100) 
    : 0;

  // Categorize Circularity Categories (Page 7 of PDF)
  const categories = {
    excellent: batches.filter(b => (b.circularity_score || 0) >= 85),
    high: batches.filter(b => (b.circularity_score || 0) >= 70 && (b.circularity_score || 0) < 85),
    moderate: batches.filter(b => (b.circularity_score || 0) >= 50 && (b.circularity_score || 0) < 70),
    limited: batches.filter(b => (b.circularity_score || 0) >= 30 && (b.circularity_score || 0) < 50),
    disposal: batches.filter(b => (b.circularity_score || 0) < 30)
  };

  const fabricStats = {};
  batches.forEach(b => {
    fabricStats[b.fabric_type] = (fabricStats[b.fabric_type] || 0) + b.quantity_kg;
  });

  const conditionColors = {
    'Clean': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'Contaminated': 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    'Damaged': 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
  };

  const roleColors = {
    'Recycling Facility Operator': 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Textile Manufacturer': 'from-purple-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Sustainability Manager': 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    'Administrator': 'from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30'
  };

  const circularityPills = (score) => {
    if (!score) return 'bg-slate-800 text-slate-400';
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (score >= 70) return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (score >= 30) return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* 🌌 Organic Floating Background Particles (no-print) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-emerald-500/[0.03] blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-teal-500/[0.04] blur-[120px]"></div>
        <div className="absolute top-[60%] left-[40%] w-80 h-80 rounded-full bg-cyan-500/[0.02] blur-[100px] animate-pulse"></div>
      </div>

      {/* ================= LEFT SIDEBAR (no-print) ================= */}
      <aside className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-r border-slate-900 flex flex-col z-20 no-print">
        {/* Sidebar Brand header */}
        <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/15">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">TexCycle</h1>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block mt-1">Enterprise Port</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'inventory' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Materials Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab('sustainability')}
            className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center space-x-3 cursor-pointer ${
              activeTab === 'sustainability' 
                ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-400' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Sustainability Intelligence</span>
          </button>
        </nav>

        {/* User Card info inside sidebar */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate leading-none">{user?.full_name}</p>
              <span className="text-[9px] text-slate-500 mt-1 truncate block font-medium">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="flex-1 flex flex-col overflow-y-auto z-10">
        
        {/* Main Content container */}
        <main className="flex-grow max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
          
          {/* Welcome Dashboard Header */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeTab === 'inventory' ? 'Inventory Workspace' : 'Sustainability Analytics'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'inventory' 
                  ? 'Access logging tools, review classifications, and trace textile fibers.' 
                  : 'Track weighted indices, resource savings, and recover circular assets.'}
              </p>
            </div>

            {canRegister && activeTab === 'inventory' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/10 cursor-pointer no-print"
              >
                <Plus className="w-4 h-4" />
                <span>Register Waste Batch</span>
              </button>
            )}
          </section>

          {/* ================= INVENTORY TAB VIEW ================= */}
          {activeTab === 'inventory' && (
            <>
              {/* Stats Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl flex items-center space-x-5 transform hover:-translate-y-0.5 transition-all">
                  <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inventory Logged</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{totalWeight.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span></p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex items-center space-x-5 transform hover:-translate-y-0.5 transition-all">
                  <div className="p-4 bg-teal-500/10 rounded-xl text-teal-400">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Batches</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{activeBatchesCount}</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl flex items-center space-x-5 transform hover:-translate-y-0.5 transition-all">
                  <div className="p-4 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clean Batches Rate</p>
                    <p className="text-2xl font-extrabold text-white mt-1">{cleanPercentage}%</p>
                  </div>
                </div>
              </section>

              {/* Inventory Table Section */}
              <section className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-950/20">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span>Materials Inventory Log</span>
                  </h3>
                  <button 
                    onClick={fetchBatches} 
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Refresh inventory"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-500">Retrieving inventory logs...</p>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <AlertTriangle className="w-12 h-12 text-slate-600 mb-4 animate-bounce" />
                    <p className="text-sm text-slate-400 font-bold">No registered materials found</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Select Register Waste Batch to log new materials in the system.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950/40">
                          <th className="py-4 px-6">Image</th>
                          <th className="py-4 px-6">Batch ID</th>
                          <th className="py-4 px-6">Fabric Type</th>
                          <th className="py-4 px-6">Origin</th>
                          <th className="py-4 px-6">Weight</th>
                          <th className="py-4 px-6">Color</th>
                          <th className="py-4 px-6">Condition</th>
                          <th className="py-4 px-6">Circularity Rating</th>
                          <th className="py-4 px-6">Circular Action Recommendation</th>
                          <th className="py-4 px-6">Logged Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {batches.map((batch) => (
                          <tr 
                            key={batch.id} 
                            onClick={() => setSelectedBatch(batch)}
                            className="hover:bg-slate-900/30 transition-colors text-xs text-slate-300 cursor-pointer"
                            title="Click to view detailed metrics"
                          >
                            <td className="py-4 px-6">
                              {batch.image_url ? (
                                <img 
                                  src={batch.image_url} 
                                  alt="fabric" 
                                  className="w-10 h-10 object-cover rounded-lg border border-slate-800 shadow-md transform hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-lg text-slate-500">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 font-mono text-emerald-400 font-semibold">#{batch.batch_id}</td>
                            <td className="py-4 px-6 font-bold text-white">{batch.fabric_type}</td>
                            <td className="py-4 px-6">{batch.source}</td>
                            <td className="py-4 px-6 font-semibold text-white">{batch.quantity_kg.toLocaleString()} kg</td>
                            <td className="py-4 px-6">
                              <span className="flex items-center space-x-2">
                                <span 
                                  className="w-4 h-4 rounded-full border border-slate-800" 
                                  style={{ backgroundColor: batch.color.startsWith('#') ? batch.color : batch.color.toLowerCase() }}
                                ></span>
                                <span className="font-mono text-[10px] uppercase text-slate-400">{batch.color}</span>
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${conditionColors[batch.condition] || 'bg-slate-800'}`}>
                                {batch.condition}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              {batch.circularity_score ? (
                                <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${circularityPills(batch.circularity_score)}`}>
                                  <span>{batch.circularity_score}%</span>
                                </span>
                              ) : (
                                <span className="text-slate-500">Unassessed</span>
                              )}
                            </td>
                            <td className="py-4 px-6 truncate max-w-xs text-[10px] font-medium text-slate-400">
                              {batch.recycling_strategy || "Pending classification..."}
                            </td>
                            <td className="py-4 px-6 text-slate-500">{new Date(batch.collection_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}

          {/* ================= SUSTAINABILITY TAB VIEW ================= */}
          {activeTab === 'sustainability' && (
            <>
              {/* Impact Metric Cards (Dials) */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden border-t-2 border-t-emerald-500 transform hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CO2 Emissions Avoided</p>
                      <p className="text-3xl font-black text-white mt-2">
                        {Math.round(totalCO2Saved).toLocaleString()} <span className="text-sm font-semibold text-slate-400">kg</span>
                      </p>
                      <p className="text-[9px] text-emerald-400 mt-2.5 flex items-center space-x-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Offset {Math.round(totalCO2Saved / 22).toLocaleString()} tree seedlings grown for 10 yrs</span>
                      </p>
                    </div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                      <Leaf className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden border-t-2 border-t-blue-500 transform hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Water Footprint Offset</p>
                      <p className="text-3xl font-black text-white mt-2">
                        {Math.round(totalWaterSaved).toLocaleString()} <span className="text-sm font-semibold text-slate-400">L</span>
                      </p>
                      <p className="text-[9px] text-blue-400 mt-2.5 flex items-center space-x-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Saved daily water for {Math.round(totalWaterSaved / 150).toLocaleString()} people</span>
                      </p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                      <Droplet className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl relative overflow-hidden border-t-2 border-t-cyan-500 transform hover:-translate-y-0.5 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Landfill Diversion</p>
                      <p className="text-3xl font-black text-white mt-2">
                        {totalWeight.toLocaleString()} <span className="text-sm font-semibold text-slate-400">kg</span>
                      </p>
                      <p className="text-[9px] text-cyan-400 mt-2.5 flex items-center space-x-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>100% of textiles diverted from landfills</span>
                      </p>
                    </div>
                    <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400">
                      <Trash className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Recovery Potential Groups */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Recovery Potential Distribution</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-2xl text-center shadow-md">
                    <span className="text-emerald-400 text-xl font-black block">{categories.excellent.length}</span>
                    <span className="text-[10px] font-bold text-white mt-1.5 block">Excellent Potential</span>
                    <span className="text-[9px] text-slate-500 mt-1 block">(&gt;= 85%)</span>
                  </div>

                  <div className="bg-teal-950/10 border border-teal-500/10 p-5 rounded-2xl text-center shadow-md">
                    <span className="text-teal-400 text-xl font-black block">{categories.high.length}</span>
                    <span className="text-[10px] font-bold text-white mt-1.5 block">High Potential</span>
                    <span className="text-[9px] text-slate-500 mt-1 block">(70% - 84%)</span>
                  </div>

                  <div className="bg-amber-950/10 border border-amber-500/10 p-5 rounded-2xl text-center shadow-md">
                    <span className="text-amber-400 text-xl font-black block">{categories.moderate.length}</span>
                    <span className="text-[10px] font-bold text-white mt-1.5 block">Moderate Potential</span>
                    <span className="text-[9px] text-slate-500 mt-1 block">(50% - 69%)</span>
                  </div>

                  <div className="bg-orange-950/10 border border-orange-500/10 p-5 rounded-2xl text-center shadow-md">
                    <span className="text-orange-400 text-xl font-black block">{categories.limited.length}</span>
                    <span className="text-[10px] font-bold text-white mt-1.5 block">Limited Potential</span>
                    <span className="text-[9px] text-slate-500 mt-1 block">(30% - 49%)</span>
                  </div>

                  <div className="bg-rose-950/10 border border-rose-500/10 p-5 rounded-2xl text-center shadow-md">
                    <span className="text-rose-400 text-xl font-black block">{categories.disposal.length}</span>
                    <span className="text-[10px] font-bold text-white mt-1.5 block">Disposal Rec.</span>
                    <span className="text-[9px] text-slate-500 mt-1 block">(&lt; 30%)</span>
                  </div>
                </div>
              </section>

              {/* Charts Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fabric Distribution Bar Chart */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fabric Weight Distribution (kg)</h4>
                  
                  {Object.keys(fabricStats).length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">No chart data available.</div>
                  ) : (
                    <div className="space-y-4 py-2">
                      {Object.entries(fabricStats).map(([fabric, weight]) => {
                        const ratio = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
                        return (
                          <div key={fabric} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-400">{fabric}</span>
                              <span className="text-white">{weight.toLocaleString()} kg ({Math.round(ratio)}%)</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-850">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                                style={{ width: `${ratio}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Savings Contribution Circle Graph */}
                <div className="glass-card p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resource Savings contribution</h4>
                  {batches.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">No chart data available.</div>
                  ) : (
                    <div className="flex flex-col justify-center h-full space-y-6">
                      <div className="flex items-center space-x-6">
                        <svg width="100" height="100" viewBox="0 0 36 36" className="w-24 h-24">
                          <path
                            className="text-slate-900"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-emerald-500"
                            strokeWidth="3.5"
                            strokeDasharray="75, 100"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                            <span className="text-slate-300">Natural Fibers (High Offset)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-teal-600 rounded-full"></span>
                            <span className="text-slate-300">Synthetic Fibers (Low Offset)</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-2 max-w-[200px]">
                            Natural fibers substitute agricultural cultivation, resulting in 20,000x greater water offsets.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Reports & Exports Section */}
              <section className="glass-card p-6 rounded-2xl space-y-4 no-print">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reports & Data Exports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportCSV}
                    className="py-3.5 px-5 bg-slate-950/60 border border-slate-900 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold">Export Comma-Separated CSV</span>
                      <span className="block text-[10px] text-slate-500">Download Excel-compatible inventory logs</span>
                    </div>
                  </button>

                  <button
                    onClick={handlePrintReport}
                    className="py-3.5 px-5 bg-slate-950/60 border border-slate-900 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center space-x-2.5 transition-all cursor-pointer"
                  >
                    <Leaf className="w-5 h-5 text-cyan-400" />
                    <div className="text-left">
                      <span className="block text-sm font-bold">Print Environmental Report</span>
                      <span className="block text-[10px] text-slate-500">Generate executive PDF circularity summaries</span>
                    </div>
                  </button>
                </div>
              </section>
            </>
          )}

        </main>
      </div>

      {/* Selected Batch Details Drawer / Overlay Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBatch(null)}></div>
          
          <div className="glass-card w-full max-w-xl rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Batch Details</span>
                <h3 className="text-xl font-bold text-white">#{selectedBatch.batch_id}</h3>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${circularityPills(selectedBatch.circularity_score)}`}>
                Circularity Index: {selectedBatch.circularity_score}%
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block font-bold">Fabric Type</span>
                <span className="text-white text-xs font-bold block mt-1">{selectedBatch.fabric_type}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block font-bold">Condition</span>
                <span className="text-white text-xs font-bold block mt-1">{selectedBatch.condition}</span>
              </div>
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block font-bold">Quantity</span>
                <span className="text-white text-xs font-bold block mt-1">{selectedBatch.quantity_kg.toLocaleString()} kg</span>
              </div>
            </div>

            {/* Environmental Impact breakdown */}
            <div className="space-y-4 mb-6">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ecological Footprint Offset</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-emerald-950/10 border border-emerald-500/10 p-4 rounded-2xl text-emerald-400">
                  <Leaf className="w-5 h-5" />
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">CO2 Saved</span>
                    <span className="text-white font-bold text-md">{Math.round(selectedBatch.co2_savings_kg).toLocaleString()} kg</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-blue-950/10 border border-blue-500/10 p-4 rounded-2xl text-blue-400">
                  <Droplet className="w-5 h-5" />
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block font-semibold">Water Saved</span>
                    <span className="text-white font-bold text-md">{Math.round(selectedBatch.water_savings_liters).toLocaleString()} L</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Card */}
            <div className="p-5 rounded-2xl bg-cyan-950/10 border border-cyan-500/10 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 text-[10px] font-bold uppercase">
                <Brain className="w-4 h-4" />
                <span>Circular Economy Action Plan</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {selectedBatch.recycling_strategy}
              </p>
            </div>

            <button
              onClick={() => setSelectedBatch(null)}
              className="w-full mt-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 font-bold rounded-xl transition-all cursor-pointer text-center text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Registration Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => {
              if (!isAnalyzing && !isSubmitting) setIsModalOpen(false);
            }}
          ></div>

          {/* Modal Content */}
          <div className="glass-card w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-white mb-6">Register Waste Batch</h3>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Left Column: Image Upload Card */}
              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Textile Analysis Photo
                </label>
                
                {/* Drag-over glow container */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative w-full aspect-square bg-slate-950/40 border-2 rounded-2xl overflow-hidden flex flex-col items-center justify-center group transition-all ${
                    isDragging 
                      ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.02]' 
                      : 'border-dashed border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Textile Preview" className="w-full h-full object-cover" />
                      
                      {/* Laser scanner animation layer */}
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/40">
                          <div className="scanner-line"></div>
                        </div>
                      )}
                      
                      {/* Upload new overlay */}
                      {!isAnalyzing && (
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-xs font-bold">Change Photo</span>
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      )}
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer text-slate-500 hover:text-white transition-colors">
                      <Upload className="w-8 h-8 mb-2 text-slate-650 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs font-bold text-center">
                        {isDragging ? 'Drop Image Here!' : 'Drag & Drop Image'}
                      </span>
                      <span className="text-[9px] text-slate-600 mt-1">Accepts JPG, PNG</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* AI Progress Box */}
                {isAnalyzing && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                      <span className="flex items-center space-x-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI Classifier Active</span>
                      </span>
                      <span>{Math.round((analysisStep / (analysisSteps.length - 1)) * 100)}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed min-h-[32px]">{analysisSteps[analysisStep]}</p>
                  </div>
                )}

                {/* AI Score Feedback & Interactive Color Palette */}
                {!isAnalyzing && confidenceScore && (
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-bold">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>AI Diagnosis Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Confidence</span>
                        <span className="font-extrabold text-white text-sm">{confidenceScore}%</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <span className="text-slate-500 block text-[9px] uppercase font-bold">Recyclability</span>
                        <span className="font-extrabold text-white text-sm">{recyclabilityScore}%</span>
                      </div>
                    </div>

                    {/* Interactive 3-Color Palette strip */}
                    {colorPalette && colorPalette.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Suggested Palette (Click to lock):</span>
                        <div className="flex space-x-2">
                          {colorPalette.map(hex => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() => setColor(hex)}
                              className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                                color === hex 
                                  ? 'border-emerald-400 scale-110 shadow-md shadow-emerald-500/20' 
                                  : 'border-slate-800 hover:border-slate-700'
                              }`}
                              style={{ backgroundColor: hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Standard Metadata Form */}
              <div className="md:col-span-3">
                <form onSubmit={handleRegisterBatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Fabric Type
                      </label>
                      <select
                        value={fabricType}
                        onChange={(e) => setFabricType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                        disabled={isAnalyzing}
                      >
                        {[
                          'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 
                          'Denim', 'Nylon', 'Rayon', 'Acrylic', 'Mixed Fabrics'
                        ].map(f => (
                          <option key={f} value={f} className="bg-slate-900">{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Condition
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                        disabled={isAnalyzing}
                      >
                        {['Clean', 'Contaminated', 'Damaged'].map(c => (
                          <option key={c} value={c} className="bg-slate-900">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Origin Location
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="e.g. Factory Segment A"
                        required
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Quantity (KG)
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="e.g. 500"
                        required
                        min="1"
                        step="any"
                        disabled={isAnalyzing}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Color HEX / Name
                      </label>
                      <div className="relative flex items-center">
                        {color && (
                          <span 
                            className="absolute left-4 w-4 h-4 rounded-full border border-slate-800 shadow-sm"
                            style={{ backgroundColor: color.startsWith('#') ? color : color.toLowerCase() }}
                          ></span>
                        )}
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className={`w-full pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${color ? 'pl-11' : 'pl-4'}`}
                          placeholder="e.g. #FFFFFF"
                          required
                          disabled={isAnalyzing}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Collection Date
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                        <Calendar className="w-5 h-5" />
                      </span>
                      <input
                        type="date"
                        value={collectionDate}
                        onChange={(e) => setCollectionDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAnalyzing && !isSubmitting) setIsModalOpen(false);
                      }}
                      className="flex-1 py-3 px-4 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-center text-xs"
                      disabled={isAnalyzing || isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isAnalyzing}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span>Confirm Log</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
