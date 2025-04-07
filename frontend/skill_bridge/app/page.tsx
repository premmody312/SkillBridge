import { Button } from "@/components/ui/button";
import {
	BrainCogIcon,
	EyeIcon,
	GlobeIcon,
	MonitorSmartphoneIcon,
	ServerCogIcon,
	ZapIcon,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";

const features = [
	{
		name: "Smart Resume Analyzer",
		description: "Instantly parse your resume and get personalized feedback to improve structure, skills, and formatting.",
		icon: GlobeIcon,
	},
	{
		name: "AI-Powered Skill Gap Analysis",
		description: "Discover what skills you're missing for your dream job using real-time AI comparison with job market data.",
		icon: ZapIcon,
	},
	{
		name: "Tailored Course Recommendations",
		description: "Get curated courses and certifications that match your goals and close identified skill gaps.",
		icon: BrainCogIcon,
	},
	{
		name: "Career Path Insights",
		description: "Explore potential career trajectories based on your profile, including salary benchmarks and in-demand roles.",
		icon: EyeIcon,
	},
	{
		name: "Interactive AI Chatbot Coach",
		description: "Get 24/7 guidance from our intelligent chatbot — ask career questions, get advice, or explore new options.",
		icon: ServerCogIcon,
	},
	{
		name: "Seamless Resume Management Dashboard",
		description: "Upload, track, and manage all your resumes with detailed analytics and version control.",
		icon: MonitorSmartphoneIcon,
	},
];

export default function Home() {
	return (
		<main className="flex-1 overflow-auto p-6 lg:p-12 bg-gradient-to-b from-gray-100 to-gray-50">
			<div className="bg-white py-16 sm:py-24 rounded-3xl shadow-xl">
				<div className="flex flex-col justify-center items-center mx-auto max-w-6xl px-8 lg:px-12">
					<div className="mx-auto max-w-4xl text-center">
						<h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
							Your Resume Helper AI
						</h2>

						<p className="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight">
							Transform Your Resume Into a Professional Masterpiece
						</p>

						<p className="mt-6 text-lg text-gray-600 leading-relaxed">
							Introducing{" "}
							<span className="font-semibold text-gray-800">
								AI Resume Builder
							</span>
							, a powerful tool that helps you create a professional resume in
							minutes. Customize your resume effortlessly to fit your unique
							style and career goals.{" "}
							<span className="text-gray-800 font-medium">
								Enhance your resume
							</span>{" "}
							and turn it into a{" "}
							<span className="font-semibold text-gray-900">professional</span>{" "}
							one with ease.
						</p>
					</div>

					<Button
						asChild
						className="mt-10 px-8 py-4 text-lg font-medium"
						variant="default"
					>
						<Link
							href="/dashboard"
							className="text-white bg-gray-900 hover:bg-gray-800 rounded-full"
						>
							Get Started
						</Link>
					</Button>
				</div>

				<div className="relative overflow-hidden pt-16">
					<div className="mx-auto max-w-6xl px-8 lg:px-12">
						<div className="relative bg-gradient-to-b from-gray-150 to-gray-50 rounded-3xl shadow-xl ring-1 ring-gray-50">
							<Image
								alt="App Screenshot"
								src="https://i.imgur.com/XmpPc7Q.png"
								width={2432}
								height={1442}
								className="rounded-3xl"
							/>
						</div>
					</div>
				</div>

				<div className="mx-auto mt-20 max-w-6xl px-8 lg:px-12">
					<dl className="text-base text-gray-600 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
						{features.map((feature) => (
							<div key={feature.name} className="relative">
								<feature.icon
									className="h-10 w-10 text-gray-900"
									aria-hidden="true"
								/>
								<dt className="mt-4 font-semibold text-lg text-gray-900">
									{feature.name}
								</dt>
								<dd className="mt-2 text-gray-600">
									{feature.description}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</main>
	);
}
