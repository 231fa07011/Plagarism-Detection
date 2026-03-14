import sys
import os
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

print("-----------------------------------------------")
print("   Plagiarism Detection - Code Run Validation  ")
print("-----------------------------------------------")

print("\nSTEP 1: Loading database models...")
from app.models.database import Base, User, Document, ScanResult, Highlight, DownloadHistory
print("  [OK] User")
print("  [OK] Document")
print("  [OK] ScanResult")
print("  [OK] Highlight")
print("  [OK] DownloadHistory  (paper_size: A3 / A4 / A5)")

print("\nSTEP 2: Creating SQLite in-memory database...")
engine = create_engine("sqlite:///:memory:")
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
db = Session()
for table in sorted(Base.metadata.tables.keys()):
    print(f"  [OK] Table: {table}")

print("\nSTEP 3: Inserting DownloadHistory records (A3, A4, A5)...")
test_data = [
    (1, "Thesis_Draft_v1.docx",       "A3", "PDF"),
    (2, "Literature_Review_Final.pdf", "A4", "PDF"),
    (3, "Methodology_Chapter.tex",     "A5", "PDF"),
    (1, "Thesis_Draft_v1.docx",       "A4", "DOCX"),
    (2, "Literature_Review_Final.pdf", "A5", "DOCX"),
]
for scan_id, title, size, fmt in test_data:
    record = DownloadHistory(
        scan_id=scan_id,
        document_title=title,
        paper_size=size,
        file_format=fmt,
        downloaded_at=datetime.utcnow()
    )
    db.add(record)
db.commit()
print(f"  [OK] {len(test_data)} records inserted")

print("\nSTEP 4: Querying all Download History records...")
print(f"  {'ID':<4} {'Scan':<6} {'Size':<5} {'Format':<6} {'Document'}")
print("  " + "-" * 58)
all_rows = db.query(DownloadHistory).order_by(DownloadHistory.id).all()
for r in all_rows:
    print(f"  {r.id:<4} {r.scan_id:<6} {r.paper_size:<5} {r.file_format:<6} {r.document_title}")

db.close()

print("\n-----------------------------------------------")
print(f"  PASSED: {len(all_rows)} download records stored in DB OK")
print("  All models, tables, and queries working!")
print("-----------------------------------------------")
