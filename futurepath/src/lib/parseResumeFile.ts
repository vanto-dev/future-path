import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker for pdf.js using standard CDN worker
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

export interface ParseResumeResult {
  text: string;
  filename: string;
  fileType: string;
  fileSizeKB: number;
  wordCount: number;
  success: boolean;
  error?: string;
}

/**
 * Extracts plain text from various resume file formats:
 * PDF (.pdf), Word (.docx, .doc), Text (.txt, .md, .rtf, .html)
 */
export async function parseResumeFile(file: File): Promise<ParseResumeResult> {
  const filename = file.name;
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const fileSizeKB = Math.round(file.size / 1024);

  try {
    let extractedText = '';

    if (extension === 'pdf') {
      extractedText = await parsePdfFile(file);
    } else if (extension === 'docx') {
      extractedText = await parseDocxFile(file);
    } else if (extension === 'doc') {
      // Try mammoth first, if fails fallback to binary text extractor
      try {
        extractedText = await parseDocxFile(file);
      } catch {
        extractedText = await parseBinaryTextFallback(file);
      }
    } else {
      // Plain text formats (.txt, .md, .rtf, .csv, .json, .html)
      extractedText = await readAsPlainText(file);
    }

    // Clean up excessive whitespace while preserving paragraph structure
    const cleanedText = cleanExtractedText(extractedText);
    const wordCount = cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0;

    if (!cleanedText.trim()) {
      return {
        text: '',
        filename,
        fileType: extension.toUpperCase(),
        fileSizeKB,
        wordCount: 0,
        success: false,
        error: `Could not extract text from ${filename}. The file might be scanned or image-only.`
      };
    }

    return {
      text: cleanedText,
      filename,
      fileType: extension.toUpperCase(),
      fileSizeKB,
      wordCount,
      success: true
    };
  } catch (err: any) {
    console.error(`Error parsing file ${filename}:`, err);
    return {
      text: '',
      filename,
      fileType: extension.toUpperCase(),
      fileSizeKB,
      wordCount: 0,
      success: false,
      error: err.message || `Failed to parse ${filename}. Please try copying and pasting text directly.`
    };
  }
}

async function parsePdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true
    });
    
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageStrings + '\n\n';
    }

    return fullText;
  } catch (pdfErr) {
    console.warn('PDF.js worker/parse fallback triggered:', pdfErr);
    // Fallback: extract ASCII string tokens if PDF worker fails in iframe
    return await parseBinaryTextFallback(file);
  }
}

async function parseDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

function readAsPlainText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve((event.target?.result as string) || '');
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function parseBinaryTextFallback(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let result = '';
  let currentWord = '';

  for (let i = 0; i < bytes.length; i++) {
    const charCode = bytes[i];
    // Keep printable ASCII chars
    if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
      currentWord += String.fromCharCode(charCode);
    } else {
      if (currentWord.length >= 3) {
        // filter out binary noise
        if (!/[^\x20-\x7E\s]/.test(currentWord) && /[a-zA-Z0-9]/.test(currentWord)) {
          result += currentWord + ' ';
        }
      }
      currentWord = '';
    }
  }

  return result;
}

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
