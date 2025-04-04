"use client";

import { useEffect, useState } from "react";
import { ChevronRight, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockResults = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "(123) 456-7890",
  education: "Bachelor of Science in Computer Science, Stanford University",
  experience: "5 years of software development experience",
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  skillGaps: [
    { skill: "Machine Learning", analysis: "Current market demand is high, consider adding this skill" },
    { skill: "Cloud Services (AWS)", analysis: "Essential for modern development roles" },
    { skill: "TypeScript", analysis: "Growing requirement in frontend positions" },
  ],
  courseRecommendations: [
    { title: "AWS Certified Solutions Architect", description: "Learn cloud architecture principles and AWS services" },
    { title: "Machine Learning A-Z™", description: "Comprehensive machine learning course with Python" },
    { title: "TypeScript Masterclass", description: "Master TypeScript for modern web development" },
  ],
  careerInsights: "Based on your profile, you're well-positioned for mid-level software engineering roles. To reach senior positions faster, focus on cloud technologies and machine learning skills.",
  resumeSuggestions: [
    "Add quantifiable achievements to demonstrate impact",
    "Include specific technologies used in each role",
    "Highlight leadership experience or team collaboration",
    "Consider adding a personal projects section",
  ],
};

export default function ResultsPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-600" />
        <p className="text-gray-600 mt-4">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600 mt-4">Failed to load results. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Dashboard</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Results</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Resume Analysis Results</h1>
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
          <h3 className="font-medium text-green-800">Analysis Complete</h3>
          <p className="text-green-700 text-sm">Your resume has been successfully analyzed. Review the insights below to enhance your professional profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Resume Details */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{results?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{results?.email}</p>
                  <p className="font-medium">{results?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{results?.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{results?.experience}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {results?.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Analysis Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skill Gap Analysis */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skill Gap Analysis</h2>
              <div className="space-y-4">
                {results?.skillGaps.map((gap, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{gap.skill}</p>
                    <p className="text-gray-600 text-sm">{gap.analysis}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Recommendations */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personalized Course Recommendations</h2>
              <div className="space-y-4">
                {results?.courseRecommendations.map((course, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-medium text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 text-sm">{course.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Career Insights */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Career Path Insights</h2>
              <p className="text-gray-600">{results?.careerInsights}</p>
            </div>
          </div>

          {/* Resume Optimization Suggestions */}
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Optimization Suggestions</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {results?.resumeSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}