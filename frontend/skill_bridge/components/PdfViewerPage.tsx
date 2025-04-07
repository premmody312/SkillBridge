"use client";

import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Import the PDF viewer dynamically to avoid hydration errors
const PDFViewer = dynamic(() => import('./PdfView'), {
  ssr: false, // This is important - don't render on server
  loading: () => <div className="p-12 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
  </div>
});

export default function ViewPDFPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useUser();
  
  if (!id) {
    return <div className="p-8">Missing resume ID parameter</div>;
  }

  // Generate the PDF URL
  const pdfUrl = `http://localhost:8000/api/v1/downloadResumeById/${id}`;
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <Button variant="ghost" className="flex items-center gap-2 p-0 mb-4" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Resume PDF View</h1>
      </div>
      
      <div className="mt-4">
        <PDFViewer pdfUrl={pdfUrl} fileName={`resume-${id}.pdf`} />
      </div>
    </div>
  );
}