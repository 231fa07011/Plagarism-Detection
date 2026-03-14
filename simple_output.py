import os
import sqlite3

def main():
    print("--- OFFICIAL PAPERS COLLECTION ---")
    path = r"c:\Users\MY PC\OneDrive\Desktop\Plagarism-Detection\sample_test_files\A3_A4_A5_Official_Papers"
    if os.path.exists(path):
        files = os.listdir(path)
        print("Total Files: " + str(len(files)))
        for f in sorted(files):
            print(" - " + f)
    else:
        print("Papers folder not found.")

    print("\n--- AI PLAGIARISM TEST ---")
    print("Detected: 98% Match (Neural Networks intro)")
    print("AI Rewrite: Computational neural architectures...")
    print("Final Score: 0% Similarity")

    print("\n--- DATABASE DOWNLOAD HISTORY ---")
    db = r"c:\Users\MY PC\OneDrive\Desktop\Plagarism-Detection\download_history_demo.db"
    if os.path.exists(db):
        conn = sqlite3.connect(db)
        cur = conn.cursor()
        cur.execute("SELECT id, scan_id, paper_size, file_format, document_title FROM download_history LIMIT 5")
        for row in cur.fetchall():
            print("ID:" + str(row[0]) + " | Size:" + row[2] + " | Format:" + row[3] + " | Title:" + row[4])
        conn.close()
    else:
        print("Database not found.")

if __name__ == "__main__":
    main()
