import spacy
from sentence_transformers import SentenceTransformer, util
import torch
from app.core.config import settings

class PlagiarismDetector:
    def __init__(self):
        # Using a small, efficient model for semantic similarity
        self.doc_model = SentenceTransformer(settings.NLP_MODEL_NAME)
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            # Note: In production, models should be pre-downloaded
            self.nlp = None

    def analyze(self, text: str):
        if not self.nlp:
            # Basic fallback if spacy isn't loaded
            sentences = [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if len(s.strip()) > 5]
        else:
            doc = self.nlp(text)
            sentences = [sent.text.strip() for sent in doc.sents if len(sent.text.strip()) > 5]
        
        if not sentences:
            return {"overallSimilarity": 0, "sentenceMatches": []}

        # Mock Academic Corpus for demonstration
        mock_corpus = [
            "Artificial intelligence is revolutionizing the education sector by providing personalized learning experiences.",
            "Neural networks are computing systems inspired by biological neural networks.",
            "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience.",
            "Natural language processing combines linguistics and machine learning to understand human language.",
            "The adoption of cloud computing in healthcare has facilitated real-time data access and improved patient outcomes.",
            "Blockchain technology offers a decentralized approach to data security, ensuring integrity and transparency.",
            "Quantum computing utilizes qubits to perform complex calculations at speeds unattainable by classical computers.",
            "Internet of Things (IoT) devices are becoming increasingly integrated into smart home environments, monitoring energy consumption.",
            "Data privacy remains a significant challenge as organizations collect vast amounts of consumer information.",
            "Ethical considerations in AI development are crucial to prevent algorithmic bias and ensure fairness."
        ]
        
        sentence_embeddings = self.doc_model.encode(sentences, convert_to_tensor=True)
        corpus_embeddings = self.doc_model.encode(mock_corpus, convert_to_tensor=True)
        
        cosine_scores = util.cos_sim(sentence_embeddings, corpus_embeddings)
        
        results = []
        total_sim = 0
        
        for i, sentence in enumerate(sentences):
            max_score, match_idx = torch.max(cosine_scores[i], dim=0)
            score = max_score.item()
            
            match_type = "none"
            if score > settings.SIMILARITY_THRESHOLD_EXACT:
                match_type = "exact"
            elif score > settings.SIMILARITY_THRESHOLD_PARA:
                match_type = "paraphrase"
                
            improvement = None
            if match_type != "none":
                # Simulated AI rewrite logic
                words = sentence.split()
                if len(words) > 3:
                    # Very basic simulation: Reverse some words or substitute
                    improvement = f"AI Rewrite: {sentence[::-1][:50]}... (Simulated)"
                    # Better simulation for the demo:
                    if "neural networks" in sentence.lower():
                        improvement = "Computational neural architectures represent information processing systems that draw inspiration from biological neural frameworks."
                    elif "artificial intelligence" in sentence.lower():
                        improvement = "Synthetic cognition represents a paradigm shift in computational methodologies."
                    else:
                        improvement = f"Refined version: This section has been synthetically restructured to ensure academic uniqueness while preserving the core premise of '{sentence[:20]}...'."

            results.append({
                "sentence": sentence,
                "similarity": round(score * 100, 2),
                "matchType": match_type,
                "improvement": improvement,
                "source": {
                    "title": "Academic Source " + str(match_idx.item() + 1),
                    "text": mock_corpus[match_idx]
                } if match_type != "none" else None
            })
            total_sim += score
            
        return {
            "overallSimilarity": round((total_sim / len(sentences)) * 100, 2),
            "sentenceMatches": results,
            "sectionScores": {
                "introduction": round(total_sim * 25, 2), # Simplified mock breakdown
                "methodology": round(total_sim * 15, 2),
                "results": round(total_sim * 10, 2),
                "conclusion": round(total_sim * 20, 2)
            }
        }

detector = PlagiarismDetector()
