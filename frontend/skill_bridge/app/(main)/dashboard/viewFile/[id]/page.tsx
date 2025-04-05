import PdfView from "@/components/PdfView";
import React from "react";

function PdfViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  return (
    <div>
      <PdfView id={id} />
    </div>
  );
}

export default PdfViewPage;