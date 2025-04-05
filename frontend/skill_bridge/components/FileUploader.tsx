"use client";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { CheckCircleIcon, CircleArrowDown, RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function FileUploader() {
	const { progress, status, fileId, handleUpload } = useUpload();
	const router = useRouter();

	useEffect(() => {
		if (fileId) {
			// router.push(`/dashboard/viewFile/${fileId}`);
			router.push("/dashboard/files/123");
		}
	}, [fileId, router]);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			await handleUpload(file);
			// router.push(`/dashboard/viewFile/${fileId}`);
			// router.push("/dashboard/files/123");
		}
	}, []);

	const statusIcons = {
		[StatusText.UPLOADING]: (
			<RocketIcon className='h-14 w-14 text-gray-600 animate-pulse' />
		),
		[StatusText.UPLOADED]: (
			<CheckCircleIcon className='h-14 w-14 text-gray-600 animate-in' />
		),
	};

	const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
		useDropzone({
			onDrop,
			maxFiles: 1,
			accept: {
				"application/pdf": [".pdf"],
				"application/text": [".txt"],
				"application/docx": [
					".docx",
					".doc",
					".docm",
					".dotx",
					".dotm",
					".dot",
					".docb",
				],
				"application/rtf": [".rtf"],
			},
		});

	const uploadInProgress = progress !== null && progress >= 0 && progress < 100;

	return (
		<div className='flex flex-col items-center max-w-4xl mx-auto px-6 sm:px-8 pt-10'>
			{uploadInProgress && (
				<div className='mt-32 flex flex-col items-center justify-center gap-5'>
					{/* <div
						className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
							progress === 100 && "hidden"
						}`}
						role='progressbar'
						style={{
							// @ts-ignore
							"--value": progress,
							"--size": "12rem",
							"--thickness": "1.3rem",
						}}>
						{progress}%
					</div> */}

					{/*@ts-ignore*/}
					{statusIcons[status!]}
                    
                    {/*@ts-ignore*/}
					<p>{status}</p>
				</div>
			)}

			{!uploadInProgress && (
				<div
					{...getRootProps()}
					className={`p-10 border-2 border-dashed rounded-2xl h-72 flex items-center justify-center transition-all duration-300 ${
						isFocused || isDragAccept
							? "border-gray-500 bg-gray-100"
							: "border-gray-300 bg-gray-50"
					} ${
						isDragActive
							? "shadow-lg transform scale-105"
							: "shadow-md transform scale-100"
					}`}>
					<input {...getInputProps()} />
					<div className='text-center flex flex-col items-center justify-center'>
						{isDragActive ? (
							<>
								<RocketIcon className='h-14 w-14 text-gray-600 animate-pulse' />
								<p className='text-lg font-semibold text-gray-700 mt-4'>
									Drop your files here
								</p>
							</>
						) : (
							<>
								<CircleArrowDown className='h-14 w-14 text-gray-400' />
								<p className='text-lg font-medium text-gray-600 mt-4'>
									Drag & drop files here, or{" "}
									<span className='text-gray-700 underline cursor-pointer'>
										browse
									</span>
								</p>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default FileUploader;
