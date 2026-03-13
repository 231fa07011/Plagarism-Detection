from fpdf import FPDF
import io

def generate_pdf_report(doc_title: str, similarity: float, highlights: list):
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="Plagiarism Analysis Report", ln=True, align='C')
    
    # Summary
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Document: {doc_title}", ln=True)
    pdf.cell(200, 10, txt=f"Overall Similarity: {similarity}%", ln=True)
    pdf.ln(10)
    
    # Highlights
    pdf.set_font("Arial", 'B', 14)
    pdf.cell(200, 10, txt="Matches Detected:", ln=True)
    
    pdf.set_font("Arial", size=10)
    for h in highlights:
        if h['matchType'] != 'none':
            pdf.set_text_color(255, 0, 0) if h['matchType'] == 'exact' else pdf.set_text_color(255, 140, 0)
            pdf.multi_cell(0, 10, txt=f"[{h['matchType'].upper()} - {h['similarity']}%] {h['sentence']}")
            pdf.set_text_color(0, 0, 0)
            pdf.multi_cell(0, 10, txt=f"Source: {h['source']['title'] if h['source'] else 'Unknown'}")
            pdf.ln(5)
            
    return pdf.output(dest='S').encode('latin-1')
