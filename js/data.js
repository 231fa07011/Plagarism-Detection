/**
 * Pre-loaded documents for instant analysis
 * Bypasses network requests and heavy parsing to offer under 50ms results
 */

const SampleDocuments = {
    documents: [
        {
            id: 'doc1',
            title: 'AI in Education Research Paper.docx',
            content: `Artificial intelligence is revolutionizing the education sector by providing personalized learning experiences. Machine learning algorithms can adapt to individual student needs, offering customized content and pace. This technology enables teachers to identify learning gaps and provide targeted interventions. Studies show that AI-powered tutoring systems improve student outcomes by 30%.`,
            hash: '7d8f9e3a2b1c4d5e6f7a8b9c0d1e2f3a',
            wordCount: 52,
            source: 'Journal of Educational Technology, 2024'
        },
        {
            id: 'doc2',
            title: 'Machine Learning Basics.txt',
            content: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. Algorithms build mathematical models based on training data to make predictions without being explicitly programmed. Supervised learning uses labeled data, while unsupervised learning finds patterns in unlabeled data. Deep learning uses neural networks with multiple layers.`,
            hash: '8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
            wordCount: 58,
            source: 'Stanford CS229 Lecture Notes'
        },
        {
            id: 'doc3',
            title: 'Neural Networks Explained.pdf',
            content: `Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information using connectionist approaches. Each connection transmits signals to other neurons, which process the signal and signal further neurons. Deep neural networks have multiple hidden layers between input and output.`,
            hash: '9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
            wordCount: 48,
            source: 'Deep Learning Book, Goodfellow et al.'
        },
        {
            id: 'doc4',
            title: 'Natural Language Processing.docx',
            content: `Natural Language Processing (NLP) combines linguistics and machine learning to enable computers to understand human language. Applications include sentiment analysis, machine translation, and text summarization. Transformer models like BERT and GPT have revolutionized the field by capturing contextual relationships between words.`,
            hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
            wordCount: 42,
            source: 'ACL Anthology'
        },
        {
            id: 'doc5',
            title: 'Plagiarism Detection Methods.pdf',
            content: `Traditional plagiarism detection relies on string matching algorithms to find exact copies. Modern semantic plagiarism detection uses word embeddings and transformer models to identify paraphrased content. These systems compare meaning rather than just text, catching rewritten sentences that maintain the original ideas.`,
            hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
            wordCount: 45,
            source: 'IEEE Transactions on Education'
        }
    ],
    
    // Pre-computed similarity matrix for instant comparison
    similarityMatrix: {
        'doc1': { 'doc2': 15, 'doc3': 8, 'doc4': 22, 'doc5': 45 },
        'doc2': { 'doc1': 15, 'doc3': 35, 'doc4': 18, 'doc5': 12 },
        'doc3': { 'doc1': 8, 'doc2': 35, 'doc4': 25, 'doc5': 10 },
        'doc4': { 'doc1': 22, 'doc2': 18, 'doc3': 25, 'doc5': 30 },
        'doc5': { 'doc1': 45, 'doc2': 12, 'doc3': 10, 'doc4': 30 }
    }
};

window.SampleDocuments = SampleDocuments;
