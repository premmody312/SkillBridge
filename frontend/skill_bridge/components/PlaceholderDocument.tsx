"use client";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function PlaceholderDocument() {
	const router = useRouter();

	const handleClick = () => {
		router.push("/dashboard/upload");
	};
	return (
		<Button
			onClick={handleClick}
			className='flex flex-col items-center justify-center w-64 h-80 bg-gray-200 hover:bg-gray-400 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:text-gray-300 cursor-pointer'>
			<PlusCircleIcon className='h-16 w-16' />
			<p>Add a document</p>
		</Button>
	);
}

export default PlaceholderDocument;
