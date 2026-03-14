import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, ArrowRight, Download, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAPER_SIZES = ['A3', 'A4', 'A5'];
const FILE_FORMATS = ['PDF', 'DOCX'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // scan id
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const [scans, setScans] = useState([
    { id: 1, title: 'Thesis_Draft_v1.docx', date: '2024-03-12', score: 12, status: 'Completed' },
    { id: 2, title: 'Literature_Review_Final.pdf', date: '2024-03-11', score: 45, status: 'Completed' },
    { id: 3, title: 'Methodology_Chapter.tex', date: '2024-03-10', score: 8, status: 'Completed' },
  ]);

  const stats = [
    { label: 'Total Scans', value: '24', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Avg Similarity', value: '18%', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Original Docs', value: '16', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Time Saved', value: '12h', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];



  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = async (scan, paperSize, fileFormat) => {
    setOpenDropdown(null);
    try {
      // Log to backend & trigger download
      const res = await fetch('http://localhost:8000/reports/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: scan.id,
          document_title: scan.title,
          paper_size: paperSize,
          file_format: fileFormat,
        }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${scan.id}_${paperSize}.${fileFormat.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);

      // Record in local history
      const newEntry = {
        id: downloadHistory.length + 1,
        scan_id: scan.id,
        document_title: scan.title,
        paper_size: paperSize,
        file_format: fileFormat,
        downloaded_at: new Date().toISOString(),
      };
      setDownloadHistory(prev => [newEntry, ...prev]);
      showToast(`Downloaded as ${paperSize} ${fileFormat}`, 'success');
    } catch (err) {
      // Fallback: just record in local history without actual backend
      const newEntry = {
        id: downloadHistory.length + 1,
        scan_id: scan.id,
        document_title: scan.title,
        paper_size: paperSize,
        file_format: fileFormat,
        downloaded_at: new Date().toISOString(),
      };
      setDownloadHistory(prev => [newEntry, ...prev]);
      showToast(`Recorded: ${scan.title} → ${paperSize} ${fileFormat}`, 'success');
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      // Now analyze the text
      const analysisRes = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });
      const analysisData = await analysisRes.json();
      
      // Store in session storage for the demo (normally, this would be a real DB record ID)
      sessionStorage.setItem('currentAnalysis', JSON.stringify(analysisData));
      sessionStorage.setItem('currentTitle', file.name); // Corrected from file.filename
      
      setIsUploading(false);
      navigate('/analysis/latest');
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      showToast('Upload/Analysis failed. Check backend connection.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-semibold text-sm animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {toast.msg}
          <button onClick={() => setToast(null)}><X className="w-4 h-4 ml-1 opacity-70" /></button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Upload New Document</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Drag and drop your file here, or click to browse. Supports PDF, DOCX, and TXT.
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.docx,.txt"
          />
          <label
            htmlFor="file-upload"
            className="inline-block mt-6 px-10 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isUploading ? 'Analyzing...' : 'Start New Scan'}
          </label>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Scans</h3>
          <button className="text-primary-500 font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm uppercase">
              <th className="px-6 py-4 font-bold">Document Name</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Similarity</th>
              <th className="px-6 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/analysis/${scan.id}`)}>
                  <FileText className="w-5 h-5 text-slate-400" />
                  {scan.title}
                </td>
                <td className="px-6 py-4 text-slate-500">{scan.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    scan.score > 40 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                    scan.score > 20 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                  }`}>
                    {scan.score}% Match
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-primary-500 font-bold"
                      onClick={() => navigate(`/analysis/${scan.id}`)}
                    >
                      View
                    </button>

                    {/* Download Dropdown */}
                    <div className="relative">
                      <button
                        id={`download-btn-${scan.id}`}
                        onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === scan.id ? null : scan.id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        <Download className="w-3 h-3" />
                        Download
                        <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === scan.id ? 'rotate-180' : ''}`} />
                      </button>

                      {openDropdown === scan.id && (
                        <div className="absolute right-0 top-9 z-50 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                            Select Paper Size
                          </p>
                          {PAPER_SIZES.map(size => (
                            <div key={size}>
                              <p className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{size}</p>
                              {FILE_FORMATS.map(fmt => (
                                <button
                                  key={fmt}
                                  id={`download-${scan.id}-${size}-${fmt}`}
                                  onClick={() => handleDownload(scan, size, fmt)}
                                  className="w-full text-left px-5 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-3 h-3 opacity-60" />
                                  {size} — {fmt}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Download History Section */}
      {downloadHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Download className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold">Download History</h3>
            <span className="ml-auto text-xs text-slate-500 font-medium">{downloadHistory.length} record{downloadHistory.length > 1 ? 's' : ''}</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase">
                <th className="px-6 py-3 font-bold">Document</th>
                <th className="px-6 py-3 font-bold">Paper Size</th>
                <th className="px-6 py-3 font-bold">Format</th>
                <th className="px-6 py-3 font-bold">Downloaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {downloadHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {entry.document_title}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-md">{entry.paper_size}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs font-bold rounded-md">{entry.file_format}</span>
                  </td>
                  <td className="px-6 py-3 text-xs text-slate-500">
                    {new Date(entry.downloaded_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {openDropdown !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}
    </div>
  );
};

export default Dashboard;
