import { useState, useEffect } from "react";

export default function SimplePdfViewer({ filePath }: { filePath?: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pdfFilePath =
    filePath || "C:\\Users\\Plasm\\Downloads\\Allen_Zheng_Resume.pdf";

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const base64Data = await window.electron.ipcRenderer.invoke(
          "load-pdf",
          pdfFilePath
        );

        // Convert base64 to binary
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Create blob and URL
        const pdfBlob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        console.log("PDF URL created successfully");
      } catch (error) {
        console.error("Failed to load PDF:", error);
        setError("Failed to load PDF: " + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfFilePath]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-lg">Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-red-500 text-center">
          <div className="text-lg font-semibold">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full bg-gray-50"
      style={{
        display: "flex",
        flex: 1,
        overflow: "auto", // Add scrollbar
      }}
    >
      {pdfUrl && (
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} // Changed to FitH so content flows vertically
          className="w-full border-0"
          title="PDF Viewer"
          style={{
            width: "150%",
            height: "max-content", // Changed from 100% to allow natural height
            minHeight: "100%", // Ensures it's at least full height
            border: "none",
            zoom: "100%",
            display: "block",
          }}
        />
      )}
    </div>
  );
}
