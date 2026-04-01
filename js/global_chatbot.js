/*
   DetectPro AI Chatbot
   ChatGPT-style, no login, no API key — just ask & get answers
   Free AI via Pollinations.ai
*/
(function () {

    // ── Styles ───────────────────────────────────────────────
    const style = document.createElement('style');
    style.innerHTML = `
        #dp-fab {
            position: fixed; bottom: 28px; right: 28px; z-index: 9999;
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg,#2563eb,#1d4ed8);
            color: #fff; border: none; cursor: pointer;
            box-shadow: 0 8px 30px rgba(37,99,235,0.45);
            display: flex; align-items: center; justify-content: center;
            font-size: 22px;
            transition: transform .35s cubic-bezier(.175,.885,.32,1.275), box-shadow .3s;
        }
        #dp-fab:hover { transform: scale(1.12); box-shadow: 0 12px 40px rgba(37,99,235,0.55); }

        #dp-box {
            position: fixed; bottom: 102px; right: 28px; z-index: 9999;
            width: 420px; max-width: calc(100vw - 32px);
            height: 580px; max-height: calc(100vh - 130px);
            border-radius: 22px;
            background: #fff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 25px 60px rgba(0,0,0,0.18);
            display: flex; flex-direction: column; overflow: hidden;
            transition: opacity .3s, transform .35s cubic-bezier(.4,0,.2,1);
        }
        #dp-box.dp-hidden { opacity:0; transform: translateY(18px) scale(0.97); pointer-events:none; }
        .dark #dp-box   { background:#0f172a; border-color:#1e293b; }

        /* Header */
        #dp-head {
            background: linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);
            padding: 16px 18px; display: flex; align-items: center; gap: 12px;
            flex-shrink: 0;
        }
        #dp-head-avatar {
            width: 38px; height: 38px; border-radius: 12px;
            background: rgba(255,255,255,.18);
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; color: #fff; flex-shrink: 0;
        }
        #dp-head-info { flex: 1; }
        #dp-head-title  { font-weight:800; font-size:14px; color:#fff; font-family:Inter,system-ui,sans-serif; }
        #dp-head-status { font-size:10px; color:rgba(255,255,255,.75); font-weight:600; font-family:Inter,system-ui,sans-serif; display:flex; align-items:center; gap:5px; margin-top:2px; }
        .dp-dot { width:7px; height:7px; border-radius:50%; background:#4ade80; animation: dpPulse 2s infinite; }
        @keyframes dpPulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }

        #dp-head-btns { display:flex; gap:4px; }
        .dp-hbtn {
            width:30px; height:30px; border-radius:8px; border:none; cursor:pointer;
            background:rgba(255,255,255,.12); color:#fff; font-size:12px;
            display:flex; align-items:center; justify-content:center;
            transition: background .2s;
        }
        .dp-hbtn:hover { background:rgba(255,255,255,.25); }

        /* Messages */
        #dp-msgs {
            flex:1; overflow-y:auto; padding:10px 16px; display:flex;
            flex-direction:column; gap:14px;
        }
        #dp-msgs::-webkit-scrollbar { width:4px; }
        #dp-msgs::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
        .dark #dp-msgs::-webkit-scrollbar-thumb { background:#334155; }

        .dp-msg {
            max-width:88%; font-size:13.5px; line-height:1.65;
            font-family:Inter,system-ui,sans-serif;
            animation: dpSlide .25s ease-out;
        }
        @keyframes dpSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .dp-msg-user {
            align-self:flex-end;
            background: linear-gradient(135deg,#2563eb,#1d4ed8);
            color:#fff; padding:11px 16px; border-radius:18px 18px 4px 18px;
            font-weight:600; word-break:break-word;
        }
        .dp-msg-ai {
            align-self:flex-start;
            background:#f1f5f9; color:#1e293b;
            padding:12px 16px; border-radius:18px 18px 18px 4px;
            word-break:break-word;
        }
        .dark .dp-msg-ai { background:#1e293b; color:#e2e8f0; }

        .dp-msg-ai h3     { font-weight:800; font-size:13px; color:#1e3a8a; margin-bottom:5px; }
        .dp-msg-ai p      { margin-bottom:5px; }
        .dp-msg-ai ul     { margin-left:16px; list-style:disc; margin-bottom:6px; }
        .dp-msg-ai li     { margin-bottom:3px; }
        .dp-msg-ai strong { font-weight:700; }
        .dp-msg-ai code   { background:#e2e8f0; padding:1px 5px; border-radius:4px; font-size:11.5px; font-family:monospace; }
        .dp-msg-ai pre    { background:#e2e8f0; padding:10px 12px; border-radius:10px; font-size:11px; overflow-x:auto; margin:6px 0; font-family:monospace; }
        .dark .dp-msg-ai h3   { color:#93c5fd; }
        .dark .dp-msg-ai code { background:#0f172a; }
        .dark .dp-msg-ai pre  { background:#0f172a; color:#e2e8f0; }

        /* Typing */
        .dp-typing { display:flex; gap:5px; align-items:center; padding:12px 16px; }
        .dp-tdot { width:7px; height:7px; border-radius:50%; background:#94a3b8; animation:dpBounce 1.4s infinite; }
        .dp-tdot:nth-child(2){animation-delay:.2s}
        .dp-tdot:nth-child(3){animation-delay:.4s}
        @keyframes dpBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}

        /* Input */
        #dp-foot {
            padding:12px 14px; border-top:1px solid #f1f5f9;
            background:#fff; flex-shrink:0;
        }
        .dark #dp-foot { background:#0f172a; border-color:#1e293b; }
        #dp-form { display:flex; gap:8px; align-items:flex-end; }
        #dp-input {
            flex:1; background:#f8fafc; border:2px solid #e2e8f0;
            border-radius:14px; padding:10px 14px; font-size:13px;
            font-family:Inter,system-ui,sans-serif; outline:none;
            resize:none; max-height:100px; color:#1e293b;
            transition: border-color .2s;
            line-height:1.5;
        }
        .dark #dp-input { background:#1e293b; border-color:#334155; color:#e2e8f0; }
        #dp-input:focus { border-color:#2563eb; }
        #dp-input::placeholder { color:#94a3b8; }
        #dp-send-btn {
            width:40px; height:40px; flex-shrink:0;
            border-radius:12px; border:none; cursor:pointer;
            background:#2563eb; color:#fff; font-size:14px;
            display:flex; align-items:center; justify-content:center;
            transition: background .2s, transform .15s;
            box-shadow:0 4px 12px rgba(37,99,235,.35);
        }
        #dp-send-btn:hover { background:#1d4ed8; }
        #dp-send-btn:active { transform:scale(.92); }
        #dp-send-btn:disabled { background:#94a3b8; cursor:not-allowed; box-shadow:none; }
        #dp-foot-note { text-align:center; font-size:9px; color:#94a3b8; font-family:Inter,system-ui,sans-serif; font-weight:600; letter-spacing:.05em; text-transform:uppercase; margin-top:7px; }

        @media(max-width:480px){
            #dp-box { right:8px; bottom:90px; width:calc(100vw - 16px); height:510px; }
            #dp-fab { right:16px; bottom:16px; }
        }
    `;
    document.head.appendChild(style);

    // ── DOM Inject ────────────────────────────────────────────
    const root = document.createElement('div');
    root.innerHTML = `
    <button id="dp-fab" title="Chat with DetectPro AI">
        <i class="fa-solid fa-robot"></i>
    </button>

    <div id="dp-box" class="dp-hidden">
        <div id="dp-head">
            <div id="dp-head-avatar"><i class="fa-solid fa-brain"></i></div>
            <div id="dp-head-info">
                <div id="dp-head-title">DetectPro AI</div>
                <div id="dp-head-status"><span class="dp-dot"></span> Always ready · Free AI</div>
            </div>
            <div id="dp-head-btns">
                <button class="dp-hbtn" id="dp-clear-btn" title="New Chat"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="dp-hbtn" id="dp-close-btn" title="Close"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>

        <div id="dp-msgs"></div>

        <div id="dp-foot">
            <div id="dp-form">
                <textarea id="dp-input" rows="1" placeholder="Ask anything..."></textarea>
                <button id="dp-send-btn" title="Send"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
            <div id="dp-foot-note">Powered by Pollinations AI · No login required</div>
        </div>
    </div>
    `;
    document.body.appendChild(root);

    // ── Config ────────────────────────────────────────────────
    const SYSTEM = `You are DetectPro AI, a helpful, knowledgeable assistant specializing in academic integrity and plagiarism detection. You give clear, accurate, well-structured answers. You can help with:
- Plagiarism detection, explaining similarity scores
- Academic writing, paraphrasing, grammar
- Research tips and citation guidance
- General knowledge questions
Be clear, concise, and always give a complete, accurate answer.`;

    // ── State ─────────────────────────────────────────────────
    let isOpen    = false;
    let isBusy    = false;
    let history   = JSON.parse(localStorage.getItem('dp_history') || '[]');

    // ── Refs ──────────────────────────────────────────────────
    const fab      = document.getElementById('dp-fab');
    const box      = document.getElementById('dp-box');
    const msgs     = document.getElementById('dp-msgs');
    const input    = document.getElementById('dp-input');
    const sendBtn  = document.getElementById('dp-send-btn');
    const clearBtn = document.getElementById('dp-clear-btn');
    const closeBtn = document.getElementById('dp-close-btn');

    // ── Boot ──────────────────────────────────────────────────
    function boot() {
        // Restore or welcome
        if (history.length === 0) {
            pushBotBubble(`👋 **Hi! I'm DetectPro AI.**\n\nAsk me anything — plagiarism, academic writing, research tips, or any general question. I'll give you a clear, accurate answer.\n\nJust type below! 💬`);
        } else {
            history.forEach(m => renderBubble(m.role === 'user' ? 'user' : 'ai', m.content, false));
        }

        // Events
        fab.onclick      = toggle;
        closeBtn.onclick = () => setOpen(false);
        clearBtn.onclick = clearChat;
        sendBtn.onclick  = send;

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
        });
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 100) + 'px';
        });

        scrollBottom();
    }

    function toggle() { setOpen(!isOpen); }
    function setOpen(v) {
        isOpen = v;
        box.classList.toggle('dp-hidden', !v);
        if (v) { scrollBottom(); input.focus(); }
    }

    function clearChat() {
        if (!confirm('Start a new chat?')) return;
        history = [];
        localStorage.removeItem('dp_history');
        msgs.innerHTML = '';
        pushBotBubble('New chat started! What would you like to know?');
    }

    // ── Send ──────────────────────────────────────────────────
    async function send() {
        const q = input.value.trim();
        if (!q || isBusy) return;

        isBusy = true;
        sendBtn.disabled = true;
        input.value = '';
        input.style.height = 'auto';

        // User bubble
        renderBubble('user', q);
        history.push({ role: 'user', content: q });
        save();

        // Typing indicator
        const typingEl = addTyping();

        try {
            const reply = await callAI(q);
            typingEl.remove();
            renderBubble('ai', reply);
            history.push({ role: 'assistant', content: reply });
            save();
        } catch (err) {
            typingEl.remove();
            renderBubble('ai', `⚠️ **Couldn't get a response.**\n\n${err.message}\n\n→ Try a different model above, or rephrase your question.`);
        }

        isBusy = false;
        sendBtn.disabled = false;
        input.focus();
    }

    async function callAI(question) {
        // Build short context (last 6 exchanges)
        const ctx = history.slice(-6).map(m =>
            (m.role === 'user' ? 'Human: ' : 'AI: ') + m.content
        ).join('\n');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        let response;
        try {
            response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: question, context: ctx }),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || `Server error ${response.status}`);
        }

        if (!data.reply || data.reply.trim().length < 2) {
            throw new Error('Empty response. Please try again.');
        }

        return data.reply.trim();
    }

    // ── Render ────────────────────────────────────────────────
    function renderBubble(role, text, scroll = true) {
        const div = document.createElement('div');
        div.className = `dp-msg ${role === 'user' ? 'dp-msg-user' : 'dp-msg-ai'}`;
        if (role === 'ai') div.innerHTML = md(text);
        else div.textContent = text;
        msgs.appendChild(div);
        if (scroll) scrollBottom();
        return div;
    }

    function pushBotBubble(text) {
        renderBubble('ai', text);
    }

    function addTyping() {
        const div = document.createElement('div');
        div.className = 'dp-msg dp-msg-ai dp-typing';
        div.innerHTML = '<span class="dp-tdot"></span><span class="dp-tdot"></span><span class="dp-tdot"></span>';
        msgs.appendChild(div);
        scrollBottom();
        return div;
    }

    function scrollBottom() {
        msgs.scrollTop = msgs.scrollHeight;
    }

    function save() {
        // Keep last 40 messages max
        if (history.length > 40) history = history.slice(-40);
        localStorage.setItem('dp_history', JSON.stringify(history));
    }

    // ── Markdown parser ───────────────────────────────────────
    function md(text) {
        return text
            .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
            .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .split('\n')
            .map(l => {
                const t = l.trim();
                if (!t) return '';
                if (/^<(h[123]|ul|li|pre|p)/.test(t)) return t;
                return `<p>${t}</p>`;
            })
            .join('');
    }

    boot();
})();
