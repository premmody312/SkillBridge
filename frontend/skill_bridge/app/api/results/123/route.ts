import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;
    const userId = request.headers.get("User-ID");
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const mockData = {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(123) 456-7890",
      education: "Bachelor of Science in Computer Science, Stanford University",
      experience: "5 years of software development experience",
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      skillGaps: [
        { skill: "Machine Learning", analysis: "Current market demand is high, consider adding this skill" },
        { skill: "Cloud Services (AWS)", analysis: "Essential for modern development roles" },
        { skill: "TypeScript", analysis: "Growing requirement in frontend positions" }
      ],
      courseRecommendations: [
        { title: "AWS Certified Solutions Architect", description: "Learn cloud architecture principles and AWS services" },
        { title: "Machine Learning A-Z™", description: "Comprehensive machine learning course with Python" },
        { title: "TypeScript Masterclass", description: "Master TypeScript for modern web development" }
      ],
      careerInsights: "Based on your profile, you're well-positioned for mid-level software engineering roles. To reach senior positions faster, focus on cloud technologies and machine learning skills.",
      resumeSuggestions: [
        "Add quantifiable achievements to demonstrate impact",
        "Include specific technologies used in each role",
        "Highlight leadership experience or team collaboration",
        "Consider adding a personal projects section"
      ]
    };

    return NextResponse.json(mockData);
    
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}