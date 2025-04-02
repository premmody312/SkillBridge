import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";

function Header() {
    return (
        <header className="flex justify-between items-center bg-gray-50 shadow-md p-4 lg:p-6 border-b border-gray-200">
            {/* Logo or Branding */}
            <Link
                href="/dashboard"
                className="text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
                Enhance your <span className="text-gray-500 font-bold">Resume</span>
            </Link>

            {/* Navigation and User Actions */}
            <SignedIn>
                <div className="flex items-center space-x-6">
                    {/* My Documents Button */}
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition-all"
                        asChild
                    >
                        <Link href="/dashboard">My Documents</Link>
                    </Button>

                    {/* Upload Button */}
                    <Button
                        variant="outline"
                        className="bg-gray-700 border-gray-300 text-gray-300 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-200 transition-all"
                        asChild
                    >
                        <Link href="/dashboard/upload">
                            <FilePlus2 className="" />
                        </Link>
                    </Button>

                    {/* User Profile Button */}
                    <UserButton />
                </div>
            </SignedIn>
        </header>
    );
}

export default Header;
