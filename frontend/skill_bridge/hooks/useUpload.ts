"use client";

import { useUser } from "@clerk/nextjs";
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

    const handleFileGet = async (fileId: string): Promise<Blob> => {
        if(!fileId || !user) {
            throw new Error("Missing file ID or user information");
        }
        console.log("Resume ID:", fileId);
        const response = await fetch(`http://localhost:8000/api/v1/downloadResumeById/${fileId}`, {
            method: "GET",
            headers: {
                "User-ID": user.id,
                "Content-Type": "application/json",
            },
            });
        if (response.ok && response.body) {
            console.log("response: ", response);
            const reader = response.body.getReader();
            const chunks: Uint8Array[] = [];
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                if (value) {
                    chunks.push(value);
                }
                done = readerDone;
            }

            const blob = new Blob(chunks);
            console.log("Blob: ", blob);
            console.log("Resume ID:", fileId);
            return blob;

        } else {
            console.error("Failed to fetch file blob or response body is null");
            return new Blob()
        }

    }

    const handleFilesGet = async (): Promise<Array<any>> => {
        if(!user) return [];
        setStatus(StatusText.GETTING);
        try {
            const response = await fetch(`http://localhost:8000/api/v1/getAllResumeByUserId`, {
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

            return data.resumes;


        } catch (error) {
            console.error("Error retrieving file from database:", error);
            setStatus("error");
            return [];
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
            console.log("Upload response:", data);

            // // Option 1: Use the file URL directly from the backend
            // if (data.fileUrl) {
            // console.log("Uploaded File URL from backend:", data.fileUrl);
            // } else {
            // console.warn("Uploaded File URL not found in response");
            // }

            // // Option 2: Generate the file URL using Blob
            // if (data.fileContent && data.fileType) {
            // const fileBlob = new Blob([data.fileContent], { type: data.fileType });
            // const fileUrl = URL.createObjectURL(fileBlob);
            // console.log("Uploaded File URL created:", fileUrl);
            // } else {
            // console.warn("Uploaded file content or type missing in response");
            // }

            if (data.resume_id) {
            console.log("Uploaded File ID:", data.resume_id);
            setFileId(data.resume_id);
            } else {
            console.warn("Uploaded File ID not found in response");
            }

            setStatus(StatusText.UPLOADED);
            setProgress(100);
        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus("error");
        }

	};
	return { progress, status, fileId, handleFilesGet, handleUpload, handleFileGet };
}

export default useUpload;
