const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Storage for uploads (in-memory for this simulation)
const upload = multer({ storage: multer.memoryStorage() });

// --- ML Database Corpus (Simulated 500K sources) ---
const Corpus = [
    {
        title: "Artificial Intelligence in Modern Education",
        source: "Journal of Educational Technology",
        content: "Artificial intelligence is revolutionizing the education sector by providing personalized learning experiences. Machine learning algorithms can adapt to individual student needs, offering customized content and pace."
    },
    {
        title: "Introduction to Neural Networks",
        source: "Academic Press CS",
        content: "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes that process information using connectionist approaches."
    },
    {
        title: "The Future of Machine Learning",
        source: "Tech Review Monthly",
        content: "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed."
    },
    {
        title: "Natural Language Processing Overview",
        source: "NLP Insights Quarterly",
        content: "Natural Language Processing combines linguistics and machine learning to enable computers to understand human language. Transformers have revolutionized the field."
    }
];

// --- Utilities ---
const tokenize = (text) => text.toLowerCase().match(/\b(\w+)\b/g) || [];
const jaccardSimilarity = (a, b) => {
    const setA = new Set(tokenize(a));
    const setB = new Set(tokenize(b));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

// --- API Endpoints ---

// 1. Status Endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: "online",
        indexed_documents: 1254320,
        sources: 512000,
        version: "2.4.0-pro"
    });
});

// 2. Analysis Endpoint
app.post('/api/analyze', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    // Simulate Semantic Analysis Logic
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    const sentenceMatches = [];
    let totalSim = 0;

    sentences.forEach(sentence => {
        let maxSim = 0;
        let matchedSource = null;

        Corpus.forEach(doc => {
            const sim = jaccardSimilarity(sentence, doc.content);
            if (sim > maxSim) {
                maxSim = sim;
                matchedSource = doc;
            }
        });

        let matchType = 'none';
        if (maxSim > 85) matchType = 'exact';
        else if (maxSim > 45) matchType = 'paraphrase';

        sentenceMatches.push({
            sentence: sentence.trim(),
            similarity: Math.round(maxSim),
            matchType,
            source: matchedSource ? { source: matchedSource.source, title: matchedSource.title } : null
        });

        totalSim += maxSim;
    });

    const overallSimilarity = Math.round(totalSim / sentences.length);

    // Simulated Section Scores
    const sectionScores = {
        introduction: Math.min(100, overallSimilarity + 10),
        methodology: Math.max(0, overallSimilarity - 15),
        results: Math.max(0, overallSimilarity - 5),
        conclusion: Math.min(100, overallSimilarity + 5)
    };

    const topSources = Corpus.map(doc => {
        let max = 0;
        sentences.forEach(s => {
            const sim = jaccardSimilarity(s, doc.content);
            if (sim > max) max = sim;
        });
        return { ...doc, maxSim: Math.round(max) };
    }).filter(s => s.maxSim > 30).sort((a, b) => b.maxSim - a.maxSim).slice(0, 3);

    res.json({
        overallSimilarity,
        sectionScores,
        sentenceMatches,
        topSources
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
