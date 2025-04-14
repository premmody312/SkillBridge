"use client";

import useUpload from "@/hooks/useUpload";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Document from "./Document";
import PlaceholderDocument from "./PlaceholderDocument";
import { Button } from "@/components/ui/button";


function AllDocuments() {
    const [files, setFiles] = useState<Array<any> | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { handleFilesGet, handleDelete } = useUpload();

    useEffect(() => {
        const fetchFiles = async () => {
            const fetchedFiles = await handleFilesGet();
            setFiles(fetchedFiles);
            console.log("FETCHED FILES: ", fetchedFiles);
        };

        fetchFiles();
    }, []); // Only runs once on mount

    const handleDeleteDocument = async (resumeId: string) => {
        if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            return;
        }

        try {
            setDeletingId(resumeId);
            const success = await handleDelete(resumeId);

            if (success) {
                setFiles(prevFiles => prevFiles ? prevFiles.filter(file => file.resume_id !== resumeId) : null);
            } else {
                alert("Failed to delete document. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting document:", err);
            alert("Failed to delete document. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className={`flex flex-col justify-center items-center ${files ? "" : "min-h-screen w-full"}`}>
            {!files ? (
                <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin h-16 w-16 text-gray-400" />
                </div>
            ) : (
                <div className="flex flex-wrap p-5 justify-center lg:justify-start rounded-xl gap-5 w-full mx-auto">
                    {files
                        .sort(
                            (a, b) =>
                                new Date(b.upload_date).getTime() -
                                new Date(a.upload_date).getTime()
                        )
                        .slice(0, 5)
                        .map((file, index) => (
                            <div key={index} className="relative group">
                                {/* Delete button overlay */}
                                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation
                                            e.stopPropagation(); // Stop event bubbling
                                            handleDeleteDocument(file.resume_id);
                                        }}
                                        disabled={deletingId === file.resume_id}
                                    >
                                        {deletingId === file.resume_id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {/* Document component */}
                                <Document id={file.resume_id} name={file.file_name} />
                            </div>
                        ))}
                    <PlaceholderDocument />
                </div>
            )}
        </div>
    );
}

export default AllDocuments;
