/**
 * Dashboard Logic Controller - Clean Version
 */



document.addEventListener('DOMContentLoaded', () => {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const user = auth.getCurrentUser();
    const navName = document.getElementById('nav-name');
    const navAvatar = document.getElementById('nav-avatar');
    const welcomeName = document.getElementById('welcome-name');
    if (navName) navName.textContent = user.fullName;
    if (navAvatar) navAvatar.textContent = user.fullName.charAt(0).toUpperCase();
    if (welcomeName) welcomeName.textContent = `Welcome back, ${user.fullName.split(' ')[0]} 👋`;

    db.init();
    refreshDashboard(user.id);
    checkBackendStatus();
});

async function checkBackendStatus() {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.database-status span:last-child');

    try {
        const response = await fetch('http://localhost:3000/api/status');
        const data = await response.json();
        if (data.status === 'online') {
            indicator.classList.add('online');
            statusText.innerHTML = `<strong>ML Database Online</strong> • ${data.indexed_documents.toLocaleString()} documents indexed • ${data.sources.toLocaleString()} academic sources`;
        }
    } catch (err) {
        console.warn("Backend offline, falling back to local engine.");
        indicator.classList.remove('online');
        statusText.innerHTML = `<span style="color:#ef4444"><strong>Offline Mode</strong></span> • Local engine active • Using cached local corpus`;
    }
}

// ===================== DASHBOARD REFRESH =====================
function refreshDashboard(userId) {
    const stats = db.getUserStats(userId);
    const recentScans = db.getRecentScans(userId);
    const docs = db.getUserDocuments(userId);

    const el = id => document.getElementById(id);
    if (el('stat-scans')) el('stat-scans').textContent = stats.totalScans;
    if (el('stat-docs')) el('stat-docs').textContent = stats.documentsStored;
    if (el('stat-similarity')) el('stat-similarity').textContent = `${stats.averageSimilarity}%`;
    if (el('stat-time')) el('stat-time').textContent = `${stats.timeSavedHours}h`;

    // initChart(stats.chartData); // REPLACED WITH SIDE-BY-SIDE
    renderScansTable(recentScans);
    renderDocsTable(docs);
    renderTopSources(recentScans);
}

// ===================== SIDE-BY-SIDE COMPARISON =====================
function renderComparisonReport(docId, scanId) {
    const doc = db.getDocument(docId);
    if (!doc) return;
    const scan = doc.scans && doc.scans.find(s => s.scanId === scanId);
    if (!scan) return;

    const subView = document.getElementById('submitted-text-view');
    const oriView = document.getElementById('original-text-view');
    if (!subView || !oriView) return;

    // Simulate "Full Document" view by joining sentences or using the first match if it exists
    const matches = scan.sentenceMatches || [];
    const flagged = matches.filter(m => m.matchType !== 'none');

    if (flagged.length > 0) {
        const m = flagged[0];
        subView.innerHTML = `
            <div style="background: rgba(239,68,68,0.1); padding: 5px; border-radius: 4px; border-left: 3px solid #ef4444;">
                ${m.sentence}
            </div>
            <p style="margin-top: 10px; opacity: 0.6;">... ${matches.length > 1 ? matches[1].sentence : ""} ...</p>
        `;
        oriView.innerHTML = m.source ? `
            <div style="background: rgba(16,185,129,0.1); padding: 5px; border-radius: 4px; border-left: 3px solid #10b981;">
                "${m.sentence}"
            </div>
            <p style="margin-top: 5px; font-size: 0.75rem; color: var(--accent-primary);">📚 Source: ${m.source.source}</p>
            <p style="margin-top: 10px; opacity: 0.6;">... matching context from source document ...</p>
        ` : 'Source text not available for this segment.';
    } else {
        subView.innerHTML = '<p style="color:var(--text-secondary)">This document appeared to be 100% original. No side-by-side comparison needed.</p>';
        oriView.innerHTML = 'N/A';
    }
}

// ===================== TABLE RENDERERS =====================
function renderScansTable(scans) {
    const tbody = document.getElementById('scans-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!scans.length) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-secondary)">No scans yet. Click <strong>New Scan</strong> to start!</td></tr>';
        return;
    }

    scans.slice(0, 7).forEach(scan => {
        let cls = 'score-ok';
        if (scan.score >= 80) cls = 'score-high';
        else if (scan.score >= 50) cls = 'score-med';
        else if (scan.score >= 25) cls = 'score-low';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="doc-cell"><i class="fa-solid fa-file-lines doc-icon"></i>${scan.docTitle}</div></td>
            <td>${scan.date}</td>
            <td><span class="score-badge ${cls}">${scan.score}%</span></td>
            <td>
                <div class="action-btns">
                    <button class="icon-btn" title="View" onclick="viewScanById('${scan.docId}','${scan.scanId}')"><i class="fa-solid fa-eye"></i></button>
                    <button class="icon-btn delete" title="Delete" onclick="deleteScan('${scan.docId}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>`;
        tbody.appendChild(tr);
    });
}

