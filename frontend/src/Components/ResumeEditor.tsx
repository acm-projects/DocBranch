import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from './ui/button';
import { Plus, ChevronDown, GripVertical, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Collapsible, CollapsibleContent } from './ui/collapsible';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// field interface
export interface FieldData {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'date' | 'email' | 'tel' | 'url';
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
    id: 'personal',
    title: 'Personal Information',
    isOpen: true,
    allowMultipleEntries: false,
    fields: [
      { id: 'name', label: 'Full Name', value: '', type: 'text' },
      { id: 'email', label: 'Email', value: '', type: 'email' },
      { id: 'phone', label: 'Phone', value: '', type: 'tel' },
      { id: 'address', label: 'Address', value: '', type: 'text' },
      { id: 'linkedin', label: 'LinkedIn', value: '', type: 'url' },
    ]
  },
  {
    id: 'education',
    title: 'Education',
    isOpen: true,
    allowMultipleEntries: true,
    fields: [
      { id: 'institution', label: 'Name of Institution', value: '', type: 'text' },
      { id: 'degree', label: 'Degree', value: '', type: 'text' },
      { id: 'field', label: 'Field of Study', value: '', type: 'text' },
      { id: 'year', label: 'Graduation Year', value: '', type: 'text' },
      { id: 'gpa', label: 'GPA', value: '', type: 'text' },
    ]
  },
  {
    id: 'experience',
    title: 'Experience',
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: 'position', label: 'Position', value: '', type: 'text' },
      { id: 'company', label: 'Company', value: '', type: 'text' },
      { id: 'startDate', label: 'Start Date', value: '', type: 'date' },
      { id: 'endDate', label: 'End Date', value: '', type: 'date' },
      { id: 'description', label: 'Description', value: '', type: 'textarea' },
    ]
  },
  {
    id: 'skills',
    title: 'Skills',
    isOpen: false,
    allowMultipleEntries: false,
    fields: [
      { id: 'technical', label: 'Technical Skills', value: '', type: 'textarea' },
      { id: 'soft', label: 'Soft Skills', value: '', type: 'textarea' },
      { id: 'languages', label: 'Languages', value: '', type: 'text' },
    ]
  },
  {
    id: 'organizations',
    title: 'Organizations',
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: 'orgName', label: 'Organization Name', value: '', type: 'text' },
      { id: 'role', label: 'Role', value: '', type: 'text' },
      { id: 'duration', label: 'Duration', value: '', type: 'text' },
      { id: 'activities', label: 'Activities', value: '', type: 'textarea' },
    ]
  },
  {
    id: 'awards',
    title: 'Awards/Honors',
    isOpen: false,
    allowMultipleEntries: true,
    fields: [
      { id: 'awardName', label: 'Award Name', value: '', type: 'text' },
      { id: 'issuer', label: 'Issuer', value: '', type: 'text' },
      { id: 'date', label: 'Date', value: '', type: 'date' },
      { id: 'description', label: 'Description', value: '', type: 'textarea' },
    ]
  }
];

const additionalSectionTemplates = [
  { title: 'Projects', allowMultipleEntries: true },
  { title: 'Certifications', allowMultipleEntries: true },
  { title: 'Publications', allowMultipleEntries: true },
  { title: 'Volunteer Work', allowMultipleEntries: true },
  { title: 'References', allowMultipleEntries: true },
  { title: 'Summary', allowMultipleEntries: false },
  { title: 'Interests', allowMultipleEntries: false },
];

// Resume Section Component 
interface ResumeSectionProps {
  title: string;
  fields: FieldData[];
  onFieldsChange: (fields: FieldData[]) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  allowMultipleEntries?: boolean;
}

