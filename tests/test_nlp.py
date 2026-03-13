import sys
import os
# Add the backend directory to sys.path to import app modules
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.nlp import detector

def test_nlp_engine():
    print("Testing NLP Engine...")
    
    # Original text
    original = "Artificial intelligence is revolutionizing the education sector by providing personalized learning experiences."
    
    # Paraphrased version
    paraphrased = "AI is transforming the teaching industry by offering customized educational encounters."
    
    # Unrelated text
    unrelated = "The weather today is quite sunny and pleasant for a walk in the park."

    print(f"Original: {original}")
    print(f"Paraphrased: {paraphrased}")
    
    # Test detection
    results = detector.analyze(paraphrased)
    print(f"Similarity Score: {results['overallSimilarity']}%")
    
    for match in results['sentenceMatches']:
        print(f"Match Type: {match['matchType']} ({match['similarity']}%)")
        if match['source']:
            print(f"Source: {match['source']['title']}")

    if results['overallSimilarity'] > 70:
        print("✅ Paraphrase detection successful!")
    else:
        print("❌ Paraphrase detection failed or score too low.")

if __name__ == "__main__":
    test_nlp_engine()
