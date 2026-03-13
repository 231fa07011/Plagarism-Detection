import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
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

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      navigate('/analysis/new');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
            Drag and drop your file here, or click to browse. Supports PDF, DOCX, TXT, and LaTeX.
          </p>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-6 px-10 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isUploading ? 'Analyzing...' : 'Start New Scan'}
          </button>
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
              <tr key={scan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => navigate(`/analysis/${scan.id}`)}>
                <td className="px-6 py-4 font-medium flex items-center gap-3">
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
                  <button className="text-primary-500 font-bold">View Report</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
