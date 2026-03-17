'use client';
// src/components/tools/PDFToWord.tsx
// Client-side text extraction + DOCX generation via simple HTML-to-blob approach
import { useState, useRef } from 'react';

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setText(''); setDone(false); setError(''); };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setError('');
    try {
      // Use pdf-lib to extract basic info, then use a text extraction approach
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();

      // For client-side text extraction, we use the browser's PDF rendering
      // This reads raw PDF streams to extract text tokens
      const rawText = await extractTextFromPDF(bytes);
      setText(rawText || `[PDF has ${pageCount} pages - text extraction may be limited for scanned PDFs]`);
      setDone(true);
    } catch { setError('Could not process this PDF. It may be encrypted or contain only images.'); }
    finally { setProcessing(false); }
  };

  const downloadDocx = () => {
    // Generate a basic RTF file (widely compatible, opens in Word)
    const rtf = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}
{\\f0\\fs24 ${text.replace(/\n/g, '\\par\n').replace(/[{}\\]/g, '\\$&')}}
}`;
    const blob = new Blob([rtf], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = file?.name.replace('.pdf', '.rtf') || 'converted.rtf';
    a.click(); URL.revokeObjectURL(url);
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = file?.name.replace('.pdf', '.txt') || 'converted.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-red-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">📄</div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">{file ? file.name : 'Click to upload a PDF'}</p>
        <p className="text-sm text-slate-400 mt-1">Text-based PDFs work best · Scanned PDFs require OCR</p>
      </div>

      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">⚠ {error}</div>}

      {done && text && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-700">✓ Text extracted ({text.split(/\s+/).filter(Boolean).length} words)</span>
            <div className="flex gap-2">
              <button onClick={downloadDocx} className="btn-secondary text-xs">⬇ Download .rtf (Word)</button>
              <button onClick={downloadTxt} className="btn-secondary text-xs">⬇ Download .txt</button>
            </div>
          </div>
          <textarea className="tool-textarea bg-slate-50 dark:bg-slate-900/50" value={text} onChange={e => setText(e.target.value)} style={{ minHeight: 320 }} />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <strong>💡 Tip:</strong> This tool extracts text from PDF files directly in your browser. 
        For complex layouts or scanned documents, the formatting may differ from the original.
        The downloaded RTF file can be opened and edited in Microsoft Word, Google Docs, or LibreOffice.
      </div>

      {file && !done && (
        <button onClick={convert} disabled={processing} className={`btn-primary ${processing ? 'opacity-50' : ''}`}>
          {processing ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />Extracting text…</span> : '📄 Convert to Word'}
        </button>
      )}
    </div>
  );
}

// Client-side PDF text extraction using raw byte parsing
async function extractTextFromPDF(bytes: ArrayBuffer): Promise<string> {
  const uint8 = new Uint8Array(bytes);
  const text = new TextDecoder('latin1').decode(uint8);
  const textParts: string[] = [];
  // Extract text between BT (begin text) and ET (end text) markers
  const btEtRegex = /BT([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    // Extract strings from Tj, TJ, ' and " operators
    const strRegex = /\(([^)]*)\)\s*(?:Tj|'|")|(\[.*?\])\s*TJ/g;
    let strMatch;
    while ((strMatch = strRegex.exec(block)) !== null) {
      if (strMatch[1]) textParts.push(strMatch[1].replace(/\\n/g, '\n').replace(/\\r/g, ' ').replace(/\\\(/g, '(').replace(/\\\)/g, ')'));
      else if (strMatch[2]) {
        const arrContent = strMatch[2].replace(/\[|\]/g, '');
        const innerStrings = arrContent.match(/\(([^)]*)\)/g) || [];
        innerStrings.forEach(s => textParts.push(s.slice(1, -1)));
      }
    }
    textParts.push('\n');
  }
  return textParts.join(' ').replace(/\s+/g, ' ').replace(/ \n /g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}
