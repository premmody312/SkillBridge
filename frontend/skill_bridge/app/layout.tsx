import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatbotWidget from "@/components/ChatbotWidget";
import {
	ClerkProvider,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SkillBridge",
	description: "SkillBridge: Your tool for creating impactful resumes.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen h-screen overflow-hidden flex flex-col`}>
					{/* <SignedOut>
						<SignInButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn> */}
					{children}
					<ChatbotWidget />
				</body>
			</html>
		</ClerkProvider>
	);
}
