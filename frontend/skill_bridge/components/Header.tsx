import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";

function Header() {
    return (
        <header className="flex justify-between items-center bg-white shadow-sm p-4 lg:p-6 border-b border-gray-200">
            <Link
                href="/dashboard"
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
                SkillBridge
            </Link>

            <SignedIn>
                <div className="flex items-center space-x-6">
                    <Button
                        variant="outline"
                        className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition-all px-4 py-2 rounded-lg"
                        asChild
                    >
                        <Link href="/dashboard">My Documents</Link>
                    </Button>

                    <Button
                        variant="default"
                        className="bg-gray-900 text-white hover:bg-gray-700 transition-all px-4 py-2 rounded-lg flex items-center space-x-2"
                        asChild
                    >
                        <Link href="/dashboard/upload">
                            <FilePlus2 className="h-5 w-5" />
                        </Link>
                    </Button>

                    <UserButton />
                </div>
            </SignedIn>
        </header>
    );
}

export default Header;
