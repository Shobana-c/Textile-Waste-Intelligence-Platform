import React, { useState, useEffect } from 'react';
import { api, FILE_SERVER_URL } from '../services/api';
import { 
  Upload, 
  Camera, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Leaf, 
  Trash2,
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ImageAnalysis({ selectedBatch, onClearSelection }) {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await api.getBatches();
        // Filter out batches that do not have analysis already, or allow selecting all
        setBatches(data);
        if (selectedBatch) {
          setBatchId(selectedBatch.id);
          if (selectedBatch.analysis) {
            setResult(selectedBatch.analysis);
            if (selectedBatch.analysis.image_path) {
              setPreviewUrl(`${FILE_SERVER_URL}/${selectedBatch.analysis.image_path}`);
            }
          }
        } else if (data.length > 0) {
          setBatchId(data[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load batches');
      }
    };
    fetchBatches();
  }, [selectedBatch]);

  const demoPresets = [
    {
      name: "Classic Blue Jeans",
      fabric: "Denim",
      condition: "Good",
      emoji: "👖",
      mockResult: {
        fabric_type_detected: "Denim",
        blend_details: "Cotton 98%, Elastane 2%",
        quality_score: 95.0,
        damage_detected: false,
        contamination_detected: false,
        recyclability_score: 85.5,
        reuse_score: 95.0,
        sustainability_score: 85.0,
        material_recovery_score: 80.0,
        circularity_score: 89.8,
        waste_category: "Reusable",
        recycling_strategy: "Fabric Reuse",
        co2_savings: 570.0,
        water_savings: 237500.0,
        landfill_reduction: 50.0,
        resource_conservation: 65.0
      },
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%231b2d42'/><path d='M0,30 L200,90 M0,90 L200,30' stroke='%2338bdf8' stroke-width='2' opacity='0.2'/><text x='100' y='65' fill='%2338bdf8' font-family='sans-serif' font-weight='bold' font-size='14' text-anchor='middle'>👖 BLUE DENIM PRESET</text></svg>"
    },
    {
      name: "White Cotton Tee",
      fabric: "Cotton",
      condition: "Contaminated",
      emoji: "👕",
      mockResult: {
        fabric_type_detected: "Cotton",
        blend_details: "100% Cotton",
        quality_score: 45.0,
        damage_detected: false,
        contamination_detected: true,
        recyclability_score: 54.0,
        reuse_score: 15.0,
        sustainability_score: 72.0,
        material_recovery_score: 27.0,
        circularity_score: 45.8,
        waste_category: "Recyclable",
        recycling_strategy: "Mechanical Recycling",
        co2_savings: 405.0,
        water_savings: 216000.0,
        landfill_reduction: 50.0,
        resource_conservation: 32.4
      },
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%23f1f5f9'/><circle cx='100' cy='60' r='20' fill='%23b45309' opacity='0.3'/><text x='100' y='90' fill='%23475569' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>👕 STAINED COTTON T-SHIRT</text></svg>"
    },
    {
      name: "Torn Wool Sweater",
      fabric: "Wool",
      condition: "Damaged",
      emoji: "🧶",
      mockResult: {
        fabric_type_detected: "Wool",
        blend_details: "100% Wool",
        quality_score: 35.0,
        damage_detected: true,
        contamination_detected: false,
        recyclability_score: 65.0,
        reuse_score: 35.0,
        sustainability_score: 80.0,
        material_recovery_score: 58.5,
        circularity_score: 55.6,
        waste_category: "Upcyclable",
        recycling_strategy: "Upcycling",
        co2_savings: 810.0,
        water_savings: 180000.0,
        landfill_reduction: 50.0,
        resource_conservation: 49.5
      },
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%237c2d12'/><line x1='20' y1='20' x2='180' y2='100' stroke='%23f43f5e' stroke-width='4'/><text x='100' y='65' fill='%23fecdd3' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>🧶 TORN WOOL BATCH</text></svg>"
    },
    {
      name: "Polyester Jacket",
      fabric: "Polyester",
      condition: "Good",
      emoji: "🧥",
      mockResult: {
        fabric_type_detected: "Polyester",
        blend_details: "100% Polyester",
        quality_score: 98.0,
        damage_detected: false,
        contamination_detected: false,
        recyclability_score: 78.4,
        reuse_score: 98.0,
        sustainability_score: 59.2,
        material_recovery_score: 70.5,
        circularity_score: 81.3,
        waste_category: "Reusable",
        recycling_strategy: "Donation",
        co2_savings: 372.4,
        water_savings: 58800.0,
        landfill_reduction: 50.0,
        resource_conservation: 58.8
      },
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%23083344'/><circle cx='100' cy='60' r='25' fill='none' stroke='%2306b6d4' stroke-width='4'/><text x='100' y='65' fill='%2322d3ee' font-family='sans-serif' font-weight='bold' font-size='12' text-anchor='middle'>🧥 POLYESTER JACKET</text></svg>"
    }
  ];

  const handleSelectPreset = (preset) => {
    if (!batchId) {
      setError('Please select a batch first.');
      return;
    }
    setFile(null);
    setPreviewUrl(preset.image);
    setAnalyzing(true);
    setResult(null);
    setError(null);
    
    // Simulate scan timeline
    setTimeout(() => {
      const mockRes = { ...preset.mockResult };
      mockRes.waste_batch_id = parseInt(batchId);
      setResult(mockRes);
      setAnalyzing(false);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null); // Clear previous result
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!batchId || !file) {
      setError('Please select a batch and upload an image.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    try {
      const analysisData = await api.uploadImage(batchId, file);
      setResult(analysisData);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const currentBatch = batches.find(b => b.id === parseInt(batchId));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">AI Image Analysis Engine</h2>
          <p className="text-xs text-slate-400">Classify fibers, identify contamination, and score recyclability</p>
        </div>
        {selectedBatch && (
          <button
            onClick={onClearSelection}
            className="py-2 px-3 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs text-slate-300"
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload and Controls */}
        <div className="glass-card p-6 rounded-2xl space-y-5 flex flex-col justify-between">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Waste Batch</label>
              <select
                value={batchId}
                onChange={(e) => {
                  setBatchId(e.target.value);
                  const selected = batches.find(b => b.id === parseInt(e.target.value));
                  if (selected && selected.analysis) {
                    setResult(selected.analysis);
                    if (selected.analysis.image_path) {
                      setPreviewUrl(`${FILE_SERVER_URL}/${selected.analysis.image_path}`);
                    } else {
                      setPreviewUrl(null);
                    }
                  } else {
                    setResult(null);
                    setPreviewUrl(null);
                  }
                }}
                disabled={selectedBatch}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs bg-slate-900"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batch_id} - {b.fabric_type} ({b.quantity}kg)</option>
                ))}
              </select>
            </div>

            {/* Upload Area */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Fabric Photo</label>
              <div className="relative border-2 border-dashed border-slate-800 rounded-2xl hover:border-secondary-500/40 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    {analyzing && (
                      <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-3">
                        {/* Glowing Scanning Line */}
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-secondary-400 to-transparent absolute top-0 animate-[scan_1.5s_infinite_ease-in-out]"></div>
                        <style>{`
                          @keyframes scan {
                            0% { top: 0%; }
                            50% { top: 100%; }
                            100% { top: 0%; }
                          }
                        `}</style>
                        <RefreshCw size={24} className="text-secondary-400 animate-spin" />
                        <span className="text-xs text-secondary-400 font-bold uppercase tracking-wider animate-pulse">Running CV Models...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Upload size={32} className="mx-auto text-slate-500" />
                    <p className="text-xs font-semibold text-slate-300">Drag & drop or click to upload</p>
                    <p className="text-[10px] text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/20 text-red-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={analyzing || !file || !batchId}
              className="w-full py-3 bg-gradient-to-r from-secondary-500 to-accent-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              <Camera size={14} />
              <span>Run AI Image Scan</span>
            </button>
          </form>

          {/* 1-Click Demo presets */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1-Click Evaluator Presets</label>
            <div className="grid grid-cols-2 gap-2">
              {demoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={analyzing}
                  className="p-2.5 bg-slate-900/60 hover:bg-secondary-500/10 border border-slate-800 hover:border-secondary-500/20 rounded-xl text-left transition-all space-y-1 disabled:opacity-40"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{preset.emoji}</span>
                    <ArrowRight size={10} className="text-slate-500" />
                  </div>
                  <h4 className="text-[10px] font-extrabold text-slate-200">{preset.name}</h4>
                  <p className="text-[8px] text-slate-400 leading-none">{preset.fabric} - {preset.condition}</p>
                </button>
              ))}
            </div>
          </div>

          {currentBatch && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1">
                <Zap size={12} className="text-emerald-400" />
                <span>Batch Parameters</span>
              </h4>
              <p>Source Origin: <strong className="text-slate-200">{currentBatch.source}</strong></p>
              <p>Registered Weight: <strong className="text-slate-200">{currentBatch.quantity} kg</strong></p>
              <p>Inputted Material: <strong className="text-slate-200">{currentBatch.fabric_type}</strong></p>
            </div>
          )}
        </div>

        {/* Right: Analysis results output */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-800 min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 space-y-2">
              <Camera size={36} className="text-slate-600" />
              <p className="text-sm font-semibold">Ready for Textile Analysis</p>
              <p className="text-xs">Upload an image on the left and run scan to extract composition and sustainability index.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Header result info */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Scan Completed
                    </span>
                    {result.contamination_detected && (
                      <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Contaminated
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Detected Fiber: <span className="text-emerald-400">{result.fabric_type_detected}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Composition: {result.blend_details}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Circularity Score</span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{result.circularity_score}%</div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Quality Grade</span>
                  <div className="text-xl font-bold text-white mt-1">{result.quality_score}%</div>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Recyclability</span>
                  <div className="text-xl font-bold text-white mt-1">{result.recyclability_score}%</div>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Reuse Potential</span>
                  <div className="text-xl font-bold text-white mt-1">{result.reuse_score}%</div>
                </div>
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Material Recovery</span>
                  <div className="text-xl font-bold text-white mt-1">{result.material_recovery_score}%</div>
                </div>
              </div>

              {/* Visual Features Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Visual Features (CV Extraction)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Fabric Texture</span>
                    <strong className="text-white text-xs mt-1 block">{result.fabric_texture || 'Woven'}</strong>
                  </div>
                  <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Fabric Pattern</span>
                    <strong className="text-white text-xs mt-1 block">{result.fabric_pattern || 'Solid'}</strong>
                  </div>
                  <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Dominant Color</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="inline-block w-3.5 h-3.5 rounded-full border border-slate-700" 
                        style={{ backgroundColor: result.fabric_color || result.color_detected || '#cccccc' }}
                      />
                      <span className="text-white font-mono text-xs">{result.fabric_color || result.color_detected || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings and Alerts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider">AI Flags & Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    result.damage_detected 
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {result.damage_detected ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                    <div>
                      <p className="font-bold">{result.damage_detected ? 'Damage Detected' : 'Structural Integrity Intact'}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">
                        {result.damage_detected ? (result.damage_details || 'Holes, tears, or shredding identified in fabric.') : 'No tears or structural damage detected.'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    result.contamination_detected 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {result.contamination_detected ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
                    <div>
                      <p className="font-bold">{result.contamination_detected ? 'Contaminants Identified' : 'Material Free of Stains'}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">
                        {result.contamination_detected ? (result.contamination_details || 'Foreign spots (grease, ink, chemicals) found.') : 'Uniform fabric coloring, no major chemical staining.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation & Strategy */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>Recommendation & Strategy Engine</span>
                </h4>
                <div className="flex flex-col sm:flex-row gap-4 justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Recovery Category</span>
                    <strong className="text-white text-sm mt-0.5 block">{result.waste_category}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Recommended Stream</span>
                    <strong className="text-emerald-400 text-sm mt-0.5 block flex items-center gap-1">
                      <span>{result.recycling_strategy}</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Impact savings breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Environmental Offset Estimation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">CO₂ Savings</span>
                      <strong className="text-emerald-400 text-lg font-bold">{result.co2_savings} kg</strong>
                    </div>
                    <Leaf className="text-emerald-500/40" size={28} />
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Water Offset</span>
                      <strong className="text-cyan-400 text-lg font-bold">{result.water_savings} L</strong>
                    </div>
                    <Leaf className="text-cyan-500/40" size={28} />
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Landfill Diverted</span>
                      <strong className="text-purple-400 text-lg font-bold">{result.landfill_reduction} kg</strong>
                    </div>
                    <Leaf className="text-purple-500/40" size={28} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
