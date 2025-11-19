import React, { useState, useEffect } from "react";
import { Lightbulb, Menu, Search, X } from "lucide-react";
import { ResumeEditor } from "./Components/ResumeEditor";
import PdfViewer from "./PdfViewer";
import backend_api from "./services/testapi";

const ComparePage = () => {
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
  const [apiResult, setApiResult] = useState<any>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [jobModalContent, setJobModalContent] = useState<string | null>(null);
  const [savedJobDescription, setSavedJobDescription] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showCurrentResume, setShowCurrentResume] = useState(false);

  useEffect(() => {
    if (rightTab !== "ai-insights") return;
    let cancelled = false;
    const fetchResumes = async () => {
      setLoadingApi(true);
      setApiError(null);
      try {
        const res = await backend_api.get("/resumes");
        if (!cancelled) setApiResult(res.data);
      } catch (err: any) {
        if (!cancelled) setApiError(err?.message || String(err));
      } finally {
        if (!cancelled) setLoadingApi(false);
      }
    };
    fetchResumes();
    return () => {
      cancelled = true;
    };
  }, [rightTab]);

  const handleAIAnalysis = async () => {
    if (!savedJobDescription) {
      alert('Please add a job description first');
      return;
    }

    setAnalyzing(true);
    setAiAnalysisResult("");
    setApiError(null);

    try {
      const resumeResponse = await backend_api.get('/resumes/000000/000005');
      const resumeData = resumeResponse.data;
      console.log('Resume data received:', resumeData);

      const response = await backend_api.post('/analyze-resume', {
        resumeData: resumeData,
        jobDescription: savedJobDescription
      });

      if (response.data.success) {
        setAiAnalysisResult(response.data.result);
      } else {
        setApiError(response.data.error || "Analysis failed");
      }
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to analyze resume - please try again';
      setApiError(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCommentResize = (e: {
    preventDefault: () => void;
    clientY: any;
  }) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = commentBoxHeight;

    const handleMouseMove = (moveEvent: { clientY: number }) => {
      const deltaY = -moveEvent.clientY + startY;
      const newHeight = Math.max(0, Math.min(startHeight + deltaY, 400));
      setCommentBoxHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleLeftResize = (e: {
    preventDefault: () => void;
    clientX: any;
  }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: { clientX: number }) => {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth + deltaPercent, 40));
      setLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMiddleResize = (e: {
    preventDefault: () => void;
    clientX: any;
  }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = middleLeftWidth;

    const handleMouseMove = (moveEvent: { clientX: number }) => {
      const containerWidth = window.innerWidth - 48;
      const middleTotal = 100 - leftWidth - rightWidth;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(
        30,
        Math.min(startWidth + (deltaPercent / middleTotal) * 100, 70)
      );
      setMiddleLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRightResize = (e: {
    preventDefault: () => void;
    clientX: any;
  }) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;

    const handleMouseMove = (moveEvent: { clientX: number }) => {
      const containerWidth = window.innerWidth - 48;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(10, Math.min(startWidth - deltaPercent, 40));
      setRightWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

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

  const middleTotal = 100 - leftWidth - rightWidth;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        gap: "0.5rem",
        padding: "1.5rem",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Left Navigation */}
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
        <div
          style={{
            marginBottom: "1rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
            overflowY: "auto",
          }}
        >
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.25rem",
                }}
              >
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
        {showCurrentResume && (
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
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "1rem",
                flexShrink: 0,
              }}>
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
                  Current Resume
                </h3>
                <button
                  onClick={() => setShowCurrentResume(false)}
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
                <PdfViewer userId={"000000"} resumeId={"000005"} />
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
                    borderRadius: activeTab === "comments" ? "1.25rem" : "0.375rem",
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
                      activeTab === "job-description" ? "1.25rem" : "0.375rem",
                    fontSize: "0.8125rem",
                    fontWeight: "500",
                    backgroundColor:
                      activeTab === "job-description" ? "#10b981" : "transparent",
                    color: activeTab === "job-description" ? "white" : "#6b7280",
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
              borderRadius: rightTab === "ai-insights" ? "1.25rem" : "0.375rem",
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
                    backgroundColor: savedJobDescription ? "#10b981" : "#9ca3af",
                    color: "white",
                    padding: "0.625rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: "none",
                    cursor: savedJobDescription && !analyzing ? "pointer" : "not-allowed",
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
                {savedJobDescription ? "Edit Job Description" : "Add Job Description"}
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
                  border: "none",
                  backgroundColor: "#10b981",
                  color: "white",
                  cursor: "pointer",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;