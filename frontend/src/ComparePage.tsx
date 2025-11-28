import React, { useState, useEffect } from "react";
import { Lightbulb, Menu, Search, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { ResumeEditor } from "./Components/ResumeEditor";
import PdfViewer from "./PdfViewer";
import backend_api from "./services/testapi";

const ComparePage = () => {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("comments");
  const [resumes] = useState([
    { id: 1, name: "Kida_Khanooni" },
    { id: 2, name: "Kida_Khanooni" },
  ]);
  const [commentBoxHeight, setCommentBoxHeight] = useState(150);
  const [leftWidth, setLeftWidth] = useState(15);
  const [middleLeftWidth, setMiddleLeftWidth] = useState(50);
  const [rightWidth, setRightWidth] = useState(15);
  const [rightTab, setRightTab] = useState("ai-insights");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [jobModalContent, setJobModalContent] = useState<string | null>(null);
  const [savedJobDescription, setSavedJobDescription] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showCurrentResume, setShowCurrentResume] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bedrockLoading, setBedrockLoading] = useState(false);
  const [bedrockResult, setBedrockResult] = useState<any | null>(null);
  const [bedrockError, setBedrockError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);

  const handleAIAnalysis = async () => {
    if (!savedJobDescription) {
      alert("Please add a job description first");
      return;
    }

    setAnalyzing(true);
    setAiAnalysisResult("");
    setApiError(null);

    try {
      const resumeResponse = await backend_api.get("/resumes/000000/000005");
      const resumeData = resumeResponse.data;
      console.log("Resume data received:", resumeData);

      const response = await backend_api.post("/analyze-resume", {
        resumeData: resumeData,
        jobDescription: savedJobDescription,
      });

      if (response.data.success) {
        setAiAnalysisResult(response.data.result);
      } else {
        setApiError(response.data.error || "Analysis failed");
      }
    } catch (error: any) {
      console.error("AI analysis failed:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to analyze resume - please try again";
      setApiError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  // Bedrock (RAG) query handler - FIXED VERSION
  const handleBedrockQuery = async () => {
    if (!globalSearchQuery || !globalSearchQuery.trim()) {
      setBedrockError("Please enter a query");
      setBedrockResult(null);
      setShowSearchResults(false);
      return;
    }

    setBedrockLoading(true);
    setBedrockError(null);
    setBedrockResult(null);
    setShowSearchResults(false);

    try {
      const response = await backend_api.post("/bedrock/query", {
        query: globalSearchQuery,
      });
      
      console.log("Backend response:", response.data);
      
      // Set the raw result for debugging
      setBedrockResult(response.data);
      
      // Parse the response to extract resume information
      const parsedResults = parseResumeResults(response.data);
      console.log("Parsed results:", parsedResults);
      
      setSearchResults(parsedResults);
      setShowSearchResults(true);
      
    } catch (error: any) {
      console.error("Bedrock query failed:", error);
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Bedrock query failed";
      setBedrockError(msg);
    } finally {
      setBedrockLoading(false);
    }
  };

  // Parse the backend response to extract resume information
  // Replace the parseResumeResults function with this:

// Parse the backend response to extract resume information from JSON data
const parseResumeResults = (result: any) => {
  const results = [];
  
  console.log("Full backend result:", result);
  
  // Strategy 1: Check if backend returns direct resume objects in citations or retrievedReferences
  if (result.citations && Array.isArray(result.citations)) {
    result.citations.forEach((citation: any) => {
      if (citation.retrievedReferences && Array.isArray(citation.retrievedReferences)) {
        citation.retrievedReferences.forEach((ref: any) => {
          // Extract resume ID and name from the reference
          const resumeId = extractResumeId(ref);
          const resumeName = extractResumeName(ref);
          if (resumeId) {
            results.push({
              id: resumeId,
              name: resumeName || `Resume ${resumeId}`,
              type: 'resume',
              snippet: `Click to view resume ${resumeId}`,
              fullContent: JSON.stringify(ref, null, 2)
            });
          }
        });
      }
    });
  }
  
  // Strategy 2: Check if there's direct resume data in the output
  if (result.output?.text) {
    const text = result.output.text;
    
    // Look for resume IDs in the format that your RAG system returns
        // Try multiple patterns that might indicate resume IDs
        const patterns = [
          /\bresume\s+(?:id|ID)?\s*:?\s*(\d{5,6})\b/gi,
          /\bID\s*:?\s*(\d{5,6})\b/gi,
          /\b(\d{5,6})\b/g,
          /\[(\d{5,6})\]/g
        ];
        
        let foundIds: string[] = [];
        for (const pattern of patterns) {
          const matches = text.match(pattern);
          if (matches && matches.length > 0) {
            foundIds = matches
              .map((match: string) => {
                const idMatch = match.match(/\d{5,6}/);
                return idMatch ? idMatch[0] : null;
              })
              .filter((id: string | null): id is string => Boolean(id));
            if (foundIds.length > 0) break;
          }
        }
        
        // Extract names from the text
    const nameMatches = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g) || [];
    
    console.log("Found resume IDs in text:", foundIds);
    console.log("Found names in text:", nameMatches);
    
    // Create results from found IDs
    if (foundIds.length > 0) {
      foundIds.forEach((id: string, index: number) => {
        const name = nameMatches[index] || `Resume ${id}`;
        results.push({
          id: id,
          name: name,
          type: 'resume',
          snippet: `Resume ID: ${id} - Click to view`,
          fullContent: text
        });
      });
    }
  }
  
  // Strategy 3: Check for raw JSON resume data
  if (result.raw && typeof result.raw === 'object') {
    const rawData = result.raw;
    // Look for resume-like structures in the raw data
    const resumeId = findResumeIdInObject(rawData);
    if (resumeId) {
      results.push({
        id: resumeId,
        name: findResumeNameInObject(rawData) || `Resume ${resumeId}`,
        type: 'resume',
        snippet: "Found in raw data - Click to view",
        fullContent: JSON.stringify(rawData, null, 2)
      });
    }
  }
  
  // Strategy 4: If we have the generated text but no IDs, try to extract context
  if (results.length === 0 && result.output?.text) {
    const text = result.output.text;
    // Check if this looks like it's talking about specific resumes
    if (text.includes('resume') || text.includes('Resume')) {
      // Create a result based on the search context
      results.push({
        id: "000005", // Fallback to a common ID
        name: "Search Result",
        type: 'resume', 
        snippet: text.substring(0, 100) + '...',
        fullContent: text
      });
    }
  }
  
  // Remove duplicates based on ID
  const uniqueResults = results.filter((result, index, self) => 
    index === self.findIndex(r => r.id === result.id)
  );
  
  console.log("Final parsed results:", uniqueResults);
  return uniqueResults;
};

// Helper functions to extract resume data from different parts of the response
const extractResumeId = (data: any): string | null => {
  if (!data) return null;
  
  // Check common fields where resume ID might be stored
  const idFields = ['id', 'resumeId', 'resume_id', 'documentId', 'docId'];
  
  for (const field of idFields) {
    if (data[field] && typeof data[field] === 'string') {
      const idMatch = data[field].match(/\d{5,6}/);
      if (idMatch) return idMatch[0];
    }
  }
  
  // Check content fields for IDs
  const contentFields = ['content', 'text', 'document', 'metadata'];
  for (const field of contentFields) {
    if (data[field] && typeof data[field] === 'string') {
      const idMatch = data[field].match(/\b\d{5,6}\b/);
      if (idMatch) return idMatch[0];
    }
  }
  
  return null;
};

const extractResumeName = (data: any): string | null => {
  if (!data) return null;
  
  // Check for name fields
  const nameFields = ['name', 'resumeName', 'candidateName', 'author', 'user'];
  for (const field of nameFields) {
    if (data[field] && typeof data[field] === 'string') {
      const nameMatch = data[field].match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
      if (nameMatch) return nameMatch[0];
    }
  }
  
  // Check content for names
  const contentFields = ['content', 'text'];
  for (const field of contentFields) {
    if (data[field] && typeof data[field] === 'string') {
      const nameMatch = data[field].match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
      if (nameMatch) return nameMatch[0];
    }
  }
  
  return null;
};

const findResumeIdInObject = (obj: any): string | null => {
  if (!obj || typeof obj !== 'object') return null;
  
  // Recursively search for resume IDs in the object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        const idMatch = value.match(/\b\d{5,6}\b/);
        if (idMatch) return idMatch[0];
      } else if (typeof value === 'object' && value !== null) {
        const foundId = findResumeIdInObject(value);
        if (foundId) return foundId;
      }
    }
  }
  
  return null;
};

