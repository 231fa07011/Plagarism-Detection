/**
 * FileReader Utility
 * Extracts plain text from uploaded files: TXT, PDF, DOCX
 * Uses: native FileReader API for TXT, PDF.js for PDF, Mammoth.js for DOCX
 */

const FileExtractor = {

    /**
     * Main entry point — reads a File object and returns extracted text
     * @param {File} file
     * @returns {Promise<string>} extracted text
     */
    async extract(file) {
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext === 'txt') {
            return this.readTxt(file);
        } else if (ext === 'pdf') {
            return this.readPdf(file);
        } else if (ext === 'docx' || ext === 'doc') {
            return this.readDocx(file);
        } else {
            throw new Error(`Unsupported file type: .${ext}. Please upload TXT, PDF, or DOCX.`);
        }
    },

    // --- TXT: simple FileReader text read ---
    readTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read TXT file'));
            reader.readAsText(file, 'UTF-8');
        });
    },

    // --- PDF: PDF.js library ---
    async readPdf(file) {
        if (!window.pdfjsLib) {
            throw new Error('PDF.js not loaded. Please check your internet connection.');
        }

        // Set worker path
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    },

    // --- DOCX: Mammoth.js library ---
    async readDocx(file) {
        if (!window.mammoth) {
            throw new Error('Mammoth.js not loaded. Please check your internet connection.');
        }

        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        return result.value.trim();
    }
};

window.FileExtractor = FileExtractor;
