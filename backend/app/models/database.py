from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    documents = relationship("Document", back_populates="owner")

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    filename = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="documents")
    scans = relationship("ScanResult", back_populates="document")

class ScanResult(Base):
    __tablename__ = "scan_results"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    overall_similarity = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    document = relationship("Document", back_populates="scans")
    highlights = relationship("Highlight", back_populates="scan")

class Highlight(Base):
    __tablename__ = "highlights"
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scan_results.id"))
    sentence = Column(Text)
    similarity = Column(Float)
    match_type = Column(String) # exact, paraphrase, none
    source_text = Column(Text, nullable=True)
    source_title = Column(String, nullable=True)
    scan = relationship("ScanResult", back_populates="highlights")
