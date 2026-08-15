import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Plus, 
  Trash2, 
  Tag, 
  Scale, 
  Calendar, 
  MapPin, 
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

export default function WasteInventory({ onSelectBatchForScan }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [batchId, setBatchId] = useState('');
  const [fabricType, setFabricType] = useState('Cotton');
  const [source, setSource] = useState('Factory A');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('Blue');
  const [condition, setCondition] = useState('Good');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchBatches = async () => {
    try {
      const data = await api.getBatches();
      setBatches(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!batchId || !quantity || !source) {
      setFormError('Please fill in all fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createBatch({
        batch_id: batchId.toUpperCase(),
        fabric_type: fabricType,
        source: source,
        quantity: parseFloat(quantity),
        color: color,
        condition: condition
      });
      // Reset
      setBatchId('');
      setQuantity('');
      setSource('Factory A');
      setShowAddForm(false);
      fetchBatches(); // Reload
    } catch (err) {
      setFormError(err.message || 'Failed to register batch.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch from the inventory?")) {
      try {
        await api.deleteBatch(id);
        fetchBatches();
      } catch (err) {
        alert(err.message || "Failed to delete batch");
      }
    }
  };

  const getConditionStyle = (cond) => {
    switch (cond) {
      case 'Good': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Worn': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Damaged': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20'; // Contaminated
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Textile Waste Inventory</h2>
          <p className="text-xs text-slate-400">Register, trace, and catalog textile batches</p>
        </div>
        <button
          onClick={() => {
            // Generate a random Batch ID to simplify typing for the user
            setBatchId(`BAT-${Math.floor(1000 + Math.random() * 9000)}`);
            setShowAddForm(!showAddForm);
          }}
          className="py-2.5 px-4 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all"
        >
          <Plus size={16} />
          <span>Register Batch</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Add Form Panel */}
      {showAddForm && (
        <div className="glass p-6 rounded-2xl border border-emerald-500/20 max-w-2xl animate-slideDown">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <span>New Waste Batch Registration</span>
          </h3>

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch ID</label>
              <input
                type="text"
                placeholder="e.g. BAT-2481"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source Origin</label>
              <input
                type="text"
                placeholder="e.g. Factory A, Consumer Drop"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fabric Material</label>
              <select
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs bg-slate-900"
              >
                <option value="Cotton">Cotton</option>
                <option value="Polyester">Polyester</option>
                <option value="Denim">Denim</option>
                <option value="Wool">Wool</option>
                <option value="Linen">Linen</option>
                <option value="Silk">Silk</option>
                <option value="Nylon">Nylon</option>
                <option value="Blend">Blend (Poly-Cotton)</option>
                <option value="Mixed Fabrics">Mixed Synthetic/Natural Fabrics</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quantity (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Weight in kilograms"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Tone</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs bg-slate-900"
              >
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Grey">Grey</option>
                <option value="Brown">Brown</option>
                <option value="Multi-color">Multi-color / Printed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs bg-slate-900"
              >
                <option value="Good">Good (Clean, Reusable)</option>
                <option value="Worn">Worn (Faded, Light wear)</option>
                <option value="Damaged">Damaged (Torn, Shredded)</option>
                <option value="Contaminated">Contaminated (Grease, Chemicals, Wet)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 border border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50"
              >
                {submitting ? 'Registering...' : 'Register Batch'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Batches</h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-semibold">
            {batches.length} items cataloged
          </span>
        </div>

        {batches.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Info size={32} className="mx-auto text-slate-600" />
            <p className="text-sm">No textile waste batches registered in inventory yet.</p>
            <p className="text-xs">Click "Register Batch" above to log your first waste batch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="p-4">Batch ID</th>
                  <th className="p-4">Fabric Type</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Weight (kg)</th>
                  <th className="p-4">Color</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Circularity Score</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-1.5">
                      <Tag size={12} className="text-slate-500" />
                      <span>{batch.batch_id}</span>
                    </td>
                    <td className="p-4 text-slate-300">{batch.fabric_type}</td>
                    <td className="p-4 text-slate-400 flex items-center gap-1">
                      <MapPin size={11} className="text-slate-500" />
                      <span>{batch.source}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{batch.quantity} kg</td>
                    <td className="p-4 text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700" style={{ backgroundColor: batch.color.toLowerCase() }}></span>
                        {batch.color}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getConditionStyle(batch.condition)}`}>
                        {batch.condition}
                      </span>
                    </td>
                    <td className="p-4">
                      {batch.analysis ? (
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">{batch.analysis.circularity_score}%</span>
                          <span className="text-[10px] text-slate-500 font-medium">({batch.analysis.waste_category})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectBatchForScan(batch)}
                          className="py-1 px-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 text-[10px] font-bold tracking-wider"
                        >
                          RUN AI SCAN
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectBatchForScan(batch)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/20 transition-all"
                          title="View Analysis & Upload Image"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 transition-all"
                          title="Delete Batch"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