function renderDocsTable(docs) {
    const tbody = document.getElementById('docs-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!docs.length) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--text-secondary);padding:1rem">No documents yet.</td></tr>';
        return;
    }

    docs.slice(0, 6).forEach(doc => {
        const scanCount = doc.scans ? doc.scans.length : 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="doc-cell">
                    <i class="fa-solid fa-file-lines doc-icon"></i>
                    <div>
                        <div style="font-weight:600">${doc.title}</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary)">${scanCount} scan(s)</div>
                    </div>
                </div>
            </td>
            <td><button class="btn btn-secondary btn-sm" onclick="quickScan('${doc.id}')">Scan</button></td>`;
        tbody.appendChild(tr);
    });
}

function renderTopSources(scans) {
    const list = document.getElementById('sources-list');
    if (!list) return;
    const map = {};

    scans.forEach(scan => {
        const docs = db.getUserDocuments(auth.getCurrentUser().id);
        const doc = docs.find(d => d.id === scan.docId);
        if (!doc) return;
        const scanData = doc.scans && doc.scans.find(s => s.scanId === scan.scanId);
        if (!scanData || !scanData.matches) return;
        scanData.matches.forEach(m => {
            map[m.source] = (map[m.source] || 0) + 1;
        });
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
    list.innerHTML = '';
    if (!sorted.length) {
        list.innerHTML = '<li style="padding:1rem;color:var(--text-secondary);text-align:center">No sources yet.</li>';
        return;
    }
    sorted.forEach(([src, count]) => {
        list.innerHTML += `
            <li>
                <a href="#" class="sidebar-link" style="justify-content:space-between">
                    <span><i class="fa-solid fa-link" style="margin-right:0.5rem;color:var(--text-secondary)"></i>${src}</span>
                    <span style="background:var(--surface-color-hover);padding:0.1rem 0.5rem;border-radius:10px;font-size:0.75rem">${count}</span>
                </a>
            </li>`;
    });
}

// ===================== MODAL CONTROLS =====================
function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// Close modal on backdrop click
document.addEventListener('click', e => {
    if (e.target.classList.contains('dash-modal')) {
        e.target.classList.remove('active');
    }
});

// ===================== SCAN ACTIONS =====================
function startNewScan() {
    const btn = document.getElementById('start-scan-btn');
    const fileInput = document.getElementById('file-input');
    const pasteInput = document.getElementById('paste-input');

    const pastedText = pasteInput.value.trim();
    const hasFile = fileInput && fileInput.files.length > 0;

    if (!hasFile && !pastedText) {
        alert('Please upload a file (TXT, PDF, DOCX) or paste text to scan.');
        return;
    }

    const origHtml = btn.innerHTML;
    btn.disabled = true;

    const runAnalysis = async (textToAnalyze, title) => {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        const user = auth.getCurrentUser();
        let finalText = textToAnalyze;
        let finalTitle = title;

        if (!finalText) {
            const samples = window.SampleDocuments?.documents || [];
            const s = samples[Math.floor(Math.random() * samples.length)];
            finalText = s?.content || 'Sample document for analysis.';
            finalTitle = finalTitle || s?.title || 'Sample_Analysis.txt';
        }

        let analysis = null;

        try {
            // Attempt to use Backend API
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: finalText })
            });
            if (response.ok) {
                analysis = await response.json();
            } else {
                throw new Error("Server error");
            }
        } catch (err) {
            console.warn("Server unavailable, using local detector.");
            analysis = window.detector ? window.detector.analyze(finalText) : null;
        }

        const doc = db.createDocument(user.id, finalTitle);
        const scan = db.addScanResult(doc.id, null);

        if (analysis && scan) {
            scan.similarityScore = analysis.overallSimilarity;
            scan.sectionScores = analysis.sectionScores;
            scan.matches = analysis.topSources.map(s => ({
                source: s.source,
                url: s.url || `https://scholar.google.com/scholar?q=${encodeURIComponent(s.source)}`,
                similarity: s.maxSim,
                matchedText: s.title
            }));
            scan.sentenceMatches = analysis.sentenceMatches;
        }

        btn.innerHTML = origHtml;
        btn.disabled = false;
        if (fileInput) fileInput.value = '';
        pasteInput.value = '';
        document.getElementById('file-name-display') && (document.getElementById('file-name-display').innerHTML = '');

        closeModal('upload-modal');
        refreshDashboard(user.id);
        renderComparisonReport(doc.id, scan.scanId);
        openResultsEnhanced(doc, scan, analysis);
    };

    if (hasFile) {
        const file = fileInput.files[0];
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reading File...';
        if (window.FileExtractor) {
            window.FileExtractor.extract(file)
                .then(text => runAnalysis(text, file.name))
                .catch(err => {
                    btn.innerHTML = origHtml;
                    btn.disabled = false;
                    alert('Error reading file: ' + err.message);
                });
        } else {
            runAnalysis(pastedText, file.name);
        }
    } else {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
        runAnalysis(pastedText, 'Pasted_Text.txt');
    }
}

