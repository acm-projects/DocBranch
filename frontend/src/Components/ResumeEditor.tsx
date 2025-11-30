import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Plus,
  ChevronDown,
  GripVertical,
  X,
  Edit,
  Save,
  RefreshCw,
} from "lucide-react";
import PdfViewer from ".././PdfViewer";
import axios from "axios";

// field interface
export interface FieldData {
  id: string;
  label: string;
  value: string;
  type:
    | "text"
    | "textarea"
    | "date"
    | "email"
    | "tel"
    | "url"
    | "links"
    | "list";
  isEditing?: boolean;
}

interface SectionData {
  id: string;
  title: string;
  fields: FieldData[];
  isOpen: boolean;
  allowMultipleEntries: boolean;
}

// Default sections
const defaultSections: SectionData[] = [
  {
    id: "personal",
    title: "Personal Information",
    isOpen: false,
    allowMultipleEntries: false,
    fields: [
      { id: "name", label: "Full Name", value: "", type: "text" },
      { id: "email", label: "Email", value: "", type: "email" },
      { id: "phone", label: "Phone", value: "", type: "tel" },
      { id: "address", label: "Address", value: "", type: "text" },
      { id: "links", label: "Links", value: "[]", type: "links" },
    ],
  },
  {
    id: "education",
    title: "Education",
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      {
        id: "institution",
        label: "Institution",
        value: "",
        type: "text",
      },
      { id: "location", label: "Location", value: "", type: "text" },
      { id: "majors", label: "Majors", value: "[]", type: "list" },
      { id: "minors", label: "Minors", value: "[]", type: "list" },
      { id: "start_date", label: "Start Date", value: "", type: "text" },
      { id: "end_date", label: "End Date", value: "", type: "text" },
      { id: "GPA", label: "GPA", value: "", type: "text" },
      { id: "description", label: "Description", value: "[]", type: "list" },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: "position", label: "Position", value: "", type: "text" },
      { id: "company", label: "Company", value: "", type: "text" },
      { id: "startDate", label: "Start Date", value: "", type: "date" },
      { id: "endDate", label: "End Date", value: "", type: "date" },
      { id: "description", label: "Description", value: "", type: "textarea" },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: "project_name", label: "Name", value: "", type: "text" },
      { id: "technologies", label: "Technologies", value: "[]", type: "list" },
      { id: "start_date", label: "Start Date", value: "", type: "date" },
      { id: "end_date", label: "End Date", value: "", type: "date" },
      { id: "role", label: "Role", value: "", type: "text" },
      { id: "description", label: "Description", value: "[]", type: "list" },
    ],
  },
  {
    id: "skills",
    title: "Skills",
    isOpen: false,
    allowMultipleEntries: false,
    fields: [
      {
        id: "technical",
        label: "Technical Skills",
        value: "",
        type: "textarea",
      },
      { id: "soft", label: "Soft Skills", value: "", type: "textarea" },
      { id: "languages", label: "Languages", value: "", type: "text" },
    ],
  },
  {
    id: "organizations",
    title: "Organizations",
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: "orgName", label: "Organization Name", value: "", type: "text" },
      { id: "role", label: "Role", value: "", type: "text" },
      { id: "start_date", label: "Start Date", value: "", type: "date" },
      { id: "end_date", label: "End Date", value: "", type: "date" },
      { id: "activities", label: "Activities", value: "", type: "textarea" },
    ],
  },
  {
    id: "awards",
    title: "Awards/Honors",
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: "awardName", label: "Award Name", value: "", type: "text" },
      { id: "issuer", label: "Issuer", value: "", type: "text" },
      { id: "date", label: "Date", value: "", type: "date" },
      { id: "description", label: "Description", value: "", type: "textarea" },
    ],
  },
];

interface ResumeEditorProps {
  userId: string;
  resumeId: string;
}

const additionalSectionTemplates = [
  { title: "Projects", allowMultipleEntries: true },
  { title: "Certifications", allowMultipleEntries: true },
  { title: "Publications", allowMultipleEntries: true },
  { title: "Volunteer Work", allowMultipleEntries: true },
  { title: "References", allowMultipleEntries: true },
  { title: "Summary", allowMultipleEntries: false },
  { title: "Interests", allowMultipleEntries: false },
];

