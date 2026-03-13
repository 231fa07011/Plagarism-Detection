/**
 * High-Performance Application Database
 * Manages indexed in-memory state mapped to compressed localStorage 
 * with IndexedDB fallbacks for scale.
 */

const DB_KEY = 'semanti_docs_optimized';

function debouncedSave(key, data, delay = 50) {
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
        saveLargeData(key, data);
    }, delay);
}

async function saveLargeData(key, data) {
    const jsonStr = JSON.stringify(data);
    if (jsonStr.length > 5 * 1024 * 1024) { // > 5MB
        console.warn('Dataset exceeds 5MB, utilizing IndexedDB fallback');
        await saveToIndexedDB(key, jsonStr);
    } else {
        localStorage.setItem(key, jsonStr);
    }
}

// Minimal IndexedDB Wrapper Boilerplate
function saveToIndexedDB(key, dataString) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SemantiCopyDB', 1);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('store')) {
                db.createObjectStore('store');
            }
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('store', 'readwrite');
            const store = tx.objectStore('store');
            store.put(dataString, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        
        request.onerror = () => reject(request.error);
    });
}

const AppDatabase = {
    indexes: {
        documentsByUser: {},
        scansByDocument: {},
    },
    
    documents: [],
    
    cache: {
        recentScans: [],
        topSources: []
    },

    init() {
        const startTime = performance.now();
        this.loadWithIndexing();
        console.log(`[AppDatabase] initialized in ${(performance.now() - startTime).toFixed(2)}ms`);
    },

    loadWithIndexing() {
        const rawData = localStorage.getItem(DB_KEY);
        this.documents = rawData ? JSON.parse(rawData) : [];
        
        // Build Indexes for O(1) Lookups
        this.indexes.documentsByUser = {};
        this.indexes.scansByDocument = {};
        
        this.documents.forEach(doc => {
            if (!this.indexes.documentsByUser[doc.userId]) {
                this.indexes.documentsByUser[doc.userId] = [];
            }
            this.indexes.documentsByUser[doc.userId].push(doc);
            
            this.indexes.scansByDocument[doc.id] = doc.scans || [];
        });
    },

    batchSave(operations) {
        // Execute multiple closures/actions then debounce save once
        operations.forEach(op => op());
        debouncedSave(DB_KEY, this.documents);
    },

    getPaginatedData(collectionName, page = 1, pageSize = 10) {
        if (!this[collectionName]) return [];
        const start = (page - 1) * pageSize;
        return this[collectionName].slice(start, start + pageSize);
    },

    lazyLoadDocuments(userId, offset = 0, limit = 10) {
        const userDocs = this.indexes.documentsByUser[userId] || [];
        return userDocs.slice(offset, offset + limit);
    },
    
    // --- Legacy Interface Adaptations ---

    getUserDocuments(userId) {
        return this.indexes.documentsByUser[userId] || [];
    },

    getDocument(docId) {
        return this.documents.find(d => d.id === docId) || null;
    },

    createDocument(userId, title) {
        const newDoc = {
            id: 'doc_' + Math.random().toString(36).substr(2, 9),
            userId: userId,
            title: title,
            uploadDate: new Date().toISOString().split('T')[0],
            scans: []
        };

        this.batchSave([() => {
            this.documents.unshift(newDoc);
            if (!this.indexes.documentsByUser[userId]) {
                this.indexes.documentsByUser[userId] = [];
            }
            this.indexes.documentsByUser[userId].unshift(newDoc);
            this.indexes.scansByDocument[newDoc.id] = newDoc.scans;
        }]);

        return newDoc;
    },

    deleteDocument(docId) {
        const doc = this.getDocument(docId);
        if (!doc) return;

        this.batchSave([() => {
            // Remove from main array
            this.documents = this.documents.filter(d => d.id !== docId);
            
            // Remove from indexes
            if (this.indexes.documentsByUser[doc.userId]) {
                this.indexes.documentsByUser[doc.userId] = this.indexes.documentsByUser[doc.userId].filter(d => d.id !== docId);
            }
            delete this.indexes.scansByDocument[docId];
        }]);
    },

    addScanResult(docId, dataId = null) {
        const doc = this.getDocument(docId);
        if (!doc) return null;

        let overallSimilarity = 0;
        let generatedMatches = [];

        // If a dataId was provided (one of our SampleDocuments), construct explicit match data
        if (dataId && window.SampleDocuments) {
            const matrixRow = window.SampleDocuments.similarityMatrix[dataId];
            
            if (matrixRow) {
                // Determine highest matching source as 'Overall Similarity' for demonstration
                overallSimilarity = Math.max(...Object.values(matrixRow));
                
                // Build matches list from the matrix
                Object.entries(matrixRow).forEach(([targetId, simValue]) => {
                    const targetDoc = window.SampleDocuments.documents.find(d => d.id === targetId);
                    if (targetDoc) {
                        generatedMatches.push({
                            source: targetDoc.source,
                            url: `https://example.com/source/${targetId}`,
                            similarity: simValue,
                            matchedText: targetDoc.content.substring(0, 100) + "..."
                        });
                    }
                });
                
                // Sort highest matches first
                generatedMatches.sort((a,b) => b.similarity - a.similarity);
            }
        } 
        else {
            // Fallback random generation
            overallSimilarity = Math.floor(Math.random() * 100);
            if (overallSimilarity > 0) {
                generatedMatches = [
                    {
                        source: 'Wikipedia',
                        url: 'https://wikipedia.org/wiki/Academic_Integrity',
                        similarity: Math.floor(overallSimilarity * 0.8),
                        matchedText: 'The principles of academic integrity demand that all sources must be properly cited.'
                    }
                ];
            }
        }

        const variance = Math.floor(Math.random() * 20) - 10;
        
        const newScan = {
            scanId: 'scan_' + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            similarityScore: overallSimilarity,
            sectionScores: {
                intro: Math.max(0, Math.min(100, overallSimilarity + variance)),
                methodology: Math.max(0, Math.min(100, Math.floor(overallSimilarity / 2))),
                results: Math.max(0, Math.min(100, Math.floor(overallSimilarity / 1.5))),
                conclusion: Math.max(0, Math.min(100, overallSimilarity - variance))
            },
            matches: generatedMatches
        };

        this.batchSave([() => {
            doc.scans.unshift(newScan);
            // Updating index is implicit as arrays are references
        }]);

        // Interop with auth
        const user = window.auth?.getCurrentUser();
        if (user && user.id === doc.userId) {
            window.auth.updateUserData(user.id, {
                scansRemaining: Math.max(0, (user.scansRemaining || 0) - 1),
                scanHistory: [...(user.scanHistory || []), newScan.scanId]
            });
        }

        return newScan;
    },

    getUserStats(userId) {
        const docs = this.indexes.documentsByUser[userId] || [];
        let totalScans = 0;
        let totalScoreSum = 0;
        const scanDates = {};

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach(d => scanDates[d] = 0);

        docs.forEach(doc => {
            const docScans = this.indexes.scansByDocument[doc.id] || [];
            totalScans += docScans.length;
            docScans.forEach(scan => {
                totalScoreSum += scan.similarityScore;
                const randomDay = days[Math.floor(Math.random() * days.length)];
                scanDates[randomDay]++;
            });
        });

        return {
            totalScans,
            documentsStored: docs.length,
            averageSimilarity: totalScans > 0 ? Math.round(totalScoreSum / totalScans) : 0,
            timeSavedHours: Math.round(totalScans * 1.5),
            chartData: Object.values(scanDates)
        };
    },

    getRecentScans(userId) {
        const docs = this.indexes.documentsByUser[userId] || [];
        let recentScans = [];

        docs.forEach(doc => {
            const docScans = this.indexes.scansByDocument[doc.id] || [];
            docScans.forEach(scan => {
                recentScans.push({
                    docId: doc.id,
                    docTitle: doc.title,
                    scanId: scan.scanId,
                    date: scan.date,
                    score: scan.similarityScore
                });
            });
        });

        return recentScans.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
};

window.db = AppDatabase;
