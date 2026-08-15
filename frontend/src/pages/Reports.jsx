import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Reports() {
  const [downloading, setDownloading] = useState(null);

  const handleExport = (type) => {
    setDownloading(type);
    
    // Direct link trigger since it's a file download StreamingResponse
    const token = localStorage.getItem('textile_token');
    const url = type === 'excel' ? api.getExcelExportUrl() : api.getPdfExportUrl();
    
    // We can open it in a new window or trigger iframe/anchor link
    // To pass Auth headers easily, we append token as query param, but FastAPI oauth2 standard is Bearer header.
    // In our backend, we use standard Bearer token.
    // To trigger a download with Bearer auth, we can fetch it, convert to blob, and save it!
    // This is much safer, handles errors, and works perfectly without having to configure cookies!
    // Let's implement actual blob fetch downlaods! That is extremely professional.
    const downloadFile = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to generate export file');
        }
        const blob = await response.blob();
        const filename = type === 'excel' ? 'textile_waste_report.xlsx' : 'textile_waste_report.pdf';
        
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (err) {
        alert(err.message || 'Error occurred downloading report.');
      } finally {
        setDownloading(null);
      }
    };
    
    downloadFile();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Reports & Export Center</h2>
        <p className="text-xs text-slate-400">Export waste inventory, circular economy parameters, and ESG summaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Excel Export Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
            <h3 className="text-md font-bold text-white">Excel Inventory Summary</h3>
            <p className="text-xs text-slate-400">
              Detailed spreadsheet report of all cataloged textile batches, material purity classifications, defect analysis, circularity scores, and source origins.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                <span>Format: .xlsx (Excel Spreadsheet)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers size={11} />
                <span>Includes complete inventory data rows</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleExport('excel')}
            disabled={downloading !== null}
            className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          >
            {downloading === 'excel' ? (
              <div className="h-4.5 w-4.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Download size={14} />
                <span>Download Excel Sheet</span>
              </>
            )}
          </button>
        </div>

        {/* PDF Export Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <FileText size={24} />
            </div>
            <h3 className="text-md font-bold text-white">PDF Executive ESG Report</h3>
            <p className="text-xs text-slate-400">
              High-fidelity compliance report summarizing circular economy statistics, carbon emissions avoided, water saved, landfill waste diverted, and overall recovery ratios.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                <span>Format: .pdf (Portable Document Format)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} />
                <span>Includes charts, visual summaries, and tables</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleExport('pdf')}
            disabled={downloading !== null}
            className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-cyan-400 border border-cyan-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
          >
            {downloading === 'pdf' ? (
              <div className="h-4.5 w-4.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Download size={14} />
                <span>Download Executive PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info size={16} className="text-emerald-400 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-200">Scheduled Reports (Optional)</h4>
          <p className="text-[10px] text-slate-500">
            For weekly recurring compliance schedules, you can configure automatic notification triggers or email digests in your settings panel.
          </p>
        </div>
      </div>
    </div>
  );
}