// Resume Section Component
interface ResumeSectionProps {
  fields: FieldData[];
  onFieldsChange: (fields: FieldData[]) => void;
  isOpen?: boolean;
  allowMultipleEntries?: boolean;
}

function ResumeSection({
  fields,
  onFieldsChange,
  isOpen = false,
  allowMultipleEntries: _allowMultipleEntries = false,
}: ResumeSectionProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const addField = () => {
    const newField: FieldData = {
      id: `field-${Date.now()}-${Math.random()}`,
      label: "New Field",
      value: "",
      type: "text",
      isEditing: true,
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FieldData>) => {
    const newFields = fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onFieldsChange(newFields);
  };

  const removeField = (fieldId: string) => {
    const newFields = fields.filter((field) => field.id !== fieldId);
    onFieldsChange(newFields);
  };

  const startEditing = (fieldId: string) => {
    updateField(fieldId, { isEditing: true });
  };

  const saveFieldLabel = (fieldId: string, newLabel: string) => {
    updateField(fieldId, {
      label: newLabel || "New Field",
      isEditing: false,
    });
  };

  const cancelEditing = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.label === "New Field") {
      removeField(fieldId);
    } else {
      updateField(fieldId, { isEditing: false });
    }
  };

  const handleLabelKeyDown = (
    e: React.KeyboardEvent,
    fieldId: string,
    currentLabel: string
  ) => {
    if (e.key === "Enter") {
      saveFieldLabel(fieldId, currentLabel);
    } else if (e.key === "Escape") {
      cancelEditing(fieldId);
    }
  };

  return (
    <div>
      {isOpen && (
        <div style={{ marginTop: "12px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "12px",
              alignItems: "start",
            }}
          >
            {fields.map((field) => (
              <div
                key={field.id}
                style={{
                  gridColumn: field.type === "textarea" ? "1 / -1" : "auto",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#000000",
                  overflow: "hidden",
                  width: "100%",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={() => setHoveredField(field.id)}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    backgroundColor: field.isEditing ? "#f0f9ff" : "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {field.isEditing ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        flex: 1,
                      }}
                    >
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, { label: e.target.value })
                        }
                        onKeyDown={(e) =>
                          handleLabelKeyDown(e, field.id, field.label)
                        }
                        onBlur={() => saveFieldLabel(field.id, field.label)}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          border: "2px solid #3b82f6",
                          borderRadius: "4px",
                          fontSize: "13px",
                          fontWeight: 600,
                          outline: "none",
                          backgroundColor: "white",
                          color: "#000000",
                          fontFamily: "inherit",
                        }}
                        placeholder="Enter field name..."
                      />
                      <button
                        onClick={() => saveFieldLabel(field.id, field.label)}
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <Save size={11} />
                        Save
                      </button>
                      <button
                        onClick={() => cancelEditing(field.id)}
                        style={{
                          backgroundColor: "#6b7280",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1e293b",
                          flex: 1,
                        }}
                      >
                        {field.label}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          opacity: hoveredField === field.id ? 1 : 0,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <button
                          onClick={() => startEditing(field.id)}
                          style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Edit size={11} />
                          Edit
                        </button>

                        <button
                          onClick={() => removeField(field.id)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {!field.isEditing && (
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {field.type === "list" ? (
                      (() => {
                        const parsed: string[] = (() => {
                          try {
                            return JSON.parse(field.value || "[]");
                          } catch {
                            return [];
                          }
                        })();

                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            {parsed.map((item, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  placeholder={field.label}
                                  value={item ?? ""}
                                  onChange={(e) => {
                                    const copy = parsed.slice();
                                    copy[idx] = e.target.value;
                                    updateField(field.id, {
                                      value: JSON.stringify(copy),
                                    });
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 6,
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const copy = parsed.slice();
                                    copy.splice(idx, 1);
                                    updateField(field.id, {
                                      value: JSON.stringify(copy),
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 8px",
                                    borderRadius: 6,
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div>
                              <button
                                onClick={() => {
                                  const copy = parsed.slice();
                                  copy.push("");
                                  updateField(field.id, {
                                    value: JSON.stringify(copy),
                                  });
                                }}
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: 6,
                                  border: "1px dashed #cbd5e1",
                                  background: "transparent",
                                }}
                              >
                                + Add Item
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    ) : field.type === "links" ? (
                      (() => {
                        const parsed: Array<{ label?: string; url?: string }> =
                          (() => {
                            try {
                              return JSON.parse(field.value || "[]");
                            } catch {
                              return [];
                            }
                          })();

                        return (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            {parsed.map((lnk, idx) => (
                              <div
                                key={idx}
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  placeholder="Label (e.g. LinkedIn)"
                                  value={lnk.label ?? ""}
                                  onChange={(e) => {
                                    const copy = parsed.slice();
                                    copy[idx] = {
                                      ...(copy[idx] ?? {}),
                                      label: e.target.value,
                                    };
                                    updateField(field.id, {
                                      value: JSON.stringify(copy),
                                    });
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "8px 10px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 6,
                                  }}
                                />
                                <input
                                  placeholder="URL"
                                  value={lnk.url ?? ""}
                                  onChange={(e) => {
                                    const copy = parsed.slice();
                                    copy[idx] = {
                                      ...(copy[idx] ?? {}),
                                      url: e.target.value,
                                    };
                                    updateField(field.id, {
                                      value: JSON.stringify(copy),
                                    });
                                  }}
                                  style={{
                                    flex: 2,
                                    padding: "8px 10px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 6,
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const copy = parsed.slice();
                                    copy.splice(idx, 1);
                                    updateField(field.id, {
                                      value: JSON.stringify(copy),
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 8px",
                                    borderRadius: 6,
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div>
                              <button
                                onClick={() => {
                                  const copy = parsed.slice();
                                  copy.push({ label: "", url: "" });
                                  updateField(field.id, {
                                    value: JSON.stringify(copy),
                                  });
                                }}
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: 6,
                                  border: "1px dashed #cbd5e1",
                                  background: "transparent",
                                }}
                              >
                                + Add Link
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    ) : field.type === "textarea" ? (
                      <textarea
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        value={field.value}
                        onChange={(e) =>
                          updateField(field.id, { value: e.target.value })
                        }
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "13px",
                          outline: "none",
                          backgroundColor: "#f8fafc",
                          color: "#000000",
                          resize: "vertical",
                          minHeight: "60px",
                          fontFamily: "inherit",
                          lineHeight: "1.4",
                          boxSizing: "border-box",
                        }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        value={field.value}
                        onChange={(e) =>
                          updateField(field.id, { value: e.target.value })
                        }
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          fontSize: "13px",
                          outline: "none",
                          backgroundColor: "#f8fafc",
                          color: "#000000",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <button
              onClick={addField}
              style={{
                padding: "8px 16px",
                backgroundColor: "transparent",
                color: "#3b82f6",
                border: "2px dashed #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                justifyContent: "center",
              }}
            >
              <Plus size={14} />
              Add Field
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DraggableSectionProps {
  id: string;
  index: number;
  title: string;
  fields: FieldData[];
  onFieldsChange: (fields: FieldData[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  allowMultipleEntries: boolean;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableResumeSection({
  id: _id,
  index,
  title,
  fields,
  onFieldsChange,
  isOpen,
  onToggle,
  allowMultipleEntries,
  moveSection,
}: DraggableSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    if (dragIndex !== index) {
      moveSection(dragIndex, index);
    }
  };

  return (
    <div
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: "100%",
        marginBottom: "12px",
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          backgroundColor: "white",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            padding: "12px 16px 12px 38px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: isOpen ? "#f8fafc" : "white",
            borderBottom: isOpen ? "1px solid #e5e7eb" : "none",
            position: "relative",
          }}
        >
          <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: isDragging ? "#3b82f6" : "#9ca3af",
              cursor: "grab",
              padding: "2px",
            }}
          >
            <GripVertical size={16} />
          </div>

          <div
            onClick={onToggle}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                margin: 0,
                color: "#1e293b",
              }}
            >
              {title}
            </h3>
            <ChevronDown
              size={18}
              color="#64748b"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>
        </div>

        {isOpen && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "white",
            }}
          >
            <ResumeSection
              fields={fields}
              onFieldsChange={onFieldsChange}
              isOpen={isOpen}
              allowMultipleEntries={allowMultipleEntries}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function ResumeEditor({ userId, resumeId }: ResumeEditorProps) {
  const [sections, setSections] = useState<SectionData[]>(defaultSections);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeView, setActiveView] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pdfHover, setPdfHover] = useState(false);

  // Fetch specific resume from backend
  const fetchResume = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the specific resume directly instead of fetching all resumes
      const url = `http://localhost:3000/resumes/${encodeURIComponent(
        userId
      )}/${encodeURIComponent(resumeId)}`;
      const response = await axios.get(url);
      console.log("Fetched resume endpoint response:", response.data);

      // Normalize possible response shapes:
      // - { Item: { user_id, resume_id, resume, ... } }
      // - { user_id, resume_id, resume, ... }
      // - { resume: { ... }, user_id, resume_id }
      const data = response.data;
      let targetResume: any = null;

      if (data && data.Item) {
        targetResume = data.Item;
      } else if (data && data.resume && (data.user_id || data.resume_id)) {
        // response body is the resume envelope
        targetResume = data;
      } else if (data && (data.user_id || data.resume_id || data.resume)) {
        // response is likely the envelope or single resume object
        targetResume = data;
      } else {
        targetResume = null;
      }

      if (targetResume) {
        setResumeData(targetResume);
        parseResumeData(targetResume);
      } else {
        setError(`Resume not found for user ${userId} and resume ${resumeId}`);
      }
    } catch (err: any) {
      console.error("Error fetching resume:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch resume"
      );
    } finally {
      setLoading(false);
    }
  };

  // Parse the resume JSON and populate the form fields
  const parseResumeData = (resume: any) => {
    if (!resume || !resume.resume) return;

    const resumeContent = resume.resume;
    const dynamicSections: SectionData[] = [];

    // Iterate through each section in the resume
    Object.keys(resumeContent).forEach((sectionKey) => {
      const sectionData = resumeContent[sectionKey];
      if (!sectionData) return;

      const fields: FieldData[] = [];
      const sectionTitle = sectionKey
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Process the section data based on its type
      if (Array.isArray(sectionData)) {
        // Handle arrays (education, projects, leadership_experience)
        if (sectionData.length > 0 && typeof sectionData[0] === "object") {
          // Array of objects - take first item
          const firstItem = sectionData[0];
          Object.keys(firstItem).forEach((fieldKey) => {
            const value = firstItem[fieldKey];
            if (value !== null && value !== undefined) {
              const fieldType = determineFieldType(fieldKey, value);
              let fieldValue: string;

              if (fieldType === "list") {
                // Ensure list-typed fields are represented as JSON arrays.
                const arr = Array.isArray(value)
                  ? value
                  : typeof value === "string"
                  ? value
                      .split(/,|\n/)
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : [String(value)];

                fieldValue = JSON.stringify(arr);
              } else {
                fieldValue = Array.isArray(value)
                  ? value.join(", ")
                  : String(value);
              }

              fields.push({
                id: `${sectionKey}-${fieldKey}`,
                label: fieldKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                value: fieldValue,
                type: fieldType,
              });
            }
          });
        }
      } else if (typeof sectionData === "object") {
        // Handle objects (personal_information, skills)
        Object.keys(sectionData).forEach((fieldKey) => {
          const value = sectionData[fieldKey];
          if (value !== null && value !== undefined) {
            // Special handling for nested structures
            if (fieldKey === "links" && Array.isArray(value)) {
              // Handle links array specially: prefer explicit LinkedIn entry
              const linkedinLink = value.find((link: any) => link.linkedin);
              if (linkedinLink) {
                fields.push({
                  id: `${sectionKey}-linkedin`,
                  label: "LinkedIn",
                  value: linkedinLink.linkedin,
                  type: "url",
                });
              } else {
                // Generic mapper: normalize any links array into an array of {label, url}
                const normalizedLinks = (value || []).map((lnk: any) => {
                  if (typeof lnk === "string") return { label: "", url: lnk };
                  if (lnk && typeof lnk === "object") {
                    const label = lnk.label ?? lnk.name ?? lnk.type ?? "";
                    const url = lnk.url ?? lnk.link ?? lnk.href ?? "";
                    return { label, url };
                  }
                  return { label: "", url: String(lnk) };
                });

                fields.push({
                  id: `${sectionKey}-links`,
                  label: "Links",
                  value: JSON.stringify(normalizedLinks),
                  type: "links",
                });
              }
            } else {
              const fieldType = determineFieldType(fieldKey, value);
              const fieldValue = Array.isArray(value)
                ? value.join(", ")
                : String(value);

              fields.push({
                id: `${sectionKey}-${fieldKey}`,
                label: fieldKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                value: fieldValue,
                type: fieldType,
              });
            }
          }
        });
      }

      // Only add section if it has fields
      if (fields.length > 0) {
        dynamicSections.push({
          id: sectionKey,
          title: sectionTitle,
          fields: fields,
          isOpen: true,
          allowMultipleEntries:
            Array.isArray(sectionData) && sectionData.length > 1,
        });
      }
    });

    // Update sections with dynamically created ones
    setSections(dynamicSections);
  };

  // Helper function to determine field type
  const determineFieldType = (
    key: string,
    value: any
  ):
    | "text"
    | "textarea"
    | "date"
    | "email"
    | "tel"
    | "url"
    | "list"
    | "links" => {
    const keyLower = key.toLowerCase();

    if (keyLower.includes("email")) return "email";
    if (keyLower.includes("phone")) return "tel";
    if (
      keyLower.includes("linkedin") ||
      keyLower.includes("github") ||
      keyLower.includes("url") ||
      keyLower.includes("link")
    )
      return "url";
    // if (keyLower.includes("date")) return "date";
    if (
      keyLower.includes("description") ||
      Array.isArray(value) ||
      (typeof value === "string" && value.length > 50)
    )
      return "list";
    return "text";
  };

  useEffect(() => {
    // Fetch specific resume when component mounts or props change
    if (userId && resumeId) {
      fetchResume();
    }
  }, [userId, resumeId]);

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const updateSectionFields = (sectionId: string, fields: FieldData[]) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, fields } : section
      )
    );
  };

  const addSection = (title: string, allowMultipleEntries: boolean) => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      title,
      isOpen: true,
      allowMultipleEntries,
      fields: [
        { id: `field-${Date.now()}`, label: "Title", value: "", type: "text" },
        {
          id: `field-${Date.now()}-2`,
          label: "Description",
          value: "",
          type: "textarea",
        },
      ],
    };
    setSections([...sections, newSection]);
    setDropdownOpen(false);
    setDropdownOpen(false);
  };

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const draggedSection = newSections[dragIndex];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, draggedSection);
      return newSections;
    });
  }, []);

  // Build a resume object from the editor `sections` state.
  const buildResume = () => {
    const resume: any = {};

    sections.forEach((section) => {
      // PERSONAL (accept both `personal` and `personal_information` keys)
      if (section.id === "personal" || section.id === "personal_information") {
        const pi: any = {};
        section.fields.forEach((f) => {
          const baseId = f.id.startsWith(`${section.id}-`)
            ? f.id.slice(section.id.length + 1)
            : f.id;
          if (f.id === "links") {
            try {
              const raw = JSON.parse(f.value || "[]");
              const normalized = Array.isArray(raw)
                ? raw.map((item: any) => {
                    if (
                      item &&
                      typeof item === "object" &&
                      ("label" in item || "url" in item)
                    ) {
                      const label = (item.label ?? "").toString();
                      const key = label
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .replace(/[^a-z0-9]/g, "");
                      return { [key || "link"]: item.url ?? "" };
                    }
                    return item;
                  })
                : [];
              pi.links = normalized;
            } catch {
              pi.links = [];
            }
          } else if (baseId === "name") {
            pi.name = f.value;
          } else if (baseId === "phone") {
            pi.phone = f.value;
          } else if (baseId === "email") {
            pi.email = f.value;
          } else if (baseId === "address" || baseId === "location") {
            pi.location = f.value;
          } else {
            pi[baseId] = f.value;
          }
        });

        resume.personal_information = pi;

        // PROJECTS (each section treated as one project entry)
      } else if (section.id === "projects") {
        const proj: any = {};
        let hasProjData = false;
        section.fields.forEach((f) => {
          const baseId = f.id.startsWith(`${section.id}-`)
            ? f.id.slice(section.id.length + 1)
            : f.id;
          if (f.type === "list") {
            try {
              const arr = JSON.parse(f.value || "[]");
              if (
                Array.isArray(arr) &&
                arr.some((v: any) => {
                  if (v == null) return false;
                  if (typeof v === "string") return v.trim() !== "";
                  if (typeof v === "object") return Object.keys(v).length > 0;
                  return !!String(v).trim();
                })
              ) {
                hasProjData = true;
              }
              proj[baseId === "project_name" ? "name" : baseId] = arr;
            } catch {
              proj[baseId === "project_name" ? "name" : baseId] = [];
            }
          } else {
            const key = baseId === "project_name" ? "name" : baseId;
            if (typeof f.value === "string" && f.value.trim())
              hasProjData = true;
            proj[key] = f.value;
          }
        });

        if (hasProjData) {
          resume.projects = resume.projects || [];
          resume.projects.push(proj);
        }

        // EDUCATION
      } else if (section.id === "education") {
        const ed: any = {};
        let hasEduData = false;
        section.fields.forEach((f) => {
          const baseId = f.id.startsWith(`${section.id}-`)
            ? f.id.slice(section.id.length + 1)
            : f.id;
          if (f.type === "list") {
            try {
              const arr = JSON.parse(f.value || "[]");
              if (
                Array.isArray(arr) &&
                arr.some((v: any) => {
                  if (v == null) return false;
                  if (typeof v === "string") return v.trim() !== "";
                  if (typeof v === "object") return Object.keys(v).length > 0;
                  return !!String(v).trim();
                })
              ) {
                hasEduData = true;
              }
              ed[baseId] = arr;
            } catch {
              ed[baseId] = [];
            }
          } else {
            if (typeof f.value === "string" && f.value.trim())
              hasEduData = true;
            ed[baseId] = f.value;
          }
        });

        if (hasEduData) {
          resume.education = resume.education || [];
          resume.education.push(ed);
        }

        // SKILLS (special mapping)
      } else if (section.id === "skills") {
        const skillsObj: any = {};
        section.fields.forEach((f) => {
          const baseId = f.id.startsWith(`${section.id}-`)
            ? f.id.slice(section.id.length + 1)
            : f.id;

          // Normalize value into an array of skills (split by comma or newline)
          const parsed = f.value
            ? f.value
                .split(/,|\n/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

          // Store under a generic key using the field id as the category
          // e.g. resume.skills = { technical: [...], soft: [...], languages: [...] }
          skillsObj[baseId] = parsed;
        });

        const hasSkills = Object.values(skillsObj).some(
          (arr: any) => Array.isArray(arr) && arr.length > 0
        );

        if (hasSkills) resume.skills = skillsObj;

        // GENERIC / OTHER SECTIONS
      } else {
        const obj: any = {};
        let hasObjData = false;
        section.fields.forEach((f) => {
          const baseId = f.id.startsWith(`${section.id}-`)
            ? f.id.slice(section.id.length + 1)
            : f.id;
          if (f.type === "list") {
            try {
              const arr = JSON.parse(f.value || "[]");
              if (
                Array.isArray(arr) &&
                arr.some((v: any) => {
                  if (v == null) return false;
                  if (typeof v === "string") return v.trim() !== "";
                  if (typeof v === "object") return Object.keys(v).length > 0;
                  return !!String(v).trim();
                })
              ) {
                hasObjData = true;
              }
              obj[baseId] = arr;
            } catch {
              obj[baseId] = [];
            }
          } else {
            obj[baseId] = f.value;
            if (typeof f.value === "string" && f.value.trim())
              hasObjData = true;
          }
        });

        if (hasObjData) {
          resume[section.id] = resume[section.id] || [];
          resume[section.id].push(obj);
        }
      }
    });

    // Return the envelope. Do not force-create empty arrays/objects for sections;
    // only sections that had data are present on `resume`.
    return {
      user_id: "0",
      resume_id: "0",
      resume,
      metadata: {
        resume_info: {
          resume_creation_date: new Date().toISOString(),
          filename: "generated_resume.json",
          template_used: "",
          section_order: sections.map((s) => s.id),
        },
      },
    };
  };

  // Memoize built resume so passing to PdfViewer doesn't recreate object
  // on simple UI state changes (like hover) which would force reloads.
  const memoResume = useMemo(() => buildResume(), [sections]);

  // Upload resume to backend
  const uploadResume = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = buildResume();
      const response = await axios.post(
        "http://localhost:3000/resumes",
        payload
      );
      setSuccess("Resume uploaded successfully");
      // Optionally update resumeData with server response
      if (response && response.data) setResumeData(response.data);
    } catch (err: any) {
      console.error("Error uploading resume:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to upload resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          textAlign: "center",
          flexShrink: 0,
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 600,
            margin: "0 0 6px 0",
            color: "#1e293b",
          }}
        >
          Generated Resume
        </h3>
        <p
          style={{
            color: "#64748b",
            margin: 0,
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          Build and customize your resume - Drag sections to reorder
        </p>
      </div>

      {/* API Status */}
      <div style={{ marginBottom: "16px" }}>
        {loading && (
          <div
            style={{ color: "#3b82f6", fontSize: "13px", textAlign: "center" }}
          >
            Loading resume data...
          </div>
        )}
        {error && (
          <div
            style={{ color: "#ef4444", fontSize: "13px", textAlign: "center" }}
          >
            Error: {error}
          </div>
        )}
        {success && (
          <div
            style={{ color: "#10b981", fontSize: "13px", textAlign: "center" }}
          >
            {success}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexShrink: 0,
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Plus size={14} />
              Add Section
            </button>

            {dropdownOpen && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 40,
                  }}
                  onClick={() => setDropdownOpen(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "4px",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "6px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    minWidth: "180px",
                    zIndex: 50,
                  }}
                >
                  {additionalSectionTemplates.map((template) => (
                    <div
                      key={template.title}
                      onClick={() =>
                        addSection(
                          template.title,
                          template.allowMultipleEntries
                        )
                      }
                      style={{
                        padding: "8px 10px",
                        fontSize: "13px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {template.title}
                    </div>
                  ))}
                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "#e2e8f0",
                      margin: "4px 0",
                    }}
                  />
                  <div
                    onClick={() => addSection("Custom Section", false)}
                    style={{
                      padding: "8px 10px",
                      fontSize: "13px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontWeight: 600,
                      color: "#3b82f6",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#eff6ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Custom Section
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "#f8fafc",
            padding: "4px",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
          }}
        >
          <button
            onClick={() => setActiveView("edit")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: activeView === "edit" ? "white" : "transparent",
              color: activeView === "edit" ? "#1e293b" : "#64748b",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              boxShadow:
                activeView === "edit" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveView("preview")}
            style={{
              padding: "6px 14px",
              borderRadius: "4px",
              border: "none",
              backgroundColor:
                activeView === "preview" ? "white" : "transparent",
              color: activeView === "preview" ? "#1e293b" : "#64748b",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              boxShadow:
                activeView === "preview"
                  ? "0 1px 3px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Upload Button */}

      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          paddingRight: "4px",
        }}
      >
        {activeView === "edit" ? (
          <div>
            {sections.length > 0 ? (
              sections.map((section, index) => (
                <DraggableResumeSection
                  key={section.id}
                  id={section.id}
                  index={index}
                  title={section.title}
                  fields={section.fields}
                  onFieldsChange={(fields) =>
                    updateSectionFields(section.id, fields)
                  }
                  isOpen={section.isOpen}
                  onToggle={() => toggleSection(section.id)}
                  allowMultipleEntries={section.allowMultipleEntries}
                  moveSection={moveSection}
                />
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                {loading ? "Loading resume data..." : "No resume data found"}
              </div>
            )}
          </div>
        ) : (
          <div
            onMouseEnter={() => setPdfHover(true)}
            onMouseLeave={() => setPdfHover(false)}
            style={{
              position: "relative",
              backgroundColor: "white",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              minHeight: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <PdfViewer resumeObj={memoResume} />

            <button
              onClick={uploadResume}
              disabled={loading}
              aria-hidden={!pdfHover}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                zIndex: 50,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "opacity 0.18s ease, transform 0.18s ease",
                opacity: pdfHover ? 1 : 0,
                transform: pdfHover
                  ? "translateY(0) scale(1)"
                  : "translateY(-4px) scale(0.98)",
                pointerEvents: pdfHover ? "auto" : "none",
              }}
            >
              <Save size={14} />
              Upload
            </button>

            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                overflowX: "auto",
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                  fontSize: "12px",
                }}
              >
                {JSON.stringify(memoResume, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeEditor;
