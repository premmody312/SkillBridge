//old approach leaving it here for now
// "use client";

// import { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
// import { Button } from "@/components/ui/button";

// // Configure pdf.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// interface PDFViewerProps {
//   pdfUrl: string;
//   fileName?: string;
// }

// export default function PDFViewer({ pdfUrl, fileName = "document.pdf" }: PDFViewerProps) {
//   const [numPages, setNumPages] = useState<number>(0);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
//     setNumPages(numPages);
//     setLoading(false);
//   }

//   function onDocumentLoadError(error: Error) {
//     setError("Failed to load PDF");
//     setLoading(false);
//     console.error("PDF load error:", error);
//   }

//   function changePage(offset: number) {
//     setPageNumber(prevPageNumber => {
//       const newPageNumber = prevPageNumber + offset;
//       return Math.max(1, Math.min(numPages, newPageNumber));
//     });
//   }

//   function previousPage() {
//     changePage(-1);
//   }

//   function nextPage() {
//     changePage(1);
//   }

//   function downloadPDF() {
//     const link = document.createElement('a');
//     link.href = pdfUrl;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
//         {/* PDF Viewer */}
//         <div className="bg-gray-900 p-4 flex justify-between items-center">
//           <div className="text-white font-medium truncate flex-1">
//             {fileName}
//           </div>
//           <Button 
//             variant="ghost" 
//             className="text-white hover:bg-gray-800"
//             onClick={downloadPDF}
//           >
//             <Download className="h-4 w-4" />
//             <span className="ml-1">Download</span>
//           </Button>
//         </div>

//         <div className="p-4 bg-gray-100 min-h-[700px] flex justify-center">
//           {loading && (
//             <div className="flex flex-col items-center justify-center h-full">
//               <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//               <p className="mt-2 text-sm text-gray-500">Loading PDF...</p>
//             </div>
//           )}

//           {error && (
//             <div className="flex flex-col items-center justify-center h-full">
//               <p className="text-red-500">{error}</p>
//               <Button className="mt-4" onClick={() => window.open(pdfUrl, "_blank")}>
//                 Open PDF in New Tab
//               </Button>
//             </div>
//           )}

//           <Document
//             file={pdfUrl}
//             onLoadSuccess={onDocumentLoadSuccess}
//             onLoadError={onDocumentLoadError}
//             loading={<div className="h-[600px]"></div>}
//           >
//             <Page 
//               pageNumber={pageNumber} 
//               renderTextLayer={true}
//               renderAnnotationLayer={true}
//               className="shadow-md"
//             />
//           </Document>
//         </div>

//         {/* Page Navigation */}
//         {numPages > 0 && (
//           <div className="p-2 bg-white border-t flex justify-between items-center">
//             <Button 
//               variant="outline" 
//               size="sm"
//               onClick={previousPage}
//               disabled={pageNumber <= 1}
//             >
//               <ChevronLeft className="h-4 w-4" />
//               <span className="ml-1">Previous</span>
//             </Button>
            
//             <p className="text-sm">
//               Page {pageNumber} of {numPages}
//             </p>
            
//             <Button 
//               variant="outline" 
//               size="sm"
//               onClick={nextPage}
//               disabled={pageNumber >= numPages}
//             >
//               <span className="mr-1">Next</span>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//new approach unused leaving it here for now
"use client";

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  fileName?: string;
}

export default function PDFViewer({ pdfUrl, fileName = "document.pdf" }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const { user } = useUser();
  
  // Fetch the PDF with authentication
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (!user) return;
        
        const response = await fetch(pdfUrl, {
          headers: { 
            'user-id': user.id
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }
        
        // Get the PDF as blob
        const blob = await response.blob();
        const pdfDataUrl = URL.createObjectURL(blob);
        setPdfData(pdfDataUrl);
      } catch (err) {
        console.error("Error fetching PDF:", err);
        setError("Failed to load PDF file");
        setLoading(false);
      }
    };
    
    fetchPDF();
  }, [pdfUrl, user]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    setError("Failed to load PDF");
    setLoading(false);
    console.error("PDF load error:", error);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.max(1, Math.min(numPages, newPageNumber));
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function downloadPDF() {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Rest of your component remains the same, but use pdfData instead of pdfUrl:
  
  return (
    <div className="flex flex-col items-center">
      {/* Your existing code but replace pdfUrl with pdfData in the Document component */}
      <Document
        file={pdfData}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          setError("Failed to load PDF");
          setLoading(false);
          console.error("PDF load error:", error);
        }}
        loading={<div className="h-[600px]"></div>}
      >
        {/* ... rest of your existing code ... */}
      </Document>
    </div>
  );
}