const findResumeNameInObject = (obj: any): string | null => {
  if (!obj || typeof obj !== 'object') return null;
  
  // Recursively search for names in the object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        const nameMatch = value.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
        if (nameMatch) return nameMatch[0];
      } else if (typeof value === 'object' && value !== null) {
        const foundName = findResumeNameInObject(value);
        if (foundName) return foundName;
      }
    }
  }
  
  return null;
};

  const handleResultClick = (resume: any) => {
    console.log("Selected resume:", resume);
    setSelectedResume(resume);
    setShowCurrentResume(true);
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Resize Handlers ---
  const handleCommentResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = commentBoxHeight;
    function handleMouseMove(moveEvent: MouseEvent) {
      const deltaY = -moveEvent.clientY + startY;
      const newHeight = Math.max(0, Math.min(startHeight + deltaY, 400));
      setCommentBoxHeight(newHeight);
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleLeftResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    function handleMouseMove(moveEvent: MouseEvent) {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth + deltaPercent, 40));
      setLeftWidth(newWidth);
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMiddleResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = middleLeftWidth;
    function handleMouseMove(moveEvent: MouseEvent) {
      const containerWidth = window.innerWidth - 48;
      const middleTotal = 100 - leftWidth - rightWidth;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(
        30,
        Math.min(startWidth + (deltaPercent / middleTotal) * 100, 70)
      );
      setMiddleLeftWidth(newWidth);
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRightResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;
    function handleMouseMove(moveEvent: MouseEvent) {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth - deltaPercent, 40));
      setRightWidth(newWidth);
    }
    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleJobSubmit = () => {
    if (jobModalContent && jobModalContent.trim()) {
      setSavedJobDescription(jobModalContent);
      setJobModalContent(null);
    }
  };

  const handleEditJob = () => {
    setJobModalContent(savedJobDescription);
  };

  const handleAddJob = () => {
    setJobModalContent("");
  };

  const handleCloseModal = () => {
    setJobModalContent(null);
  };

  const handleResumeClick = () => {
    setShowCurrentResume(true);
  };

  const middleTotal = sidebarCollapsed
    ? 100 - rightWidth
    : 100 - leftWidth - rightWidth;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "1.5rem",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Top Search Bar - UPDATED WITH DROPDOWN */}
      <div
        className="search-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          marginBottom: "0.5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search for resumes..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            onFocus={(e) => {
              searchResults.length > 0 && setShowSearchResults(true);
              e.currentTarget.style.backgroundColor = "#c4c8cc";
            }}
            style={{
              width: "100%",
              paddingLeft: "2.75rem",
              paddingRight: "1rem",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
              backgroundColor: "#d1d5db",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              color: "#111827",
              outline: "none",
              boxSizing: "border-box",
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = "#d1d5db";
            }}
          />
          
          {/* SEARCH RESULTS DROPDOWN - THIS IS WHAT YOU WANT */}
          {showSearchResults && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "white",
                border: "1px solid #dfe1e5",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 6px rgba(32, 33, 36, 0.28)",
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
                marginTop: "8px",
              }}
            >
              {searchResults.map((result, index) => (
                <div
                  key={result.id || index}
                  onClick={() => handleResultClick(result)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f3f4",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <Lightbulb size={16} color="#1a73e8" />
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: "14px", 
                      color: "#1a0dab",
                      fontWeight: 500,
                      marginBottom: "2px"
                    }}>
                      {result.name}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#5f6368",
                    }}>
                      ID: {result.id} • {result.snippet}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search button */}
          <div
            style={{
              marginTop: "0.5rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleBedrockQuery}
              disabled={bedrockLoading || !globalSearchQuery.trim()}
              style={{
                backgroundColor: bedrockLoading ? "#9ca3af" : "#10b981",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor:
                  bedrockLoading || !globalSearchQuery.trim()
                    ? "not-allowed"
                    : "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              {bedrockLoading ? "Searching..." : "Search Resumes"}
            </button>
          </div>

          {/* Error display - KEEP THIS FOR DEBUGGING */}
          {bedrockError && (
            <div style={{ 
              color: "#dc2626", 
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              textAlign: "center"
            }}>
              Error: {bedrockError}
            </div>
          )}
        </div>
      </div>

      {/* Main Flex Layout */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div
          style={{
            width: `${leftWidth}%`,
            backgroundColor: "white",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            borderRadius: "1rem",
            minWidth: "150px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Header Section with Menu and Search */}
          <div
            style={{
              marginBottom: "1rem",
              flexShrink: 0,
            }}
          >
            {/* Title and Menu Icon Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              {/* Menu Button */}
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Menu size={20} color="#374151" />
              </div>

              {/* Section Title */}
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0,
                  lineHeight: 1,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Recent Resumes
              </h2>
            </div>

            {/* Search Input with Icon */}
            <div
              style={{
                position: "relative",
                marginBottom: "1rem",
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem 0.5rem 2.5rem",
                  backgroundColor: "#f3f4f6",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "background-color 0.15s ease",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e5e7eb")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
              />
            </div>
          </div>

          {/* Scrollable Resume List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {/* Map through resumes array to create resume items */}
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={handleResumeClick}
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "#f3f4f6",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e5e7eb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
              >
                {/* Resume Item Header with Name and Options */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.25rem",
                  }}
                >
                  {/* Resume Name */}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#111827",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    {resume.name}
                  </span>
                  {/* Options Menu (three lines) */}
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    ...
                  </div>
                </div>
                {/* Last Modified Date */}
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  2 days ago
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resize Handle 1 */}
        <div
          style={{
            width: "8px",
            cursor: "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseDown={handleLeftResize}
        >
          <div
            style={{
              width: "3px",
              height: "40px",
              backgroundColor: "#d1d5db",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            width: `${middleTotal}%`,
            display: "flex",
            gap: "0.5rem",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {/* Current Resume Panel */}
          {(showCurrentResume || selectedResume) && (
            <>
              <div
                style={{
                  width: `${middleLeftWidth}%`,
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  padding: "1.5rem",
                  border: "2px solid #34d399",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "250px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                    flexShrink: 0,
                  }}
                >
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#513739",
                      margin: 0,
                      flex: 1,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    {selectedResume ? `${selectedResume.name} - Resume` : "Current Resume"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCurrentResume(false);
                      setSelectedResume(null);
                    }}
                    style={{
                      backgroundColor: "#e5e7eb",
                      border: "none",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d1d5db")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e5e7eb")
                    }
                  >
                    <X size={16} color="#6b7280" />
                  </button>
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#fbf9fa",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    overflow: "hidden",
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <PdfViewer 
                    userId={"000000"} 
                    resumeId={selectedResume ? selectedResume.id : "000005"} 
                  />
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    height: "8px",
                    cursor: "ns-resize",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                    flexShrink: 0,
                  }}
                  onMouseDown={handleCommentResize}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "3px",
                      backgroundColor: "#d1d5db",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => setActiveTab("comments")}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius:
                        activeTab === "comments" ? "1.25rem" : "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                      backgroundColor:
                        activeTab === "comments" ? "#10b981" : "transparent",
                      color: activeTab === "comments" ? "white" : "#6b7280",
                      border: "none",
                      cursor: "pointer",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Comments
                  </button>
                  <button
                    onClick={() => setActiveTab("job-description")}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius:
                        activeTab === "job-description"
                          ? "1.25rem"
                          : "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: "500",
                      backgroundColor:
                        activeTab === "job-description"
                          ? "#10b981"
                          : "transparent",
                      color:
                        activeTab === "job-description" ? "white" : "#6b7280",
                      border: "none",
                      cursor: "pointer",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Job Description
                  </button>
                </div>

                <div
                  className="hide-scrollbar"
                  style={{
                    backgroundColor: "#f9fafb",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    height: `${commentBoxHeight}px`,
                    overflowY: "auto",
                    minHeight: 0,
                    flexShrink: 0,
                    display: commentBoxHeight === 0 ? "none" : "block",
                  }}
                >
                  {activeTab === "comments" && (
                    <div
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Comments section
                    </div>
                  )}
                  {activeTab === "job-description" && (
                    <div
                      style={{
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Job Description
                    </div>
                  )}
                </div>
              </div>

              {/* Resize Handle 2 */}
              <div
                style={{
                  width: "8px",
                  cursor: "ew-resize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                onMouseDown={handleMiddleResize}
              >
                <div
                  style={{
                    width: "3px",
                    height: "40px",
                    backgroundColor: "#d1d5db",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
            </>
          )}

          {/* Generated Resume Panel */}
          <div
            className="hide-scrollbar"
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "1.5rem",
              border: "2px solid #34d399",
              display: "flex",
              flexDirection: "column",
              minWidth: "250px",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <ResumeEditor userId="000000" resumeId="000005" />
          </div>
        </div>

        {/* Resize Handle 3 */}
        <div
          style={{
            width: "8px",
            cursor: "ew-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          onMouseDown={handleRightResize}
        >
          <div
            style={{
              width: "3px",
              height: "40px",
              backgroundColor: "#d1d5db",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        {/* AI Insights Sidebar */}
        <div
          style={{
            width: `${rightWidth}%`,
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            padding: "1.5rem",
            minWidth: "150px",
            boxSizing: "border-box",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setRightTab("ai-insights")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius:
                  rightTab === "ai-insights" ? "1.25rem" : "0.375rem",
                fontSize: "0.8125rem",
                fontWeight: "500",
                backgroundColor:
                  rightTab === "ai-insights" ? "#10b981" : "transparent",
                color: rightTab === "ai-insights" ? "white" : "#6b7280",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <Lightbulb
                style={{
                  width: "1rem",
                  height: "1rem",
                  flexShrink: 0,
                }}
              />
              AI Insights
            </button>
            <button
              onClick={() => setRightTab("job-description")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius:
                  rightTab === "job-description" ? "1.25rem" : "0.375rem",
                fontSize: "0.8125rem",
                fontWeight: "500",
                backgroundColor:
                  rightTab === "job-description" ? "#10b981" : "transparent",
                color: rightTab === "job-description" ? "white" : "#6b7280",
                border: "none",
                cursor: "pointer",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Job Description
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
            }}
          >
            {rightTab === "job-description" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {!savedJobDescription ? (
                  <>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        textAlign: "center",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Add a job description to get AI-powered insights and
                      recommendations.
                    </p>
                    <button
                      onClick={handleAddJob}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.625rem 1.5rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: "none",
                        cursor: "pointer",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Add Job Description
                    </button>
                  </>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        borderRadius: "0.5rem",
                        padding: "1rem",
                        fontSize: "0.875rem",
                        color: "#374151",
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "300px",
                        overflowY: "auto",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      {savedJobDescription}
                    </div>
                    <button
                      onClick={handleEditJob}
                      style={{
                        backgroundColor: "transparent",
                        color: "#10b981",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        border: "1px solid #10b981",
                        cursor: "pointer",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}

            {rightTab === "ai-insights" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={handleAIAnalysis}
                    disabled={!savedJobDescription || analyzing}
                    style={{
                      backgroundColor: savedJobDescription
                        ? "#10b981"
                        : "#9ca3af",
                      color: "white",
                      padding: "0.625rem 1.5rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      border: "none",
                      cursor:
                        savedJobDescription && !analyzing
                          ? "pointer"
                          : "not-allowed",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      width: "100%",
                      maxWidth: "200px",
                    }}
                  >
                    {analyzing ? "Analyzing..." : "Get AI Insights"}
                  </button>

                  {!savedJobDescription && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        textAlign: "center",
                        fontStyle: "italic",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      Add a job description first to get AI insights
                    </p>
                  )}
                </div>

                {aiAnalysisResult && (
                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "0.875rem",
                      color: "#374151",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowY: "auto",
                      flex: 1,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {aiAnalysisResult}
                  </div>
                )}

                {apiError && (
                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "0.875rem",
                      color: "#dc2626",
                      lineHeight: "1.5",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      border: "1px solid #fecaca",
                    }}
                  >
                    Error: {apiError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Description Modal */}
        {jobModalContent !== null && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#111827",
                    margin: 0,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {savedJobDescription
                    ? "Edit Job Description"
                    : "Add Job Description"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.375rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <X size={20} color="#6b7280" />
                </button>
              </div>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1.5rem",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Paste job description or job URL
              </p>

              <textarea
                value={jobModalContent}
                onChange={(e) => setJobModalContent(e.target.value)}
                placeholder="Paste job description text or URL here..."
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#d5f8e2",
                  color: "#064e3b",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.backgroundColor = "#dcfce7";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.backgroundColor = "#f0fdf4";
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={handleCloseModal}
                  style={{
                    padding: "0.625rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={handleJobSubmit}
                  style={{
                    padding: "0.625rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;