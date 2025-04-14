"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CoverLetterPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const generate = async () => {
    if (!jobDesc || !resumeId) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jobDesc,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate cover letter");
      const data = await res.json();
      setCoverLetter(data.cover_letter);
    } catch (err) {
      console.error("❌ Error generating cover letter:", err);
      setCoverLetter("An error occurred while generating the cover letter.");
    } finally {
      setLoading(false);
    }
  };

  const downloadDOC = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Cover Letter</title></head><body>`;
    const footer = "</body></html>";
    const content = `${header}${coverLetter.replace(/\n/g, "<br>")}${footer}`;
    const blob = new Blob([content], {
      type: "application/msword;charset=utf-8",
    });
    saveAs(blob, "CoverLetter.doc");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
        <Button variant="ghost" className="flex items-center gap-2 p-0 mb-4" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Cover Letter Generator</h1>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Job Description</label>
          <Textarea
            rows={6}
            className="w-full mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg p-3 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>

        <Button
          onClick={generate}
          disabled={loading}
          className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </Button>
      </div>

      {coverLetter && (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm whitespace-pre-line">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Cover Letter</h2>
          <div>{coverLetter}</div>
          <Button className="mt-4 bg-green-600 text-white hover:bg-green-700" onClick={downloadDOC}>
            Download as DOC
          </Button>
        </div>
      )}
    </div>
  );
}
