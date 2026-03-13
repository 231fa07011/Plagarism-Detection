import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, Search, ExternalLink, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analysis = () => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const mockData = {
    title: 'Modern AI in Healthcare.pdf',
    score: 34,
    sections: [
      { name: 'Introduction', score: 15 },
      { name: 'Methodology', score: 42 },
      { name: 'Results', score: 68 },
      { name: 'Conclusion', score: 10 },
    ],
    content: [
      { text: "Artificial Intelligence (AI) has emerged as a transformative force in the healthcare industry, offering unprecedented opportunities for improving patient outcomes and streamlining administrative processes. ", match: null },
      { text: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes that process information using connectionist approaches. ", match: 'exact', source: "Introduction to Neural Networks - CS Press", similarity: 98 },
      { text: "By leveraging large-scale datasets and advanced machine learning algorithms, healthcare providers can now predict disease outbreaks before they occur. ", match: 'paraphrase', source: "Predictive Analytics in Medicine - Springer", similarity: 72 },
      { text: "The integration of AI into clinical workflows remains a challenge due to ethical concerns and data privacy issues. ", match: null },
      { text: "This study aims to investigate the current state of AI adoption in secondary care settings across Europe. ", match: 'none' }
    ]
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-6">Global Similarity</h3>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={552} strokeDashoffset={552 - (552 * mockData.score / 100)}
                  className="text-amber-500 transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{mockData.score}%</span>
                <span className="text-sm font-bold text-slate-500 uppercase">Match Score</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {mockData.sections.map(sec => (
                <div key={sec.name}>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span>{sec.name}</span>
                    <span>{sec.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: `${sec.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary-500" />
              <h4 className="font-bold">Match Summary</h4>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              We found 2 significant matches in your document. One appears to be an exact verbatim match from a CS journal.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-red-600"></div>
                1 Exact Match Found
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                1 Paraphrased Section
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Document Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl border border-slate-200 dark:border-slate-700 h-full min-h-[600px]">
            <h1 className="text-2xl font-black mb-8">{mockData.title}</h1>
            <div className="text-lg leading-relaxed space-y-2 text-slate-700 dark:text-slate-300">
              {mockData.content.map((item, idx) => (
                <span 
                  key={idx}
                  onClick={() => item.match && setSelectedMatch(item)}
                  className={`cursor-pointer transition-all ${
                    item.match === 'exact' ? 'highlight-exact' : 
                    item.match === 'paraphrase' ? 'highlight-paraphrase' : ''
                  } ${selectedMatch === item ? 'ring-2 ring-primary-500 ring-offset-4 dark:ring-offset-slate-800' : ''}`}
                >
                  {item.text}
                </span>
              ))}
            </div>

            {selectedMatch && (
              <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      selectedMatch.match === 'exact' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {selectedMatch.match} MATCH
                    </span>
                    <h4 className="text-xl font-bold mt-2">{selectedMatch.source}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase">Similarity</p>
                    <p className="text-3xl font-black text-primary-500">{selectedMatch.similarity}%</p>
                  </div>
                </div>
                <p className="text-slate-500 italic mb-6">"Matching text found in the source document database..."</p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
                  </button>
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-500 font-medium"
                  >
                    Close Comparison
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
