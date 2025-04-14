"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { saveAs } from "file-saver";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OptimizeResumePage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const router = useRouter();

  const [sections, setSections] = useState<any>(null);
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSuggestions = async () => {
    if (!resumeId) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/optimize-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume_id: resumeId }),
      });

      const data = await res.json();

      if (res.ok) {
        setSections(data);
        setScores(data.scores);
      } else {
        setError(data.detail || "Failed to optimize resume.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadDoc = () => {
    const allText = [
      sections?.action_verbs,
      sections?.quantifiers,
      sections?.formatting,
      sections?.grammar,
      sections?.overall_feedback,
    ].join("\n\n");

    const blob = new Blob([allText], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, "Resume_Optimization_Feedback.docx");
  };

  const generateCoverLetter = () => {
    router.push(`/dashboard/cover-letter?resumeId=${resumeId}`);
  };

  useEffect(() => {
    getSuggestions();
  }, [resumeId]);

  const barData = {
    labels: ["Action Verbs", "Quantifiers", "Formatting", "Grammar"],
    datasets: [
      {
        label: "Score",
        data: scores ? [scores.verbs, scores.quantifiers, scores.formatting, scores.grammar] : [],
        backgroundColor: "#6366F1",
        borderRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Remaining", "Score"],
    datasets: [
      {
        data: scores ? [10 - scores.overall, scores.overall] : [],
        backgroundColor: ["#E5E7EB", "#10B981"],
        borderWidth: 1,
      },
    ],
  };

  const Section = ({ title, markdown }: { title: string; markdown: string }) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <div className="prose max-w-none prose-p:leading-relaxed prose-table:border prose-th:border prose-td:border prose-h3:font-bold">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown.replace(/<br\s*\/?>/gi, "\n")}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 bg-white shadow-md rounded-lg">
        <Button variant="ghost" className="flex items-center gap-2 p-0 mb-4" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Resume Optimizer</h1>
      <p className="text-gray-600 mb-6">Get expert AI feedback on how to make your resume stronger.</p>

      {loading && (
        <div className="flex items-center space-x-2 text-indigo-600 mb-4">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Analyzing your resume...</span>
        </div>
      )}

      {error && <p className="text-red-600 font-medium mt-4">❌ {error}</p>}

      {!loading && sections && (
        <>
          <Section title="1. Action Verbs" markdown={sections.action_verbs} />
          <Section title="2. Quantifiers" markdown={sections.quantifiers} />
          <Section title="3. Formatting & Clarity" markdown={sections.formatting} />
          <Section title="4. Spelling & Grammar" markdown={sections.grammar} />
          <Section title="5. Overall Feedback" markdown={sections.overall_feedback} />

          {/* Charts */}
          {scores && (
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6 shadow text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Overall Score</h2>
                <Chart type="doughnut" data={doughnutData} />
                <p className="text-green-600 text-lg mt-4 font-bold">{scores.overall}/10</p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Section Scores</h2>
                <Chart
                  type="bar"
                  data={barData}
                  options={{ scales: { y: { max: 10, beginAtZero: true } } }}
                />
              </div>
            </div>
          )}

      <div className="flex gap-4 mt-8 justify-center">
            <Button className="bg-green-600 hover:bg-green-700" onClick={downloadDoc}>
              Download as .docx
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={generateCoverLetter}>
              Generate Cover Letter
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
