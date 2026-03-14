import React from 'react';
import { Download, FileText, CheckCircle, ArrowRight, Layers, Layout, Monitor, Printer } from 'lucide-react';

const Templates = () => {
  const templates = [
    { size: 'A2', name: 'Academic Poster Template', description: 'Perfect for conference posters and large research visualizations.', format: 'DOCX', icon: Monitor },
    { size: 'A4', name: 'Standard Thesis Template', description: 'The official standard for assignments, journals, and thesis papers.', format: 'DOCX', icon: FileText },
    { size: 'A5', name: 'Research Handbook Template', description: 'Compact size for field notes, pocket guides, and summaries.', format: 'DOCX', icon: Printer },
    { size: 'A6', name: 'Abstract Card Template', description: 'Small format for concise project summaries and quick distribution.', format: 'DOCX', icon: Layout },
  ];

  const handleDownload = async (size) => {
    try {
      // In a real app, this would call the backend to generate/fetch the template
      const res = await fetch('http://127.0.0.1:8000/api/reports/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: 0, // 0 for generic templates
          document_title: `${size} Academic Template`,
          paper_size: size,
          file_format: 'DOCX',
        }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${size}_Academic_Template.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Simulation: Downloading ${size} template...`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black mb-4">Academic Templates</h1>
        <p className="text-xl text-slate-500 font-medium">
          Professional research and study structures optimized for international standards. 
          Download pre-formatted templates for your next big project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tpl) => (
          <div key={tpl.size} className="group bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-xl hover:shadow-primary-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <tpl.icon className="w-24 h-24" />
            </div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-primary-500 transition-all group-hover:bg-primary-500 group-hover:text-white">
                {tpl.size}
              </div>
              <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tpl.format}
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-3">{tpl.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                {tpl.description}
              </p>
              
              <button 
                onClick={() => handleDownload(tpl.size)}
                className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white dark:bg-slate-700 rounded-2xl font-black text-sm hover:bg-black dark:hover:bg-primary-600 transition-all shadow-lg group-hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary-500 text-white p-12 rounded-[3rem] shadow-2xl shadow-primary-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Layers className="w-64 h-64" />
        </div>
        <div className="max-w-2xl relative z-10">
          <h2 className="text-3xl font-black mb-6">Need a Custom Layout?</h2>
          <p className="text-lg font-bold opacity-90 mb-10 leading-relaxed">
            Our AI-powered formatting engine can generate tailored templates based on your university's specific guidelines. Just upload your department's PDF guide.
          </p>
          <button className="px-10 py-4 bg-white text-primary-500 rounded-2xl font-black tracking-tight hover:bg-slate-50 transition-all shadow-xl flex items-center gap-3">
            Talk to AI Assistant
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Templates;
