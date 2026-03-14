from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@router.post("/")
async def chat_with_ai(request: ChatRequest):
    msg = request.message.lower().strip()
    
    # Simulating a high-end AI response structure
    if any(k in msg for k in ["rewrite", "paraphrase", "rephrase", "transform"]):
        response = """### 🖋️ Paraphrasing Assistant
I can help you rewrite sentences to maintain your academic voice while ensuring higher originality.

**How to proceed:**
1.  Paste the sentence or paragraph here.
2.  I will provide 2-3 variations (Formal, Concise, or Descriptive).
3.  Ensure you still cite the original source if the core idea isn't yours.

*Would you like me to try a sample sentence?*"""
                    
    elif any(k in msg for k in ["plagiarism", "match", "similarity", "score", "detection", "highlight"]):
        response = """### 📊 Analyzing Plagiarism Results
I can help you interpret your current scan.

*   **Similarity Score**: This percentage represents how much of your text overlaps with our database.
*   **Color Coding**: 
    - **Red**: Exact word-for-word string match.
    - **Orange**: High semantic similarity (likely paraphrased).
*   **Action Plan**: Focus on rewriting the **Red** sections first.

*Do you have a specific match you're worried about?*"""
                    
    elif any(k in msg for k in ["grammar", "clarity", "tone", "improve", "writing", "vocabulary"]):
        response = """### ✍️ Academic Writing & Grammar
I can help polish your paper for a more professional tone.

**Checklist for success:**
- **Avoid "I" and "Me"**: Use objective language.
- **Active Verbs**: Use "demonstrates" or "illustrates" instead of "shows".
- **Flow**: Ensure your transitions (Furthermore, Consequently, etc.) are logical.

*Paste a section you'd like me to proofread!*"""
                    
    elif any(k in msg for k in ["assignment", "research", "paper", "thesis", "essay", "structuring", "methodology"]):
        response = """### 📚 Research & Assignment Help
I can guide you through the structure of your academic work.

**Standard Research Structure:**
1.  **Abstract**: Your "elevator pitch."
2.  **Introduction**: The "why" and "what."
3.  **Methodology**: The "how."
4.  **Results & Discussion**: The "so what."

*Which section are you currently working on?*"""

    elif any(k in msg for k in ["hello", "hi", "hey", "who are you", "what can you do"]):
        response = """### 👋 Hello! I'm your DetectPro AI
I'm specifically designed to help students with academic writing and integrity.

**I can assist you with:**
- 🖋️ **Paraphrasing** flagged content
- 📊 **Explaining** plagiarism reports
- ✍️ **Improving** grammar and tone
- 📚 **Structuring** research papers

How can I help you today?"""
                    
    else:
        # Polite fallback for unknown questions
        response = """I'm sorry, I didn't quite catch the specific academic help you need. 

**Could you please rephrase your question?** 

I am most effective when helping with **plagiarism analysis**, **paraphrasing**, or **academic writing tips**."""
        
    return {"reply": response}
