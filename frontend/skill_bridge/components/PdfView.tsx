"use client";

import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';

interface PDFViewerProps {
  pdfUrl: string;
  fileName?: string;
}

export default function PDFViewer({ pdfUrl, fileName = "document.pdf" }: PDFViewerProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const checkPdfAvailability = async () => {
      try {
        const response = await fetch(pdfUrl, {
          method: 'GET', 
          headers: user?.id ? { 'user-id': user.id } : {}
        });
        
        if (!response.ok) {
          throw new Error(`PDF not available: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        const objectUrl = URL.createObjectURL(blob);
        
        setIframeUrl(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error checking PDF:", err);
        setError("Failed to load PDF: " + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };
    
    checkPdfAvailability();
  }, [pdfUrl, user]);

  function downloadPDF() {
    if (iframeUrl) {
      const a = document.createElement('a');
      a.href = iframeUrl;
      a.download = fileName;
      a.target = '_blank';
      a.click();
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        {/* PDF Viewer Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <div className="text-white font-medium truncate flex-1">
            {fileName}
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-gray-800"
            onClick={downloadPDF}
          >
            <Download className="h-4 w-4" />
            <span className="ml-1">Download</span>
          </Button>
        </div>

        {/* PDF Content */}
        <div className="w-full" style={{ height: '80vh' }}>
          {loading && (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Loading PDF...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100">
              <p className="text-red-500">{error}</p>
              <Button className="mt-4" onClick={() => window.open(pdfUrl, "_blank")}>
                Open PDF in New Tab
              </Button>
            </div>
          )}

          {iframeUrl && !loading && !error && (
            <iframe 
              src={iframeUrl}
              className="w-full h-full border-0"
              title={fileName}
            />
          )}
        </div>
      </div>
    </div>
  );
}