function ResumeSection({ 
  title, 
  fields, 
  onFieldsChange, 
  isOpen = false, 
  onToggle,
  allowMultipleEntries = false 
}: ResumeSectionProps) {
  const addField = () => {
    const newField: FieldData = {
      id: `field-${Date.now()}-${Math.random()}`,
      label: 'New Field',
      value: '',
      type: 'text'
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FieldData>) => {
    const newFields = fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    );
    onFieldsChange(newFields);
  };

  const removeField = (fieldId: string) => {
    const newFields = fields.filter(field => field.id !== fieldId);
    onFieldsChange(newFields);
  };

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleContent className="mt-4">
          {/* Fields in box grid layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {fields.map((field) => (
              <div 
                key={field.id} 
                style={{
                  gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  maxWidth: field.type === 'textarea' ? '100%' : '350px',
                  justifySelf: field.type === 'textarea' ? 'stretch' : 'center'
                }}
                onMouseEnter={(e) => {
                  const button = e.currentTarget.querySelector('button');
                  if (button) button.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const button = e.currentTarget.querySelector('button');
                  if (button) button.style.opacity = '0';
                }}
              >
                {/* Field Name Box with Remove Button */}
                <div 
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                  >
                    {field.label}
                  </div>
                  
                  {/* Remove Field Button - Shows on hover */}
                  <button
                    onClick={() => removeField(field.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease-in-out',
                      opacity: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    }}
                  >
                    <X size={12} />
                    Remove
                  </button>
                </div>
                
                {/* Input Area */}
                <div 
                  style={{
                    padding: '16px',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={field.value}
                      onChange={(e) => updateField(field.id, { value: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Field Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '1px dashed #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%',
              maxWidth: '724px',
              margin: '20px auto 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// draggable resume section 
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

interface DragItem {
  type: string;
  id: string;
  index: number;
}

const SECTION_TYPE = 'RESUME_SECTION';

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
  const ref = useRef<HTMLDivElement>(null);

    // explicitly type the drag item and collected props so hover gets a typed item
    const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: SECTION_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // also type useDrag so the produced item matches DragItem
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
  type: SECTION_TYPE,
  item: () => {
    return { 
      type: SECTION_TYPE, 
      id, 
      index 
    };
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
});

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={ref}
      style={{ 
        opacity,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className="relative group"
    >
      {/* Drag Handle */}
      <div
        style={{
          position: 'absolute',
          left: '8px',
          top: '16px',
          color: isDragging ? '#3b82f6' : '#6b7280',
          cursor: 'grab',
          transition: 'color 0.2s ease-in-out',
          zIndex: 10,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <GripVertical size={16} />
      </div>
      
      {/* Drop indicator line */}
      {isOver && !isDragging && (
        <div
          style={{
            height: '2px',
            backgroundColor: '#3b82f6',
            margin: '0 24px 16px 24px',
            borderRadius: '1px',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
      
      {/* Section Box */}
      <div style={{
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: '16px',
        marginLeft: '32px',
        marginRight: '24px',
        overflow: 'hidden',
        boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Section Header */}
        <div 
          onClick={onToggle}
          style={{
            padding: '16px 16px 16px 40px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isOpen ? '#f9fafb' : 'white',
            transition: 'background-color 0.2s',
            borderBottom: isOpen ? '1px solid #e5e7eb' : 'none'
          }}
        >
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
            color: '#1f2937'
          }}>
            {title}
          </h3>
          <ChevronDown 
            size={20} 
            color="#6b7280"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </div>
        
        {/* Section Content */}
        {isOpen && (
          <div style={{
            padding: '16px',
            backgroundColor: 'white'
          }}>
            <ResumeSection
              title={title}
              fields={fields}
              onFieldsChange={onFieldsChange}
              isOpen={isOpen}
              onToggle={onToggle}
              allowMultipleEntries={allowMultipleEntries}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Main Resume Editor Component 
export function ResumeEditor() {
  const [sections, setSections] = useState<SectionData[]>(defaultSections);
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isOpen: !section.isOpen }
        : section
    ));
  };

  const updateSectionFields = (sectionId: string, fields: FieldData[]) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, fields }
        : section
    ));
  };

  const addSection = (title: string, allowMultipleEntries: boolean) => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      title,
      isOpen: true,
      allowMultipleEntries,
      fields: [
        { id: `field-${Date.now()}`, label: 'Title', value: '', type: 'text' },
        { id: `field-${Date.now()}-2`, label: 'Description', value: '', type: 'textarea' },
      ]
    };
    setSections([...sections, newSection]);
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
    <DndProvider backend={HTML5Backend}>
      {/* Header Section */}
      <div style={{ 
        marginTop: '20px', 
        marginBottom: '24px', 
        textAlign: 'center',
        flexShrink: 0 
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 8px 0',
          color: '#1f2937'
        }}>
          Resume Editor
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: 0,
          fontSize: '14px'
        }}>
          Build and customize your resume - Drag sections to reorder
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexShrink: 0,
        padding: '0 24px'
      }}>
        {/* Add Section Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Plus size={16} />
              Add Section
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {additionalSectionTemplates.map((template) => (
              <DropdownMenuItem
                key={template.title}
                onClick={() => addSection(template.title, template.allowMultipleEntries)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {template.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => addSection('Custom Section', false)}
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Custom Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Preview/Edit Toggle */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#f3f4f6',
          padding: '4px',
          borderRadius: '6px'
        }}>
          <button
            onClick={() => setActiveView('edit')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeView === 'edit' ? 'white' : 'transparent',
              color: activeView === 'edit' ? '#1f2937' : '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: activeView === 'edit' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveView('preview')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: activeView === 'preview' ? 'white' : 'transparent',
              color: activeView === 'preview' ? '#1f2937' : '#6b7280',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: activeView === 'preview' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '0 16px 16px 16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sections.map((section, index) => (
            <DraggableResumeSection
              key={section.id}
              id={section.id}
              index={index}
              title={section.title}
              fields={section.fields}
              onFieldsChange={(fields) => updateSectionFields(section.id, fields)}
              isOpen={section.isOpen}
              onToggle={() => toggleSection(section.id)}
              allowMultipleEntries={section.allowMultipleEntries}
              moveSection={moveSection}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
export default ResumeEditor;