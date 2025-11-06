import { useState, useEffect } from "react";
import { generateResumePdf } from "./services/testapi";

export default function SimplePdfViewer({
  filePath,
  userId,
  resumeId,
}: {
  filePath?: string;
  userId: string;
  resumeId: string;
}) {
  // runtime guard: require userId and resumeId
  if (!userId || !resumeId) {
    throw new Error(
      "SimplePdfViewer requires both `userId` and `resumeId` props."
    );
  }
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If a filePath prop is provided and window.electron is available, load local file.
  useEffect(() => {
    let mounted = true;
    const loadLocal = async () => {
      if (!filePath || !(window as any).electron) return;
      setIsLoading(true);
      setError(null);
      try {
        const base64Data = await (window as any).electron.ipcRenderer.invoke(
          "load-pdf",
          filePath
        );
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++)
          bytes[i] = binaryString.charCodeAt(i);
        const pdfBlob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        if (mounted) setPdfUrl(url);
      } catch (e: any) {
        console.error("Failed to load local PDF:", e);
        if (mounted) setError("Failed to load local PDF: " + (e && e.message));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadLocal();
    return () => {
      mounted = false;
    };
  }, [filePath]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // auto-generate PDF when component mounts (or when userId/resumeId change)
  useEffect(() => {
    let mounted = true;
    const generate = async () => {
      setIsLoading(true);
      setError(null);
      setPdfUrl(null);
      try {
        const blob = await generateResumePdf(userId, resumeId);
        if (!mounted) return;
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (e: any) {
        console.error("Failed to generate PDF on mount:", e);
        if (mounted) setError("Failed to generate PDF: " + (e && e.message));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // trigger generation automatically
    generate();

    return () => {
      mounted = false;
    };
  }, [userId, resumeId]);

  return (
    <div
      className="w-full h-full bg-gray-50 p-4"
      style={{ display: "flex", flex: 1, overflow: "auto" }}
    >
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title="PDF Viewer"
          style={{
            width: "150%",
            height: "max-content",
            minHeight: "100%",
            border: "none",
            zoom: "100%",
            display: "block",
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          {error ? (
            <div className="text-red-600 text-center">{error}</div>
          ) : (
            <div className="text-lg">
              {isLoading ? "Loading PDF..." : "No PDF to display"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
