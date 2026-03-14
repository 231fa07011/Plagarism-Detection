/* 
   DetectPro AI - Professional Global Chatbot Suite
   Fully Functional, Mobile-Responsive, Persistent History
*/

(function() {
    // 1. Premium Styles (Including Mobile Responsiveness)
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --dp-blue: #2563eb; --dp-dark-blue: #1d4ed8; }
        
        .dp-chat-trigger { 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            z-index: 10000; 
            width: 64px; height: 64px;
        }
        .dp-chat-trigger:hover { transform: scale(1.1) rotate(5deg); }
        
        .dp-chat-window { 
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
            z-index: 10000; 
            width: 420px; 
            max-width: 90vw;
            height: 600px; 
            max-height: 80vh;
            transform-origin: bottom right; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .dp-chat-window.hidden { 
            transform: scale(0.8) translateY(100px); 
            opacity: 0; 
            pointer-events: none; 
        }
        
        .dp-message { 
            animation: dpFadeIn 0.3s ease-out forwards; 
            max-width: 85%; 
            word-wrap: break-word;
        }
        
        @keyframes dpFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .dp-markdown h3 { font-weight: 800; margin-bottom: 8px; font-size: 15px; color: #1e3a8a; display: block; }
        .dp-markdown p { margin-bottom: 8px; }
        .dp-markdown ul { margin-left: 18px; margin-bottom: 8px; list-style-type: disc; }
        .dp-markdown li { margin-bottom: 4px; }
        .dark .dp-markdown h3 { color: #60a5fa; }

        .dp-typing-dot { animation: dpTyping 1.4s infinite; opacity: 0.3; font-size: 24px; line-height: 0; }
        .dp-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .dp-typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dpTyping { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        
        .dp-scrollbar::-webkit-scrollbar { width: 4px; }
        .dp-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        
        @media (max-width: 480px) {
            .dp-chat-window { right: 10px; bottom: 90px; width: calc(100vw - 20px); height: 500px; }
            .dp-chat-trigger { right: 20px; bottom: 20px; }
        }
    `;
    document.head.appendChild(style);

    // 2. Chat UI Generation
    const chatContainer = document.createElement('div');
    chatContainer.id = 'dp-chatbot-app';
    chatContainer.innerHTML = `
        <!-- Floating Trigger -->
        <button id="dp-trigger" class="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center dp-chat-trigger">
            <i class="fa-solid fa-robot text-2xl" id="dp-icon"></i>
        </button>

        <!-- Chat Window -->
        <div id="dp-window" class="fixed bottom-28 right-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hidden flex flex-col overflow-hidden dp-chat-window">
            
            <!-- Header -->
            <div class="bg-blue-600 p-6 text-white flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-brain"></i>
                    </div>
                    <div>
                        <div class="font-black text-sm">DetectPro AI</div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span class="text-[10px] font-bold opacity-80 uppercase tracking-widest">Always Online</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button id="dp-clear" class="hover:bg-white/10 w-8 h-8 rounded-lg transition-colors" title="New Session"><i class="fa-solid fa-rotate-left"></i></button>
                    <button id="dp-close" class="hover:bg-white/10 w-8 h-8 rounded-lg transition-colors"><i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>

            <!-- Messages Area -->
            <div id="dp-messages" class="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950/30 dp-scrollbar">
                <!-- Welcome label -->
                <div class="text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em] py-2">Encryption Active</div>
            </div>

            <!-- Input Area -->
            <div class="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div class="flex gap-2">
                    <input type="text" id="dp-input" class="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3 text-sm font-medium outline-none transition-all dark:text-white" placeholder="Ask your research query...">
                    <button id="dp-send" class="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all shadow-lg shadow-blue-500/30">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <p class="text-[9px] text-center mt-3 text-slate-400 font-bold uppercase tracking-widest">Real-time Academic Intelligence Core</p>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // 3. Logic & History Implementation
    const trigger = document.getElementById('dp-trigger');
    const windowEl = document.getElementById('dp-window');
    const inputField = document.getElementById('dp-input');
    const sendBtn = document.getElementById('dp-send');
    const messagesBox = document.getElementById('dp-messages');
    const closeBtn = document.getElementById('dp-close');
    const clearBtn = document.getElementById('dp-clear');

    let history = JSON.parse(localStorage.getItem('dp_chat_final') || '[]');

    function init() {
        if (history.length === 0) {
            addMessage("### 👋 Welcome to DetectPro AI!\nI'm your dedicated research assistant. Use me to **analyze plagiarism**, **rewrite complex sentences**, or **fix grammar**.", 'ai', false);
        } else {
            history.forEach(m => renderMessage(m.text, m.type));
        }

        trigger.onclick = () => windowEl.classList.toggle('hidden');
        closeBtn.onclick = () => windowEl.classList.add('hidden');
        clearBtn.onclick = clearHistory;
        sendBtn.onclick = sendMessage;
        inputField.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
        
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    function clearHistory() {
        if(confirm("New research session? This will clear our current chat history.")) {
            history = [];
            localStorage.removeItem('dp_chat_final');
            messagesBox.innerHTML = '<div class="text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em] py-2">Session Reset</div>';
            addMessage("Session reset. How can I help with your paper now?", 'ai', false);
        }
    }

    async function sendMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        inputField.value = '';

        const typing = showTyping();

        try {
            const resp = await fetch('http://127.0.0.1:8000/api/chatbot/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, context: document.title })
            });
            const data = await resp.json();
            messagesBox.removeChild(typing);
            await streamAI(data.reply);
        } catch (e) {
            messagesBox.removeChild(typing);
            await streamAI("I'm having trouble reaching my academic servers. Please check if the backend is running at `127.0.0.1:8000`. \n\nIn the meantime, how can I help with your writing?");
        }
    }

    function addMessage(text, type, save = true) {
        renderMessage(text, type);
        if (save) {
            history.push({ text, type });
            localStorage.setItem('dp_chat_final', JSON.stringify(history));
        }
    }

    function renderMessage(text, type) {
        const div = document.createElement('div');
        div.className = `dp-message p-5 rounded-[1.8rem] text-sm shadow-sm ${type === 'user' 
            ? 'bg-blue-600 text-white ml-auto rounded-tr-none font-bold' 
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-auto rounded-tl-none border border-slate-100 dark:border-slate-800 dp-markdown'}`;
        
        if (type === 'ai') div.innerHTML = parseMD(text);
        else div.innerText = text;

        messagesBox.appendChild(div);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    async function streamAI(text) {
        const div = document.createElement('div');
        div.className = 'dp-message p-5 rounded-[1.8rem] rounded-tl-none text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 mr-auto border border-slate-100 dark:border-slate-800 shadow-sm dp-markdown';
        messagesBox.appendChild(div);

        const words = text.split(' ');
        let current = "";
        for (let i = 0; i < words.length; i++) {
            current += words[i] + " ";
            div.innerHTML = parseMD(current);
            messagesBox.scrollTop = messagesBox.scrollHeight;
            await new Promise(r => setTimeout(r, 30 + Math.random() * 30));
        }

        history.push({ text, type: 'ai' });
        localStorage.setItem('dp_chat_final', JSON.stringify(history));
    }

    function parseMD(text) {
        return text
            .replace(/### (.*)/g, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\* (.*)/g, '<li>$1</li>')
            .split('\n').map(l => l.includes('<li>') ? l : `<p>${l}</p>`).join('');
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'dp-message p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 text-slate-400 mr-auto border border-slate-100 dark:border-slate-800 flex gap-1.5 items-center';
        div.innerHTML = '<span class="dp-typing-dot">.</span><span class="dp-typing-dot">.</span><span class="dp-typing-dot">.</span>';
        messagesBox.appendChild(div);
        messagesBox.scrollTop = messagesBox.scrollHeight;
        return div;
    }

    init();
})();
