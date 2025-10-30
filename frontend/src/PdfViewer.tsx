import { useEffect, useRef, useState } from "react";

export default function PdfViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Path to your test file — update when needed
  const localFilePath = "C:\\Users\\tausi\\Downloads\\ecs1100.pdf";

  // Store the current blob URL for cleanup
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("[PdfViewer] requesting load-pdf for:", localFilePath);

        if (!window || !window.electron || !window.electron.ipcRenderer) {
          throw new Error("window.electron.ipcRenderer is not available (preload missing)");
        }

        const base64Data: string = await window.electron.ipcRenderer.invoke("load-pdf", localFilePath);
        console.log("[PdfViewer] received base64 length:", base64Data?.length ?? "undefined");

        if (!base64Data) throw new Error("Received empty PDF data");

        // convert base64 -> Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const pdfBlob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);

        // revoke old blob URL if exists
        if (blobUrlRef.current) {
          try {
            URL.revokeObjectURL(blobUrlRef.current);
          } catch {
            /* ignore */
          }
        }

        blobUrlRef.current = url;

        if (mounted) {
          setPdfUrl(url);
          setIsLoading(false);
          console.log("[PdfViewer] blob url created and set");
        } else {
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        console.error("[PdfViewer] failed to load PDF:", err);
        if (mounted) {
          setError("Failed to load PDF: " + ((err as Error).message ?? String(err)));
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      mounted = false;
      if (blobUrlRef.current) {
        try {
          URL.revokeObjectURL(blobUrlRef.current);
        } catch {
          /* ignore */
        }
        blobUrlRef.current = null;
      }
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    background: "#fbf9fa",
    borderRadius: 8,
    overflow: "hidden",
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ margin: "auto", fontSize: 16 }}>Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ margin: "auto", color: "red", textAlign: "center" }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {pdfUrl ? (
        <iframe
          src={`${pdfUrl}#zoom=55`} // Default zoom level (like pressing "+" once)
          title="PDF Viewer"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            backgroundColor: "#fff",
          }}
        />
      ) : (
        <div style={{ margin: "auto" }}>No PDF</div>
      )}
    </div>
  );
}
