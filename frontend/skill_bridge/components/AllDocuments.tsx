"use client";

import useUpload from "@/hooks/useUpload";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Document from "./Document";
import PlaceholderDocument from "./PlaceholderDocument";

function AllDocuments() {
    const [files, setFiles] = useState<Array<any> | null>(null);

    const { handleFilesGet } = useUpload();

    useEffect(() => {
        const fetchFiles = async () => {
            const fetchedFiles = await handleFilesGet();
            setFiles(fetchedFiles);
            console.log("FETCHED FILES: ", fetchedFiles);
        };

        fetchFiles();
    }, []);

    return (
        <div className={`flex flex-col justify-center items-center ${files? "" : "min-h-screen w-full"}`}>
            {!files ? (
                <div className="flex justify-center items-center">
                    <Loader2Icon className="animate-spin h-16 w-16 text-gray-400" />
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
                            <div key={index}>
                                <div>
                                    <Document id={file.resume_id} name={file.filename} />
                                </div>
                            </div>
                        ))}
                    <PlaceholderDocument />
                </div>
            )}
        </div>
    );
}

export default AllDocuments;
