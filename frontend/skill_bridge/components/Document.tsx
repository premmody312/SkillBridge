"use client";

// import useUpload from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import byteSize from "byte-size";
import { FileIcon, Loader2Icon } from "lucide-react";

function Document({ id, name }: { id: string; name: string }) {
    const router = useRouter();

    // const [file, setFile] = useState<Blob | null>(null);

    // const { handleFileGet } = useUpload();

    // useEffect(() => {
    //     const fetchFile = async () => {
    //         const file = await handleFileGet(id);
    //         setFile(file);
    //     };

    //     fetchFile();
    // }, [id]);

    return (
        <div
            className={`flex flex-col w-64 h-80 rounded-2xl bg-white shadow-lg ${
                !true ? "justify-center items-center" : "justify-between"
            } p-6 transition-all transform hover:scale-105 hover:shadow-2xl hover:bg-gray-100 cursor-pointer group`}
            onClick={() => true && router.push(`/dashboard/viewFile/${id}`)}
        >
            {!true ? (
                <Loader2Icon className="animate-spin h-12 w-12 text-gray-400" />
            ) : (
                <>
                    <div className="flex flex-col items-start space-y-2">
                        <p className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 overflow-hidden text-ellipsis break-all line-clamp-2">
                            {name}
                        </p>
                        {/* <p className="text-sm text-gray-500 group-hover:text-gray-700">
                            {byteSize(file.size).value} KB
                        </p> */}
                    </div>
                    <div className="flex justify-center items-center h-40 pb-10">
                        <FileIcon
                            size={48}
                            className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Document;
