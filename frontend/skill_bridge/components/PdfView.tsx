"use client";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import useUpload from "@/hooks/useUpload";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfView({ id }: { id: string }) {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [file, setFile] = useState<Blob | null>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [scale, setScale] = useState<number>(1);

    const { handleFileGet } = useUpload();

    useEffect(() => {
        const fetchFile = async () => {
            const file = await handleFileGet(id);
            setFile(file);
        };

        fetchFile();
    }, [id]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
            <div className="sticky top-0 z-50 bg-white shadow-md p-4 rounded-lg max-w-5xl w-full">
                <div className="grid grid-cols-8 gap-4 items-center">
                    <Button
                        variant="outline"
                        disabled={pageNumber === 1}
                        onClick={() => {
                            if (pageNumber > 1) {
                                setPageNumber(pageNumber - 1);
                            }
                        }}
                        className="px-4 py-2"
                    >
                        Previous
                    </Button>
                    <p className="text-center text-gray-700 font-medium col-span-2">
                        Page {pageNumber} of {numPages}
                    </p>
                    <Button
                        variant="outline"
                        disabled={pageNumber === numPages}
                        onClick={() => {
                            if (pageNumber < numPages) {
                                setPageNumber(pageNumber + 1);
                            }
                        }}
                        className="px-4 py-2"
                    >
                        Next
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setRotation((rotation + 90) % 360);
                        }}
                        className="px-4 py-2"
                    >
                        <RotateCw />
                    </Button>
					<Button
                        variant="outline"
                        disabled={scale <= 0.5}
                        onClick={() => {
                            setScale(scale / 1.2);
                        }}
                        className="px-4 py-2"
                    >
                        <ZoomOutIcon />
                    </Button>
					<p className="text-center text-gray-700 font-medium">
                        {(scale * 100).toFixed(0)}%
                    </p>
                    <Button
                        variant="outline"
                        disabled={scale >= 1.5}
                        onClick={() => {
                            setScale(scale * 1.2);
                        }}
                        className="px-4 py-2"
                    >
                        <ZoomInIcon />
                    </Button>
                </div>
            </div>
            {!file || !id ? (
                <Loader2Icon className="animate-spin h-16 w-16 text-gray-400 mt-20" />
            ) : (
                <Document
                    file={file}
                    loading={!file}
                    rotate={rotation}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="mt-10 shadow-lg rounded-lg overflow-hidden"
                >
                    <Page
                        className="shadow-lg"
                        scale={scale * 1.2}
                        pageNumber={pageNumber}
                    />
                </Document>
            )}
        </div>
    );
}

export default PdfView;