function quickScan(docId) {
    const user = auth.getCurrentUser();
    const samples = window.SampleDocuments?.documents || [];
    const randomSample = samples.length ? samples[Math.floor(Math.random() * samples.length)] : null;
    const scan = db.addScanResult(docId, randomSample?.id);
    refreshDashboard(user.id);
    viewScanById(docId, scan.scanId);
}

function deleteScan(docId) {
    if (confirm('Delete this document and all its scan history?')) {
        db.deleteDocument(docId);
        refreshDashboard(auth.getCurrentUser().id);
    }
}

// ===================== RESULTS MODAL =====================
function openResultsEnhanced(doc, scan, analysis) {
    document.getElementById('res-title').textContent = `Scan Results: ${doc.title}`;

    const overall = analysis ? analysis.overallSimilarity : (scan?.similarityScore || 0);
    const sectionScores = analysis ? analysis.sectionScores : (scan?.sectionScores || {});
    const sentenceMatches = analysis ? analysis.sentenceMatches : [];
    const topSources = analysis ? analysis.topSources : [];

    // Score Circle
    const circle = document.getElementById('res-circle');
    const scoreTxt = document.getElementById('res-score');
    let col = '#ef4444';
    if (overall < 25) col = '#10b981';
    else if (overall < 50) col = '#eab308';
    else if (overall < 80) col = '#f97316';

    if (circle) circle.style.background = `conic-gradient(${col} ${overall}%, var(--surface-color-hover) 0)`;
    if (scoreTxt) { scoreTxt.textContent = `${overall}%`; scoreTxt.style.color = col; }

    // Section Bars
    const bars = document.getElementById('res-bars');
    if (bars) {
        bars.innerHTML = '';
        const labels = { introduction: 'Introduction', methodology: 'Methodology', results: 'Results', conclusion: 'Conclusion' };
        Object.entries(sectionScores).forEach(([k, score]) => {
            let c = '#ef4444';
            if (score < 25) c = '#10b981';
            else if (score < 50) c = '#eab308';
            else if (score < 80) c = '#f97316';
            bars.innerHTML += `
                <div class="section-bar">
                    <div class="bar-label"><span>${labels[k] || k}</span><span style="color:${c};font-weight:600">${score}%</span></div>
                    <div class="bar-track"><div class="bar-fill" style="width:${score}%;background:${c}"></div></div>
                </div>`;
        });
    }

    // Highlighted Sentences
    const highlights = document.getElementById('res-highlights');
    if (highlights) {
        highlights.innerHTML = '';
        const flagged = sentenceMatches.filter(m => m.matchType !== 'none').slice(0, 10);
        if (!flagged.length) {
            highlights.innerHTML = '<p style="color:var(--text-secondary);text-align:center;padding:1rem">✅ No suspicious sentences detected in this text.</p>';
        } else {
            flagged.forEach(m => {
                const isExact = m.matchType === 'exact';
                const cls = isExact ? 'highlight-exact' : 'highlight-para';
                const lbl = isExact ? '🔴 Exact Copy' : '🟠 Paraphrase';
                const c = isExact ? '#ef4444' : '#f97316';
                highlights.innerHTML += `
                    <div class="${cls}">
                        <span class="highlight-label" style="color:${c}">${lbl} — ${m.similarity}% match</span>
                        "${m.sentence}"
                        ${m.source ? `<div class="highlight-source">📚 Source: ${m.source.source}</div>` : ''}
                    </div>`;
            });
        }
    }

    // Sources Table
    const srcTbody = document.getElementById('res-sources');
    if (srcTbody) {
        srcTbody.innerHTML = '';
        if (!topSources.length) {
            srcTbody.innerHTML = '<tr><td colspan="2" style="text-align:center;color:var(--text-secondary);padding:1rem">✅ No matching sources. Content appears original.</td></tr>';
        } else {
            topSources.forEach(s => {
                srcTbody.innerHTML += `
                    <tr>
                        <td><strong>${s.source}</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">${s.title}</span></td>
                        <td><span class="score-badge score-high">${s.maxSim}%</span></td>
                    </tr>`;
            });
        }
    }

    openModal('results-modal');
}

// Legacy: load stored scan data into the results modal
function viewScanById(docId, scanId) {
    if (!docId || !scanId) return;
    window.location.href = `documents.html?docId=${docId}&scanId=${scanId}`;
}

function handleLogout() {
    auth.logout();
    window.location.href = 'index.html';
}
