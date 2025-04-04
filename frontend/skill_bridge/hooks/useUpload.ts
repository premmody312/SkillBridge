"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export enum StatusText {
	UPLOADING = "Uploading File...",
	UPLOADED = "File uploaded succesfully",
	GETTING = "Getting File...",
	GENERATING = "Generating AI Response, This will only take a few seconds...",
}

export type status = StatusText[keyof StatusText];

// TODO: Implement this whole funcitonality, below is just some example code.

function useUpload() {
	const [progress, setProgress] = useState<number | null>(null);
	const [fileId, setFileId] = useState<string | null>(null);
	const [status, setStatus] = useState<status | null>(null);
	const { user } = useUser();
    const router = useRouter();

    const handleFilesGet = async (fileId: string) => {
        if(!fileId || !user) return;
        setStatus(StatusText.GETTING);
        try {
            const response = await fetch(`/api/get-file/${fileId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-ID": user.id,
            },
            });

            if (!response.ok) {
            throw new Error("Failed to fetch file from database");
            }

            const data = await response.json();

            // Option 1: Use the file URL directly from the backend
            if (data.fileUrl) {
            console.log("File URL from backend:", data.fileUrl);
            } else {
            console.warn("File URL not found in response");
            }

            // Option 2: Generate the file URL using Blob
            if (data.fileContent && data.fileType) {
            const fileBlob = new Blob([data.fileContent], { type: data.fileType });
            const fileUrl = URL.createObjectURL(fileBlob);
            console.log("File retrieved and URL created:", fileUrl);
            } else {
            console.warn("File content or type missing in response");
            }

            if (data.uuid) {
            console.log("File UUID:", data.uuid);
            } else {
            console.warn("UUID not found in response");
            }
        } catch (error) {
            console.error("Error retrieving file from database:", error);
            setStatus("error");
        }

    }

	const handleUpload = async (file: File) => {
        if(!file || !user) return;

        // TODO: Implement file download and upload to backend logic here
        // Example code below:

        setStatus(StatusText.UPLOADING);
        setProgress(0);
        try {
            const formData = new FormData();
            formData.append("pdf_doc", file);

            const response = await fetch("http://localhost:8000/api/v1/process", {
            method: "POST",
            body: formData,
            headers: {
                "User-ID": user.id,
            },
            });

            if (!response.ok) {
            throw new Error("Upload failed");
            }

            const data = await response.json();

            // Option 1: Use the file URL directly from the backend
            if (data.fileUrl) {
            console.log("Uploaded File URL from backend:", data.fileUrl);
            } else {
            console.warn("Uploaded File URL not found in response");
            }

            // Option 2: Generate the file URL using Blob
            if (data.fileContent && data.fileType) {
            const fileBlob = new Blob([data.fileContent], { type: data.fileType });
            const fileUrl = URL.createObjectURL(fileBlob);
            console.log("Uploaded File URL created:", fileUrl);
            } else {
            console.warn("Uploaded file content or type missing in response");
            }

            if (data.fileId) {
            console.log("Uploaded File ID:", data.fileId);
            setFileId(data.fileId);
            } else {
            console.warn("Uploaded File ID not found in response");
            }

            setStatus("success");
            setProgress(100)
        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus("error");
        }

	};
	return { progress, status, fileId, handleFilesGet, handleUpload };
}

export default useUpload;
