import React, { useState, useEffect } from "react";
import { Lightbulb, Menu, Search, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { ResumeEditor } from "./Components/ResumeEditor";
import PdfViewer from "./PdfViewer";
import backend_api from "./services/testapi";

// Simplified types
interface SearchResult {
  resume_id: string;
  user_id: string;
  name: string;
  score?: number;
}

interface BedrockResult {
  searchResults?: SearchResult[];
  generatedText?: string;
  raw?: any;
}

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
  const [bedrockResult, setBedrockResult] = useState<BedrockResult | null>(
    null
  );
  const [bedrockError, setBedrockError] = useState<string | null>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Parse search results from `bedrockResult.generatedText`.
  // Expected format: '{name:Allen Zheng,user_id:000000,resume_id:000010}'
  const getSearchResults = (): SearchResult[] => {
    console.log("getSearchResult function called...");
    console.log(bedrockResult);

    const raw = bedrockResult?.generatedText;
    if (!raw) return [];

    // Remove surrounding braces if present
    const trimmed = raw.trim();
    const bodyMatch = /^\{\s*(.*)\s*\}$/.exec(trimmed);
    const body = bodyMatch ? bodyMatch[1] : trimmed;

    // Match key:value pairs where value can include spaces but not commas
    const pairRegex = /(\w+)\s*:\s*([^,]+)/g;
    let m: RegExpExecArray | null;

    let name = "";
    let user_id = "";
    let resume_id = "";

    while ((m = pairRegex.exec(body)) !== null) {
      const key = m[1];
      const val = m[2].trim();
      if (key === "name") name = val;
      else if (key === "user_id") user_id = val;
      else if (key === "resume_id") resume_id = val;
    }

    // Fallback: if fields missing, try simpler heuristics
    if (!resume_id) {
      // try to find resume_id by searching for 'resume_id:' anywhere
      const r = /resume_id\s*:\s*([^,}]+)/.exec(body);
      if (r) resume_id = r[1].trim();
    }

    if (!user_id) {
      const u = /user_id\s*:\s*([^,}]+)/.exec(body);
      if (u) user_id = u[1].trim();
    }

    if (!name) {
      const n = /name\s*:\s*([^,}]+)/.exec(body);
      if (n) name = n[1].trim();
    }

    // Final fallback: if nothing parsed, return the raw string as resume_id
    if (!resume_id && body) resume_id = body;

    return [
      {
        resume_id,
        user_id,
        name,
      },
    ];
  };

  const searchResults = getSearchResults();

  // Simplified Bedrock query handler
  const handleBedrockQuery = async () => {
    if (!globalSearchQuery.trim()) {
      setBedrockError("Please enter a search query");
      setBedrockResult(null);
      return;
    }

    setBedrockLoading(true);
    setBedrockError(null);
    setBedrockResult(null);

    try {
      const response = await backend_api.post("/bedrock/query", {
        query: globalSearchQuery,
      });

      console.log("Search response:", response.data);
      setBedrockResult(response.data);
      setShowSearchDropdown(true);
    } catch (error: any) {
      console.error("Search failed:", error);
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Search failed - please try again";
      setBedrockError(msg);
    } finally {
      setBedrockLoading(false);
    }
  };

  const handleResumeSelect = (userId: string, resumeId: string) => {
    console.log("Selected resume:", userId, resumeId);
    setSelectedUserId(userId);
    setSelectedResumeId(resumeId);
    setShowCurrentResume(true);
    setShowSearchDropdown(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchQuery(e.target.value);
    if (showSearchDropdown) {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBedrockQuery();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // --- Resize Handlers (unchanged) ---
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
      {/* Top Search Bar - Centered and Shorter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          marginBottom: "0.5rem",
        }}
      >
        <div
          className="search-container"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search resumes (e.g., 'best AWS resume' or 'resume with sports experience')"
              value={globalSearchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              onClick={() => {
                if (searchResults.length > 0) {
                  setShowSearchDropdown(true);
                }
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
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "#c4c8cc";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "#d1d5db";
              }}
            />
          </div>

          <button
            onClick={handleBedrockQuery}
            disabled={bedrockLoading || !globalSearchQuery.trim()}
            style={{
              backgroundColor: bedrockLoading ? "#9ca3af" : "#10b981",
              color: "white",
              padding: "0.625rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor:
                bedrockLoading || !globalSearchQuery.trim()
                  ? "not-allowed"
                  : "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              whiteSpace: "nowrap",
              height: "38px",
            }}
          >
            {bedrockLoading ? "Searching..." : "Search"}
          </button>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                left: 0,
                right: "calc(0px + 120px)",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                marginTop: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#475569",
                }}
              >
                Found {searchResults.length} resumes:
              </div>
              {searchResults.map((result: SearchResult, index: number) => (
                <div
                  key={`${result.user_id}-${result.resume_id}`}
                  onClick={() =>
                    handleResumeSelect(result.user_id, result.resume_id)
                  }
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #f3f4f6",
                    fontSize: "0.875rem",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}
                >
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    {result.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    User: {result.user_id} | Resume: {result.resume_id}
                    {result.score && (
                      <span style={{ marginLeft: "0.5rem", color: "#10b981" }}>
                        (Score: {(result.score * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Display */}
          {bedrockError && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "#fef2f2",
                borderRadius: "0.375rem",
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                left: 0,
                right: 0,
                zIndex: 999,
              }}
            >
              {bedrockError}
            </div>
          )}
        </div>
      </div>

      {/* Main Flex Layout */}
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#F3F4F6",
        }}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

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
          {(showCurrentResume || selectedResumeId) && (
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
                    Current Resume{" "}
                    {selectedResumeId &&
                      `- User: ${selectedUserId} | Resume: ${selectedResumeId}`}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCurrentResume(false);
                      setSelectedResumeId(null);
                      setSelectedUserId(null);
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
                    userId={selectedUserId || "0"}
                    resumeId={selectedResumeId || "0"}
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
            <ResumeEditor userId="0" resumeId="0" />
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
