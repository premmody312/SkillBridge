"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ViewPDFPage() {
  const { resumeId } = useParams();
  const { user } = useUser();
  
  if (!resumeId) {
    return <div className="p-8">Missing resume ID parameter</div>;
  }

  // Generate the PDF URL
  const pdfUrl = `http://localhost:8000/api/v1/downloadResumeById/${resumeId}`;
  
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <Button variant="ghost" className="flex items-center gap-2 p-0 mb-4" asChild>
          <Link href={`/dashboard/files/${resumeId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Resume Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Resume PDF View</h1>
      </div>
      
      <PDFViewer pdfUrl={pdfUrl} fileName={`resume-${resumeId}.pdf`} />
    </div>
  );
}