"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, CheckCircle, AlertCircle, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const jobTitle = searchParams.get("jobTitle");
  
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resumeId || !jobTitle) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    const fetchAnalysisData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/skill-gap-with-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume_id: resumeId,
            job_description: jobTitle
          })
        });
        const data = await response.json();
        
        setAnalysisData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load analysis data");
        setLoading(false);
      }
    };

    setTimeout(fetchAnalysisData, 1000);
  }, [resumeId, jobTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
        <p className="text-gray-600 mt-4">Analyzing job requirements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600 mt-4">{error || "Failed to load analysis. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Resume Details</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Analysis</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <Button variant="ghost" className="flex items-center gap-2 p-0 mb-2" asChild>
              <Link href={`/dashboard/files/${resumeId}`}>
                <ArrowLeft className="h-4 w-4" />
                Back to Resume
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Career Analysis for {jobTitle}</h1>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-green-800">Analysis Complete</h3>
          <p className="text-green-700 text-sm">We've analyzed your resume against the requirements for "{jobTitle}". Review the insights below to enhance your professional profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills Gap Analysis */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skill Gap Analysis</h2>
              
              {/* Technical Skills */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Technical Skills to Develop</h3>
                {analysisData?.["Missing Technical Skills"].length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {analysisData["Missing Technical Skills"].map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600">Your technical skills match the job requirements well!</p>
                )}
              </div>
              
              {/* Soft Skills */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Soft Skills to Develop</h3>
                {analysisData?.["Missing Soft Skills"].length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {analysisData["Missing Soft Skills"].map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600">Your soft skills match the job requirements well!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Course Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Technical Skills Courses */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Technical Skills Courses</h2>
              <div className="space-y-4">
                {analysisData?.Recommendations?.["Technical Skills"].map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">Skill: {course.skill}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{course.platform}</span>
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        View Course <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills Courses */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Soft Skills Courses</h2>
              <div className="space-y-4">
                {analysisData?.Recommendations?.["Soft Skills"].map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">Skill: {course.skill}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{course.platform}</span>
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        View Course <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}