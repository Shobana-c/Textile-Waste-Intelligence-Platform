import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Layers, 
  Send, 
  CheckCircle, 
  Search, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function B2BMatching() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sourcing procurement request list
  const [requests, setRequests] = useState([
    { id: 1, brand: 'Patagonia WornWear', material: 'Wool', minCircularity: 75, quantity: 400, status: 'Active' },
    { id: 2, brand: 'H&M Conscious', material: 'Cotton', minCircularity: 80, quantity: 1200, status: 'Active' },
    { id: 3, brand: 'Levis Recycled Denim', material: 'Denim', minCircularity: 70, quantity: 800, status: 'Completed' }
  ]);

  // Form State
  const [reqMaterial, setReqMaterial] = useState('Cotton');
  const [reqCircularity, setReqCircularity] = useState(80);
  const [reqQty, setReqQty] = useState(500);

  // Sourcing Contract popup state
  const [contractActive, setContractActive] = useState(false);
  const [contractDetails, setContractDetails] = useState(null);
  const [contractLoading, setContractLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await api.getBatches();
        setBatches(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch sourcing batches');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      brand: user.full_name + ' Sourcing',
      material: reqMaterial,
      minCircularity: parseInt(reqCircularity),
      quantity: parseFloat(reqQty),
      status: 'Active'
    };
    setRequests([newReq, ...requests]);
  };

  const handleInitiateSourcing = async (batch, request) => {
    setContractLoading(true);
    setContractDetails({ batch, request });
    setContractActive(true);
    
    // Simulate transaction on-chain / database check
    await new Promise(resolve => setTimeout(resolve, 1500));
    setContractLoading(false);
  };

  const getCompatibilityScore = (batch, req) => {
    if (batch.fabric_type !== req.material) return 0;
    const circScore = batch.analysis?.circularity_score || 0;
    if (circScore < req.minCircularity) return 0;
    
    // Compatibility based on purity & circularity
    return Math.round((circScore + 10) * 0.9);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-secondary-400" size={20} />
          <span>B2B Fiber Matching & Sourcing Hub</span>
        </h2>
        <p className="text-xs text-slate-400">Connect recycling facilities with manufacturers for circular fiber procurement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sourcing Requests & Creation Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Send size={14} className="text-secondary-400" />
              <span>Submit Sourcing Requisition</span>
            </h3>
            
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-405 uppercase">Target Fiber</label>
                <select
                  value={reqMaterial}
                  onChange={(e) => setReqMaterial(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900"
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Wool">Wool</option>
                  <option value="Denim">Denim</option>
                  <option value="Blend">Poly-Cotton Blend</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-405 uppercase">Min Circularity</label>
                  <input
                    type="number"
                    min="30"
                    max="100"
                    value={reqCircularity}
                    onChange={(e) => setReqCircularity(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-405 uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={reqQty}
                    onChange={(e) => setReqQty(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-slate-900 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-secondary-500 to-accent-500 text-slate-950 font-bold rounded-xl text-xs active:scale-[0.98] transition-all"
              >
                Publish Requisition
              </button>
            </form>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Active Sourcing Orders</h3>
            <div className="space-y-2 h-[200px] overflow-y-auto pr-1">
              {requests.map((req) => (
                <div key={req.id} className="p-3 bg-slate-900/60 border border-slate-855 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{req.brand}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Active' ? 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>{req.quantity} kg of {req.material}</span>
                    <span>Min Circularity: <strong>{req.minCircularity}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Match Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-secondary-400" />
                  <span>AI Automated Sourcing Matches</span>
                </h3>
                <p className="text-xs text-slate-400">Inventory batches meeting your brand requisitions</p>
              </div>
            </div>

            <div className="space-y-3">
              {requests.filter(r => r.status === 'Active').map((req) => {
                // Find matching batches
                const matches = batches.filter(b => {
                  const comp = getCompatibilityScore(b, req);
                  return comp > 0;
                });

                return (
                  <div key={req.id} className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Layers size={14} className="text-secondary-400" />
                        <span>Matches for {req.brand} ({req.material} Req)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Target quantity: {req.quantity} kg</span>
                    </div>

                    <div className="space-y-2">
                      {matches.length > 0 ? (
                        matches.map((batch) => {
                          const compatibility = getCompatibilityScore(batch, req);
                          return (
                            <div key={batch.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-905 gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-white">
                                  <span>Batch {batch.batch_id}</span>
                                  <span className="text-[9px] text-slate-400">({batch.quantity} kg available)</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Origin: <span className="font-semibold text-slate-300">{batch.source}</span> | Circularity: <span className="text-emerald-400 font-bold">{batch.analysis?.circularity_score}%</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-right">
                                  <span className="text-[8px] text-slate-550 uppercase block font-semibold">AI Match Score</span>
                                  <strong className="text-emerald-400 text-xs font-extrabold block">★ {compatibility}% Match</strong>
                                </div>

                                <button
                                  onClick={() => handleInitiateSourcing(batch, req)}
                                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-extrabold rounded-lg active:scale-95 transition-all"
                                >
                                  Source Batch
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-xs text-slate-500">
                          No matching inventory batches detected with circularity &gt;= {req.minCircularity}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Contract Transaction Dialog Popup */}
      {contractActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative">
            
            {contractLoading ? (
              <div className="py-8 space-y-6 flex flex-col items-center justify-center">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Drafting Sourcing Contract...</h3>
                  <p className="text-[10px] text-slate-400">Verifying circular compliance parameters on database</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                    <FileCheck size={28} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-black text-white">Sourcing Contract Dispatched</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Successfully matched and allocated raw recyclables for production!
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left space-y-2 text-[10px] text-slate-350">
                  <div className="flex justify-between">
                    <span>Batch Number:</span>
                    <strong className="text-white font-bold">{contractDetails?.batch?.batch_id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Sourcing Brand:</span>
                    <strong className="text-white font-bold">{contractDetails?.request?.brand}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Material Diverted:</span>
                    <strong className="text-emerald-400 font-bold">{contractDetails?.batch?.quantity} kg {contractDetails?.batch?.fabric_type}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Circularity Cert:</span>
                    <strong className="text-emerald-400 font-bold">{contractDetails?.batch?.analysis?.circularity_score}% Score</strong>
                  </div>
                </div>

                <button
                  onClick={() => setContractActive(false)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-800/80 text-white font-bold rounded-xl text-xs active:scale-[0.98] transition-all"
                >
                  Return to Sourcing Hub
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
