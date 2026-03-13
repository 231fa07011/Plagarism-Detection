/**
 * PlagiarismDetector
 * Client-side semantic plagiarism detection engine
 * Detects: exact copies, paraphrases, section-wise breakdowns, source highlighting
 */

const PlagiarismDetector = {

    // --- Text Utilities ---

    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2);
    },

    getSentences(text) {
        return text.match(/[^.!?]+[.!?]+/g) || [text];
    },

    // Jaccard similarity between two token sets (0–1)
    jaccardSimilarity(tokensA, tokensB) {
        const setA = new Set(tokensA);
        const setB = new Set(tokensB);
        const intersection = [...setA].filter(t => setB.has(t)).length;
        const union = new Set([...setA, ...setB]).size;
        return union === 0 ? 0 : intersection / union;
    },

    // Check if sentence is an exact or near-exact copy (> 85% overlap)
    isExactMatch(sentenceTokens, sourceTokens) {
        return this.jaccardSimilarity(sentenceTokens, sourceTokens) > 0.85;
    },

    // Check if paraphrased (50%–85% overlap)
    isParaphrase(sentenceTokens, sourceTokens) {
        const sim = this.jaccardSimilarity(sentenceTokens, sourceTokens);
        return sim > 0.45 && sim <= 0.85;
    },

    // --- Section Detector ---
    // Splits text into academic sections by keyword patterns
    detectSections(text) {
        const sections = {
            introduction: '',
            methodology: '',
            results: '',
            conclusion: ''
        };

        const introPattern    = /introduction|background|overview|purpose/i;
        const methodPattern   = /method|approach|procedure|technique|algorithm/i;
        const resultsPattern  = /result|finding|outcome|experiment|analysis|data/i;
        const conclusionPattern = /conclusion|summary|discussion|future work/i;

        const sentences = this.getSentences(text);
        let currentSection = 'introduction';

        sentences.forEach(sentence => {
            if (conclusionPattern.test(sentence)) currentSection = 'conclusion';
            else if (resultsPattern.test(sentence))   currentSection = 'results';
            else if (methodPattern.test(sentence))    currentSection = 'methodology';
            else if (introPattern.test(sentence))     currentSection = 'introduction';

            sections[currentSection] += sentence + ' ';
        });

        // If no section got anything, put everything in introduction
        const totalDetected = Object.values(sections).join('').trim().length;
        if (totalDetected === 0) sections.introduction = text;

        return sections;
    },

    // --- Core Analysis Engine ---
    analyze(inputText) {
        const corpus = window.SampleDocuments?.documents || [];
        if (!corpus.length) {
            return this._emptyResult(inputText);
        }

        const inputSentences = this.getSentences(inputText);
        const sections = this.detectSections(inputText);

        // Collect all matches for each sentence
        const sentenceMatches = [];
        let totalSimilaritySum = 0;
        let matchedSentenceCount = 0;

        inputSentences.forEach(sentence => {
            const sTrimmed = sentence.trim();
            if (sTrimmed.length < 10) return;

            const sentTokens = this.tokenize(sTrimmed);
            let bestMatch = null;
            let bestSim = 0;
            let matchType = null;

            corpus.forEach(doc => {
                const docSentences = this.getSentences(doc.content);
                docSentences.forEach(docSent => {
                    const docTokens = this.tokenize(docSent);
                    const sim = this.jaccardSimilarity(sentTokens, docTokens);

                    if (sim > bestSim) {
                        bestSim = sim;
                        bestMatch = {
                            source: doc.source,
                            title: doc.title,
                            matchedText: docSent.trim(),
                            similarity: Math.round(sim * 100)
                        };
                        if (this.isExactMatch(sentTokens, docTokens)) {
                            matchType = 'exact';
                        } else if (this.isParaphrase(sentTokens, docTokens)) {
                            matchType = 'paraphrase';
                        } else {
                            matchType = 'none';
                        }
                    }
                });
            });

            const isMatch = matchType === 'exact' || matchType === 'paraphrase';
            if (isMatch) matchedSentenceCount++;
            totalSimilaritySum += bestSim;

            sentenceMatches.push({
                sentence: sTrimmed,
                matchType: matchType || 'none',
                similarity: Math.round(bestSim * 100),
                source: bestMatch
            });
        });

        // Overall similarity: weighted average
        const overallSimilarity = inputSentences.length > 0
            ? Math.round((totalSimilaritySum / inputSentences.length) * 100)
            : 0;

        // Section-wise analysis
        const sectionScores = {};
        Object.entries(sections).forEach(([secName, secText]) => {
            if (!secText.trim()) {
                sectionScores[secName] = 0;
                return;
            }
            const secSentences = this.getSentences(secText);
            let secScoreSum = 0;
            secSentences.forEach(secSent => {
                const secTokens = this.tokenize(secSent);
                let maxSim = 0;
                corpus.forEach(doc => {
                    const docTokens = this.tokenize(doc.content);
                    const sim = this.jaccardSimilarity(secTokens, docTokens);
                    if (sim > maxSim) maxSim = sim;
                });
                secScoreSum += maxSim;
            });
            sectionScores[secName] = Math.round((secScoreSum / secSentences.length) * 100);
        });

        // Build top matched sources
        const sourcesMap = {};
        sentenceMatches.forEach(m => {
            if (m.source && (m.matchType === 'exact' || m.matchType === 'paraphrase')) {
                const key = m.source.source;
                if (!sourcesMap[key]) {
                    sourcesMap[key] = { source: m.source.source, title: m.source.title, count: 0, maxSim: 0 };
                }
                sourcesMap[key].count++;
                sourcesMap[key].maxSim = Math.max(sourcesMap[key].maxSim, m.similarity);
            }
        });

        const topSources = Object.values(sourcesMap)
            .sort((a, b) => b.maxSim - a.maxSim)
            .slice(0, 5);

        return {
            overallSimilarity,
            sectionScores,
            sentenceMatches,
            topSources,
            totalSentences: inputSentences.length,
            matchedSentences: matchedSentenceCount
        };
    },

    _emptyResult(text) {
        return {
            overallSimilarity: 0,
            sectionScores: { introduction: 0, methodology: 0, results: 0, conclusion: 0 },
            sentenceMatches: [],
            topSources: [],
            totalSentences: 0,
            matchedSentences: 0
        };
    }
};

window.detector = PlagiarismDetector;
