"use client";

import { ChartBar, EyeIcon, FileIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function Document({ id, name }: { id: string; name: string }) {
    const router = useRouter();
    const { user } = useUser();

    const handleViewPDF = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/dashboard/files/${id}`);
    };

    const handleViewAnalysis = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            // First fetch the skill analysis to get the job title
            const response = await fetch(`http://localhost:8000/api/v1/getSkillAnalysisById/${id}`, {
                headers: { "user-id": user?.id }
            });
            
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const jobTitle = data.job_description || "SDE"; // Fallback to default job title if not found
                
                router.push(`/dashboard/analysis?resumeId=${id}&jobTitle=${encodeURIComponent(jobTitle)}`);
            } else {
                // Fallback to default
                console.error("Failed to fetch analysis data");
                router.push(`/dashboard/analysis?resumeId=${id}&jobTitle=SDE`);
            }
        } catch (error) {
            // Fallback to default on error
            console.error("Error fetching analysis data:", error);
            router.push(`/dashboard/analysis?resumeId=${id}&jobTitle=SDE`);
        }
    };

    return (
        <div className="flex flex-col w-64 h-80 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-500 p-6 cursor-pointer border border-gray-100">
            <div className="flex flex-col items-start">
                <p className="font-medium text-base text-gray-800 overflow-hidden text-ellipsis break-all line-clamp-1">
                    {name}
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-gray-200 to-transparent mt-2"></div>
            </div>

            <div className="flex flex-col justify-center items-center h-32 my-4">
                <div className="p-6 rounded-full bg-gradient-to-b from-gray-50 to-gray-white shadow-sm">
                    <FileIcon
                        size={36}
                        className="text-gray-700"
                    />
                </div>
            </div>

            <div className="flex-grow"></div>

            <div className="flex items-center justify-center mt-4">
                <div className="flex relative w-full space-x-3 justify-center">
                    <div className="group relative z-10">
                        <Button
                            className="w-10 h-10 p-0 bg-gray-50 text-gray-800 border border-gray-200 rounded-full flex items-center justify-center transition-all duration-500 ease-out group-hover:w-24 group-hover:rounded-full shadow-sm hover:shadow group-hover:bg-gray-900 group-hover:text-white group-hover:border-transparent"
                            onClick={handleViewPDF}
                        >
                            <div className="flex items-center justify-center w-full h-full relative">
                                <EyeIcon className="h-4 w-4 flex-shrink-0 transition-all duration-500 ease-out group-hover:translate-x-[-6px]" />
                                <span className="opacity-0 max-w-0 pl-0 ml-0 whitespace-nowrap overflow-hidden group-hover:opacity-100 group-hover:max-w-full group-hover:pl-1 text-sm font-medium transition-all duration-500 ease-out">View</span>
                            </div>
                        </Button>
                    </div>

                    {/* Analyze Button */}
                    <div className="group relative z-10">
                        <Button
                            className="w-10 h-10 p-0 bg-gray-50 text-gray-800 border border-gray-200 rounded-full flex items-center justify-center transition-all duration-500 ease-out group-hover:w-28 group-hover:rounded-full shadow-sm hover:shadow group-hover:bg-gray-800 group-hover:text-white group-hover:border-transparent"
                            onClick={handleViewAnalysis}
                        >
                            <div className="flex items-center justify-center w-full h-full relative">
                                <ChartBar className="h-4 w-4 flex-shrink-0 transition-all duration-500 ease-out group-hover:translate-x-[-8px]" />
                                <span className="opacity-0 max-w-0 pl-0 ml-0 whitespace-nowrap overflow-hidden group-hover:opacity-100 group-hover:max-w-full group-hover:pl-1 text-sm font-medium transition-all duration-500 ease-out">History</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Document;