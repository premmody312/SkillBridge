"use client";

import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle, AlertCircle, Loader2, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams,useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fileIdFromParams = params?.fileId;
  const fileIdFromQuery = searchParams?.get("fileId") || searchParams?.get("id");
  const fileId = fileIdFromParams || fileIdFromQuery;

  const { user, isLoaded: isUserLoaded } = useUser();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Debug info:", { 
      fileIdFromParams, 
      fileIdFromQuery, 
      fileId, 
      isUserLoaded,
      hasUser: !!user
    });
  }, [fileIdFromParams, fileIdFromQuery, fileId, isUserLoaded, user]);

  useEffect(() => {
    // Wait until user is loaded before checking
    if (!isUserLoaded) return;

    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (!fileId) {
      setError("Missing file ID parameter");
      setLoading(false);
      return;
    }

    setResumeId(fileId);
    
    const fetchResumeData = async () => {
      try {
        console.log("Fetching resume data for fileId:", fileId);
        // First, try to fetch the parsed data using the fileId
        const response = await fetch(`http://localhost:8000/api/v1/getParsedResumeById/${fileId}`, {
          method: "GET",
          headers: {
            "user-id": user.id,  
            "Content-Type": "application/json"
          }
        });
    
        if (!response.ok) {
          console.error("API response not OK:", response.status);
          throw new Error(`Failed to fetch resume data: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Resume data fetched:", data);
        setResumeData(data.parsed_data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(`Failed to load resume data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [fileId, user, isUserLoaded]);

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      alert("Please enter a job title to analyze");
      return;
    }

    if (!resumeId || !user) {
      alert("Missing resume ID or user information");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/skill-gap-with-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-ID": user.id
        },
        body: JSON.stringify({
          resume_id: resumeId,
          job_description: jobTitle
        })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      // Redirect to analysis page with the resume ID and job title
      router.push(`/dashboard/analysis?resumeId=${resumeId}&jobTitle=${encodeURIComponent(jobTitle)}`);
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isUserLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
        <p className="text-gray-600 mt-4">
          {!isUserLoaded ? "Loading user information..." : "Loading resume details..."}
        </p>
        <p className="text-sm text-gray-400 mt-2">File ID: {fileId || "Not found"}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600 mt-4">{error}</p>
        <div className="mt-4">
          <Button onClick={() => router.push("/dashboard/upload")}>
            Upload a Resume
          </Button>
        </div>
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
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Resume Details</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-green-800">Resume Uploaded Successfully</h3>
          <p className="text-green-700 text-sm">Your resume has been successfully parsed. Enter a job title below to analyze skill gaps and get recommendations.</p>
        </div>
      </div>

      {/* Resume Details Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{resumeData?.["Full Name"]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{resumeData?.["Email ID"]}</p>
            </div>
            {resumeData?.["GitHub Portfolio"] && (
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <p className="font-medium">{resumeData["GitHub Portfolio"]}</p>
              </div>
            )}
            {resumeData?.["LinkedIn ID"] && (
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <p className="font-medium">{resumeData["LinkedIn ID"]}</p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Employment History</h2>
          <div className="space-y-6 mb-8">
            {resumeData?.["Employment Details"]?.map((job, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-800">{job.Title}</h3>
                  <span className="text-sm text-gray-500">{job.Dates}</span>
                </div>
                <p className="text-gray-600 mb-1">{job.Company}, {job.Location}</p>
                <p className="text-sm text-gray-600">{job.Description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
          <div className="space-y-4 mb-8">
            {resumeData?.["Technical Skills"] && (
              Object.entries(resumeData["Technical Skills"]).map(([category, skillsList]) => (
                <div key={category}>
                  <h3 className="font-medium text-gray-700 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(skillsList) && skillsList.map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            {resumeData?.["Soft Skills"] && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData["Soft Skills"].map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Title Input Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Generate Career Recommendations</h2>
        <p className="text-gray-600 mb-6">Enter the job title you'd like to tailor your resume for, and we'll analyze skills gaps and provide personalized recommendations.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            type="text" 
            placeholder="e.g., Software Development Engineer, Data Scientist, Product Manager" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="flex-grow"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing || !jobTitle.trim()}
            className="flex items-center gap-2 min-w-[120px]"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {analyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </div>
    </div>
  );
}