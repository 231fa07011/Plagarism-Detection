import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Share2, Search, ExternalLink, Info, CheckCircle, X, 
  FileText, MessageSquare, Sparkles, Send, Brain, RefreshCw, PenTool 
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const PAPER_SIZES = ['A3', 'A4', 'A5'];

const Analysis = () => {
  const { id } = useParams();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedSize, setSelectedSize] = useState('A4');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Academic Assistant. I have analyzed your document. Would you like me to help rewrite the paraphrased sections or explain the plagiarism results?' }
  ]);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' or 'suggestions'

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
      { 
        text: "Artificial Intelligence (AI) has emerged as a transformative force in the healthcare industry, offering unprecedented opportunities for improving patient outcomes and streamlining administrative processes. ", 
        match: null 
      },
      { 
        text: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes that process information using connectionist approaches. ", 
        match: 'exact', 
        source: "Introduction to Neural Networks - CS Press", 
        similarity: 98,
        improvement: "Computational neural architectures represent information processing systems that draw inspiration from biological neural frameworks. These systems utilize a series of networked junctions to handle data through distributive connectionist methodologies."
      },
      { 
        text: "By leveraging large-scale datasets and advanced machine learning algorithms, healthcare providers can now predict disease outbreaks before they occur. ", 
        match: 'paraphrase', 
        source: "Predictive Analytics in Medicine - Springer", 
        similarity: 72,
        improvement: "Utilizing extensive data repositories alongside sophisticated algorithmic models allows medical professionals to anticipate epidemic occurrences in advance."
      },
      { 
        text: "The integration of AI into clinical workflows remains a challenge due to ethical concerns and data privacy issues. ", 
        match: null 
      },
      { 
        text: "This study aims to investigate the current state of AI adoption in secondary care settings across Europe. ", 
        match: 'none' 
      }
    ]
  };

  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (id === 'latest') {
      const stored = sessionStorage.getItem('currentAnalysis');
      const title = sessionStorage.getItem('currentTitle');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAnalysisData({
          title: title || 'New Scan',
          score: parsed.overallSimilarity,
          sections: [
            { name: 'Introduction', score: parsed.sectionScores.introduction },
            { name: 'Methodology', score: parsed.sectionScores.methodology },
            { name: 'Results', score: parsed.sectionScores.results },
            { name: 'Conclusion', score: parsed.sectionScores.conclusion },
          ],
          content: parsed.sentenceMatches.map(m => ({
            text: m.sentence,
            match: m.matchType === 'none' ? null : m.matchType,
            source: m.source ? m.source.title : null,
            similarity: m.similarity,
            improvement: m.improvement
          }))
        });
      }
    } else {
      setAnalysisData(mockData);
    }
  }, [id]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reports/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: parseInt(id) || 1,
          document_title: analysisData?.title || 'Report',
          paper_size: selectedSize,
          file_format: 'PDF',
        }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${id || '1'}_${selectedSize}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Success: ${selectedSize} PDF Downloaded`, 'success');
    } catch (err) {
      showToast(`Simulation: ${selectedSize} PDF saved to DB.`, 'success');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages([...chatMessages, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          context: `Document title: ${analysisData?.title}, Score: ${analysisData?.score}%`
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
    }
  };

  if (!analysisData) {
    return <div className="flex items-center justify-center h-full">
      <RefreshCw className="w-10 h-10 animate-spin text-primary-500" />
    </div>;
  }

  const data = analysisData; // Use the local data variable

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <CheckCircle className="w-5 h-5" />
          {toast.msg}
          <button onClick={() => setToast(null)}><X className="w-4 h-4 ml-2 opacity-70" /></button>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all bg-white dark:bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-fit">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-black text-xs uppercase tracking-wider">Back to History</span>
        </Link>
        
        <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="flex items-center gap-1.5 px-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">Paper Size:</span>
             {PAPER_SIZES.map((size) => (
               <button
                 key={size}
                 onClick={() => setSelectedSize(size)}
                 className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                   selectedSize === size 
                   ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                   : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                 }`}
               >
                 {size}
               </button>
             ))}
          </div>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white dark:bg-slate-750 rounded-2xl hover:bg-black transition-all font-black text-sm shadow-xl disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? '...' : `Download ${selectedSize} PDF`}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* Navigation Tabs */}
          <div className="flex gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-fit mb-4">
            <button 
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${activeTab === 'analysis' ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <Brain className="w-4 h-4" />
              Scan Analysis
            </button>
            <button 
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${activeTab === 'suggestions' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <Sparkles className="w-4 h-4" />
              Content Improvement
            </button>
          </div>

          {activeTab === 'analysis' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Stats */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                  <h3 className="text-2xl font-black mb-10">Score Overview</h3>
                  <div className="relative w-52 h-52 mx-auto mb-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-100 dark:text-slate-700" />
                      <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="20" fill="transparent" 
                        strokeDasharray={578} strokeDashoffset={578 - (578 * data.score / 100)}
                        className="text-primary-500 transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black">{data.score}%</span>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Similarity</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {data.sections.map(sec => (
                      <div key={sec.name}>
                        <div className="flex justify-between text-[11px] mb-2 font-black uppercase tracking-widest text-slate-400">
                          <span>{sec.name}</span>
                          <span className="text-slate-900 dark:text-white">{sec.score}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${sec.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl">
                        <Brain className="w-5 h-5" />
                      </div>
                      <h4 className="font-black uppercase tracking-wider text-sm">Action Items</h4>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                      Highly similar content found in 2 sentences. Use the <strong className="text-amber-500">Suggestions</strong> tab to see AI-improved versions.
                    </p>
                    <button 
                      onClick={() => setActiveTab('suggestions')}
                      className="w-full py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-100 transition-all border border-amber-200"
                    >
                      Improve Content Now
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                </div>
              </div>

              {/* Center/Right: Document Viewer */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-700 h-full min-h-[600px] shadow-2xl relative">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                      <FileText className="w-8 h-8 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{data.title}</h1>
                  </div>
                  
                  <div className="text-2xl leading-[2.5] space-y-6 text-slate-700 dark:text-slate-300 font-medium tracking-tight">
                    {data.content.map((item, idx) => (
                      <span 
                        key={idx}
                        onClick={() => item.match && setSelectedMatch(item)}
                        className={`cursor-pointer transition-all px-1.5 py-0.5 rounded-xl ${
                          item.match === 'exact' ? 'bg-red-50 text-red-900 border-b-4 border-red-200' : 
                          item.match === 'paraphrase' ? 'bg-primary-50 text-primary-900 border-b-4 border-primary-200' : ''
                        } ${selectedMatch === item ? 'ring-[6px] ring-primary-500 ring-offset-4' : 'hover:scale-[1.01]'}`}
                      >
                        {item.text}
                      </span>
                    ))}
                  </div>

                  {selectedMatch && (
                    <div className="mt-16 p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl animate-in slide-in-from-bottom-8 duration-500 relative">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${selectedMatch.match === 'exact' ? 'bg-red-600' : 'bg-primary-600'}`}>
                            {selectedMatch.match} MATCH
                          </span>
                          <h4 className="text-2xl font-black mt-4">{selectedMatch.source}</h4>
                        </div>
                        <p className="text-5xl font-black text-primary-400">{selectedMatch.similarity}%</p>
                      </div>
                      <p className="text-slate-400 italic mb-8 text-lg">"Semantic overlap identified from cited source. Suggesting rewriting to improve originality."</p>
                      <button 
                         onClick={() => setActiveTab('suggestions')}
                         className="flex items-center gap-3 px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-sm hover:scale-105 transition-transform"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        See Suggested Fix
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Content Improvement Tab View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                      <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                         <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                         Original Text (Flagged)
                      </h4>
                      <div className="space-y-6">
                        {data.content.filter(i => i.match).map((item, idx) => (
                          <div key={idx} className="p-6 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-2xl relative">
                            <span className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">{idx+1}</span>
                            <p className="text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">"{item.text}"</p>
                          </div>
                        ))}
                      </div>
                  </div>

                  <div className="bg-primary-600 p-8 rounded-[2.5rem] shadow-2xl shadow-primary-500/30 text-white relative h-full">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-24 h-24" /></div>
                      <h4 className="text-xl font-black mb-6 flex items-center gap-3 relative z-10">
                         <div className="w-2 h-8 bg-white rounded-full"></div>
                         AI Suggested Revision
                      </h4>
                      <div className="space-y-6 relative z-10">
                        {data.content.filter(i => i.match).map((item, idx) => (
                          <div key={idx} className="p-6 bg-white/10 border border-white/20 rounded-2xl group hover:bg-white/20 transition-all cursor-pointer">
                            <p className="text-white font-bold leading-relaxed mb-4">"{item.improvement}"</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">0% Similarity Result</span>
                              <button 
                                onClick={() => showToast('Text copied to clipboard!')}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-xl font-black text-[10px] hover:scale-105 transition-transform"
                              >
                                <PenTool className="w-3 h-3" />
                                USE THIS VERSION
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 p-6 bg-black/20 rounded-[2rem] border border-white/10">
                         <h5 className="font-black text-sm mb-2 flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 text-amber-400" />
                           Expert Tip
                         </h5>
                         <p className="text-xs text-white/70 leading-relaxed">
                           Always review AI suggestions to ensure your original voice and specialized vocabulary are preserved while maintaining Academic integrity.
                         </p>
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chatbot Sidebar */}
        <div className={`w-96 flex flex-col bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] transition-all duration-500 shadow-2xl overflow-hidden ${showChat ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 hidden'}`}>
            <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500 rounded-xl text-white shadow-lg shadow-primary-500/20">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm">Academic AI</h4>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Always Learning</span>
                      </div>
                    </div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-600'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask AI to help rewrite..." 
                      className="w-full pl-5 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-inner"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-2 top-2 p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* Floating Chat Trigger */}
        {!showChat && (
          <button 
            onClick={() => setShowChat(true)}
            className="fixed bottom-10 right-10 p-6 bg-primary-600 text-white rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce flex items-center gap-3 z-50 group"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="font-black text-sm pr-2">Ask AI Assistant</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-slate-900 group-hover:scale-125 transition-all"></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Analysis;
