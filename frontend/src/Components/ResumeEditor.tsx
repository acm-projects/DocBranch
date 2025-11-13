import React, { useState, useCallback, useEffect } from "react";
import { Plus, ChevronDown, GripVertical, X, Edit, Save, RefreshCw } from "lucide-react";
import axios from 'axios';

// field interface
export interface FieldData {
  id: string;
  label: string;
  value: string;
  type: "text" | "textarea" | "date" | "email" | "tel" | "url";
  isEditing?: boolean;
}

interface SectionData {
  id: string;
  title: string;
  fields: FieldData[];
  isOpen: boolean;
  allowMultipleEntries: boolean;
}

interface ResumeEditorProps {
  userId: string;
  resumeId: string;
}

// Default empty sections - will be populated dynamically
const defaultSections: SectionData[] = [];

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
  title: string;
  fields: FieldData[];
  onFieldsChange: (fields: FieldData[]) => void;
  isOpen?: boolean;
  allowMultipleEntries?: boolean;
}

function ResumeSection({
  title,
  fields,
  onFieldsChange,
  isOpen = false,
  allowMultipleEntries = false,
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
                    {field.type === "textarea" ? (
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
  id,
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
              title={title}
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

  // Fetch specific resume from backend
  const fetchResume = async () => {
    setLoading(true);
    setError(null);
    try {
      // First get all resumes
      const response = await axios.get('http://localhost:3000/resumes');
      console.log('Fetched all resumes:', response.data);
      
      if (response.data && response.data.Items) {
        // Find the specific resume by userId and resumeId
        const targetResume = response.data.Items.find(
          (item: any) => item.user_id === userId && item.resume_id === resumeId
        );

        if (targetResume) {
          setResumeData(targetResume);
          parseResumeData(targetResume);
        } else {
          setError(`Resume not found for user ${userId} and resume ${resumeId}`);
        }
      } else {
        setError('No resumes found in response');
      }
    } catch (err: any) {
      console.error('Error fetching resume:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch resume');
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
    Object.keys(resumeContent).forEach(sectionKey => {
      const sectionData = resumeContent[sectionKey];
      if (!sectionData) return;

      const fields: FieldData[] = [];
      const sectionTitle = sectionKey.replace(/_/g, ' ')
                                    .replace(/\b\w/g, l => l.toUpperCase());

      // Process the section data based on its type
      if (Array.isArray(sectionData)) {
        // Handle arrays (education, projects, leadership_experience)
        if (sectionData.length > 0 && typeof sectionData[0] === 'object') {
          // Array of objects - take first item
          const firstItem = sectionData[0];
          Object.keys(firstItem).forEach(fieldKey => {
            const value = firstItem[fieldKey];
            if (value !== null && value !== undefined) {
              const fieldType = determineFieldType(fieldKey, value);
              const fieldValue = Array.isArray(value) ? value.join(', ') : String(value);
              
              fields.push({
                id: `${sectionKey}-${fieldKey}`,
                label: fieldKey.replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase()),
                value: fieldValue,
                type: fieldType
              });
            }
          });
        }
      } else if (typeof sectionData === 'object') {
        // Handle objects (personal_information, skills)
        Object.keys(sectionData).forEach(fieldKey => {
          const value = sectionData[fieldKey];
          if (value !== null && value !== undefined) {
            
            // Special handling for nested structures
            if (fieldKey === 'links' && Array.isArray(value)) {
              // Handle links array specially
              const linkedinLink = value.find((link: any) => link.linkedin);
              if (linkedinLink) {
                fields.push({
                  id: `${sectionKey}-linkedin`,
                  label: 'LinkedIn',
                  value: linkedinLink.linkedin,
                  type: 'url'
                });
              }
            } else {
              const fieldType = determineFieldType(fieldKey, value);
              const fieldValue = Array.isArray(value) ? value.join(', ') : String(value);
              
              fields.push({
                id: `${sectionKey}-${fieldKey}`,
                label: fieldKey.replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase()),
                value: fieldValue,
                type: fieldType
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
          allowMultipleEntries: Array.isArray(sectionData) && sectionData.length > 1
        });
      }
    });

    // Update sections with dynamically created ones
    setSections(dynamicSections);
  };

  // Helper function to determine field type
  const determineFieldType = (key: string, value: any): "text" | "textarea" | "date" | "email" | "tel" | "url" => {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('email')) return 'email';
    if (keyLower.includes('phone')) return 'tel';
    if (keyLower.includes('linkedin') || keyLower.includes('url') || keyLower.includes('link')) return 'url';
    if (keyLower.includes('date')) return 'date';
    if (keyLower.includes('description') || Array.isArray(value) || 
        (typeof value === 'string' && value.length > 50)) return 'textarea';
    return 'text';
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
          <div style={{ color: "#3b82f6", fontSize: "13px", textAlign: "center" }}>
            Loading resume data...
          </div>
        )}
        {error && (
          <div style={{ color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
            Error: {error}
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
                        addSection(template.title, template.allowMultipleEntries)
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
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                {loading ? "Loading resume data..." : "No resume data found"}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              minHeight: "100%",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#6b7280",
                padding: "40px 20px",
              }}
            >
              <p style={{ fontSize: "14px", margin: 0 }}>
                Preview functionality coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeEditor;