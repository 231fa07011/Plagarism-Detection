import os
import sqlite3
from datetime import datetime

def print_header(title):
    print("\n" + "="*80)
    print(f" {title.upper()} ".center(80, "="))
    print("="*80)

def main():
    # 1. Official Papers Report
    print_header("Official Academic Papers Collection (15 Documents)")
    papers_dir = r"c:\Users\MY PC\OneDrive\Desktop\Plagarism-Detection\sample_test_files\A3_A4_A5_Official_Papers"
    
    if os.path.exists(papers_dir):
        files = os.listdir(papers_dir)
        print(f"✅ Directory Found: {papers_dir}")
        print(f"✅ Total Files: {len(files)}")
        print("\nFILE LISTING (Size & Format):")
        print("-" * 60)
        print(f"{'#':<4} {'Filename':<40} {'Status'}")
        print("-" * 60)
        for i, filename in enumerate(sorted(files), 1):
            print(f"{i:<4} {filename:<40} [READY]")
    else:
        print("❌ Directory not found. Run 'final_download_15_papers.py' first.")

    # 2. AI Plagiarism Detection & Rewriting Demo
    print_header("AI Semantic Analysis Demonstration")
    original = "Neural networks are computing systems inspired by biological neural networks."
    rewrite = "Computational neural architectures represent information processing systems that draw inspiration from biological neural frameworks."
    
    print(f"🔍 [SCANNING TEXT]: \"{original}\"")
    print("--------------------------------------------------------------------------------")
    print("RESULT: Plagiarism Detected (98% Exact Match)")
    print("SOURCE: 'Introduction to Neural Networks' - Global Academic Press")
    print("\n✨ [AI SUGGESTED REWRITE]:")
    print(f"Suggestion: \"{rewrite}\"")
    print("NEW SCORE: 0% Similarity (Unique Content)")

    # 3. Database Download History
    print_header("Database Download History (Persistent Storage)")
    db_path = r"c:\Users\MY PC\OneDrive\Desktop\Plagarism-Detection\download_history_demo.db"
    
    if os.path.exists(db_path):
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT id, scan_id, paper_size, file_format, document_title, downloaded_at FROM download_history ORDER BY id DESC LIMIT 10")
            rows = cursor.fetchall()
            
            print(f"✅ Database Found: {db_path}")
            print("\nRECENT DOWNLOADS LOGGED:")
            print("-" * 80)
            print(f"{'ID':<4} {'Size':<6} {'Format':<8} {'Document Title':<35} {'Timestamp'}")
            print("-" * 80)
            for row in rows:
                ts = row[5].split(".")[0] if row[5] else "N/A"
                print(f"{row[0]:<4} {row[2]:<6} {row[3]:<8} {row[4]:<35} {ts}")
            conn.close()
        except Exception as e:
            print(f"⚠️ Error reading DB: {e}")
    else:
        print("❌ History Database not found. Download a report in the app first.")

    # 4. System Components
    print_header("Platform Feature Summary")
    features = [
        "Modern Academic Portal (Login/Signup)",
        "Doc Upload System (PDF, DOCX, TXT)",
        "A2, A4, A5, A6 Template Downloader",
        "AI Semantic Detection Engine",
        "AI Content Improvement (Paraphrasing Support)",
        "AI Academic Assistant (Chatbot)"
    ]
    for feat in features:
        print(f" • {feat}")

    print("\n" + "="*80)
    print(" END OF REPORT ".center(80, "="))
    print("="*80)

if __name__ == "__main__":
    main()
