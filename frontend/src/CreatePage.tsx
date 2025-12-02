import { useState, useEffect, useRef } from "react";
import { Checkbox } from "./Components/ui/checkbox";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface SectionItem {
  id: string;
  text: string;
  checked: boolean;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  checked: boolean;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  checked: boolean;
}

interface ProjectItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  technologies?: string;
  checked: boolean;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  checked: boolean;
}

interface SkillItem {
  id: string;
  category: string;
  skills: string[];
  checked: boolean;
}

interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  checked: boolean;
}

interface ResumeSection {
  id: string;
  name: string;
  items?: SectionItem[];
  educationItems?: EducationItem[];
  experienceItems?: ExperienceItem[];
  projectItems?: ProjectItem[];
  certificationItems?: CertificationItem[];
  skillItems?: SkillItem[];
  volunteerItems?: VolunteerItem[];
  isExpanded: boolean;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  date: string;
}

export function CreatePage() {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: "section-1",
      name: "Professional Experience",
      isExpanded: false,
      experienceItems: [],
    },
    {
      id: "section-2",
      name: "Education & Certifications",
      isExpanded: false,
      educationItems: [],
      certificationItems: [],
    },
    {
      id: "section-3",
      name: "Projects",
      isExpanded: false,
      projectItems: [],
    },
    {
      id: "section-4",
      name: "Skills & Expertise",
      isExpanded: false,
      skillItems: [],
    },
    {
      id: "section-5",
      name: "Volunteer Work",
      isExpanded: false,
      volunteerItems: [],
    },
  ]);

  const templates: Template[] = [
    {
      id: 1,
      name: "Professional Template",
      description: "Classic layout for traditional industries",
      category: "Professional",
      date: "2024-01-18",
    },
    {
      id: 2,
      name: "Modern Template",
      description: "Contemporary design with accent colors",
      category: "Modern",
      date: "2024-01-15",
    },
    {
      id: 3,
      name: "Minimal Template",
      description: "Clean and simple aesthetic",
      category: "Minimal",
      date: "2024-01-12",
    },
    {
      id: 4,
      name: "Creative Template",
      description: "Unique layout for creative professionals",
      category: "Creative",
      date: "2024-01-10",
    },
  ];

  const fetchResumeData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the profile for user 0 and use its resume content
      const response = await axios.get("http://localhost:3000/profiles/0");
      console.log("Fetched profile for user 0:", response.data);

      const data = response.data;
      let profile = data.Items[0];

      console.log("\n\nResume info: ", profile);

      if (!profile) {
        setError("No profile resume data found for user 0");
      } else {
        const profileResume = profile;
        const combinedResume = {
          resume_id: profile.resume_id ?? profile.resumeId ?? "11",
          user_id: profile.user_id ?? profile.userId ?? "0",
          resume: profileResume,
          metadata: profile.metadata ?? {
            resume_info: {
              resume_creation_date: new Date().toISOString(),
              filename: "profile_resume.json",
            },
          },
        };

        console.log("\n\nCombined Resume: ", combinedResume);

        setResumeData(combinedResume);
        parseResumeData(combinedResume);
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

  // Helper function to find the first resume with actual data
  const findFirstResumeWithData = (resumes: any[]): any | null => {
    for (const resume of resumes) {
      if (hasResumeData(resume)) {
        console.log(`Found resume with data: ${resume.resume_id}`);
        return resume;
      }
    }
    return null;
  };

  // Helper function to check if a resume has data
  const hasResumeData = (resume: any): boolean => {
    if (!resume || !resume.resume) return false;

    const resumeData = resume.resume;

    // Check if any array has data
    const hasEducationData = resumeData.education?.length > 0;
    const hasExperienceData = resumeData.experience?.length > 0;
    const hasProjectsData = resumeData.projects?.length > 0;
    const hasLeadershipData = resumeData.leadership_experience?.length > 0;
    const hasVolunteerData = resumeData.volunteer_experience?.length > 0;

    // Check if skills object has data
    let hasSkillsData = false;
    if (resumeData.skills && typeof resumeData.skills === "object") {
      for (const key in resumeData.skills) {
        if (
          Array.isArray(resumeData.skills[key]) &&
          resumeData.skills[key].length > 0
        ) {
          hasSkillsData = true;
          break;
        }
      }
    }

    // Check if certifications have data
    const hasCertificationsData = resumeData.certifications?.length > 0;

    // Return true if ANY section has data
    return (
      hasEducationData ||
      hasExperienceData ||
      hasProjectsData ||
      hasLeadershipData ||
      hasVolunteerData ||
      hasSkillsData ||
      hasCertificationsData
    );
  };

  // Parse resume data and populate sections with bullet points
  // Parse resume data and populate sections with bullet points
  const parseResumeData = (resume: any) => {
    if (!resume || !resume.resume) {
      console.log("No resume data found");
      return;
    }

    // Collect personal information (if present) into pushedResume
    const personalInformation =
      resume.personal_information ||
      resume.personalInformation ||
      resume.personal ||
      null;

    if (personalInformation && Object.keys(personalInformation).length > 0) {
      pushedResume.current.push({
        type: "personal_information",
        sectionId: "personal",
        data: personalInformation,
      });
    }

    const resumeContent = resume.resume;
    console.log("=== PARSING RESUME DATA ===");
    console.log("Full resume structure:", resumeContent);

    const updatedSections = [...sections];

    // Reset all sections
    for (const section of updatedSections) {
      if (section.experienceItems) section.experienceItems = [];
      if (section.educationItems) section.educationItems = [];
      if (section.certificationItems) section.certificationItems = [];
      if (section.projectItems) section.projectItems = [];
      if (section.skillItems) section.skillItems = [];
      if (section.volunteerItems) section.volunteerItems = [];
    }

    // DIRECT MAPPING - NO NEED FOR COMPLEX DETECTION
    // Process education
    const educationSection = updatedSections.find(
      (s) => s.name === "Education & Certifications"
    );
    if (
      educationSection &&
      resumeContent.education &&
      Array.isArray(resumeContent.education)
    ) {
      const educationItems: EducationItem[] = resumeContent.education.map(
        (item: any, index: number) => ({
          id: `edu-${index}`,
          institution:
            item.institution ||
            item.school ||
            item.university ||
            item.college ||
            "",
          degree: item.degree || item.degree_name || item.program || "",
          field: getFieldOfStudy(item),
          startDate:
            item.start_date || item.startDate || item.duration?.start || "",
          endDate:
            item.end_date ||
            item.endDate ||
            item.duration?.end ||
            item.graduation_date ||
            "",
          gpa: formatGPA(item.gpa || item.GPA),
          honors: item.honors || item.awards || item.achievements,
          checked: false,
        })
      );
      educationSection.educationItems = educationItems;
      console.log(`Added ${educationItems.length} education items`);
    }

    // Process experience
    const experienceSection = updatedSections.find(
      (s) => s.name === "Professional Experience"
    );
    if (experienceSection) {
      const experienceItems: ExperienceItem[] = [];

      // Add regular experience
      if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
        resumeContent.experience.forEach((item: any, index: number) => {
          experienceItems.push({
            id: `exp-${index}`,
            company: item.company || item.employer || item.organization || "",
            position: item.position || item.role || item.title || "",
            location: item.location || item.city || item.country || "",
            startDate:
              item.start_date || item.startDate || item.duration?.start || "",
            endDate:
              item.end_date || item.endDate || item.duration?.end || "Present",
            description: createBulletPoints(
              item.description || item.responsibilities || item.details
            ),
            checked: false,
          });
        });
      }

      // Add leadership experience as experience too
      if (
        resumeContent.leadership_experience &&
        Array.isArray(resumeContent.leadership_experience)
      ) {
        resumeContent.leadership_experience.forEach(
          (item: any, index: number) => {
            experienceItems.push({
              id: `lead-${index}`,
              company:
                item.company || item.organization || item.institution || "",
              position:
                item.position || item.role || item.title || "Leadership Role",
              location: item.location || item.city || item.country || "",
              startDate:
                item.start_date || item.startDate || item.duration?.start || "",
              endDate:
                item.end_date ||
                item.endDate ||
                item.duration?.end ||
                "Present",
              description: createBulletPoints(
                item.description || item.responsibilities || item.details
              ),
              checked: false,
            });
          }
        );
      }

      experienceSection.experienceItems = experienceItems;
      console.log(`Added ${experienceItems.length} experience items`);
    }

    // Process projects - THIS IS WHAT'S MISSING!
    const projectsSection = updatedSections.find((s) => s.name === "Projects");
    if (
      projectsSection &&
      resumeContent.projects &&
      Array.isArray(resumeContent.projects)
    ) {
      const projectItems: ProjectItem[] = resumeContent.projects.map(
        (item: any, index: number) => ({
          id: `proj-${index}`,
          name:
            item.name || item.project_name || item.title || "Untitled Project",
          role: item.role || item.position || item.contribution || "",
          startDate:
            item.start_date || item.startDate || item.duration?.start || "",
          endDate: item.end_date || item.endDate || item.duration?.end || "",
          description: createBulletPoints(
            item.description || item.details || item.summary
          ),
          technologies: formatTechnologies(item.technologies),
          checked: false,
        })
      );
      projectsSection.projectItems = projectItems;
      console.log(`Added ${projectItems.length} project items`);
    }

    // Process skills
    const skillsSection = updatedSections.find(
      (s) => s.name === "Skills & Expertise"
    );
    if (
      skillsSection &&
      resumeContent.skills &&
      typeof resumeContent.skills === "object"
    ) {
      const skillItems: SkillItem[] = [];
      let index = 0;

      for (const [category, skills] of Object.entries(resumeContent.skills)) {
        if (Array.isArray(skills)) {
          const formattedSkills: string[] = [];
          for (const skill of skills) {
            if (skill && typeof skill === "string") {
              formattedSkills.push(skill);
            }
          }

          if (formattedSkills.length > 0) {
            skillItems.push({
              id: `skill-${index}`,
              category: formatCategoryName(category),
              skills: formattedSkills,
              checked: false,
            });
            index++;
          }
        }
      }

      skillsSection.skillItems = skillItems;
      console.log(`Added ${skillItems.length} skill categories`);
    }

    // Process certifications
    const certSection = updatedSections.find(
      (s) => s.name === "Education & Certifications"
    );
    if (
      certSection &&
      resumeContent.certifications &&
      Array.isArray(resumeContent.certifications)
    ) {
      const certificationItems: CertificationItem[] =
        resumeContent.certifications.map((item: any, index: number) => ({
          id: `cert-${index}`,
          name:
            item.name ||
            item.title ||
            item.certification_name ||
            "Unknown Certification",
          issuer: item.issuer || item.organization || item.authority || "",
          date: item.date || item.issue_date || item.issued_date || "",
          credentialId: item.credential_id || item.id || item.certificate_id,
          checked: false,
        }));
      certSection.certificationItems = certificationItems;
      console.log(`Added ${certificationItems.length} certification items`);
    }

    // Process volunteer work
    const volunteerSection = updatedSections.find(
      (s) => s.name === "Volunteer Work"
    );
    if (
      volunteerSection &&
      resumeContent.volunteer_experience &&
      Array.isArray(resumeContent.volunteer_experience)
    ) {
      const volunteerItems: VolunteerItem[] =
        resumeContent.volunteer_experience.map((item: any, index: number) => ({
          id: `vol-${index}`,
          organization:
            item.organization || item.company || item.institution || "",
          role: item.role || item.position || item.title || "",
          startDate:
            item.start_date || item.startDate || item.duration?.start || "",
          endDate:
            item.end_date || item.endDate || item.duration?.end || "Present",
          description: createBulletPoints(
            item.description || item.responsibilities || item.details
          ),
          checked: false,
        }));
      volunteerSection.volunteerItems = volunteerItems;
      console.log(`Added ${volunteerItems.length} volunteer items`);
    }

    console.log("Final updated sections:", updatedSections);
    setSections(updatedSections);
  };

  // Helper functions
  const getFieldOfStudy = (edu: any): string => {
    if (!edu) return "";

    const fields = [];
    if (edu.field_of_study) fields.push(edu.field_of_study);
    if (edu.major)
      fields.push(Array.isArray(edu.major) ? edu.major.join(", ") : edu.major);
    if (edu.majors)
      fields.push(
        Array.isArray(edu.majors) ? edu.majors.join(", ") : edu.majors
      );
    if (edu.concentration) fields.push(edu.concentration);

    return fields.join(", ");
  };

  const formatGPA = (gpa: any): string => {
    if (!gpa) return "";
    if (typeof gpa === "number") return gpa.toFixed(2);
    return String(gpa);
  };

  const formatTechnologies = (tech: any): string => {
    if (!tech) return "";
    if (Array.isArray(tech)) return tech.join(", ");
    if (typeof tech === "string") return tech;
    if (typeof tech === "object") return Object.values(tech).join(", ");
    return String(tech);
  };

  const formatCategoryName = (category: string): string => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const createBulletPoints = (data: any): string => {
    if (!data) return "";

    if (Array.isArray(data)) {
      const points = [];
      for (const item of data) {
        if (item && typeof item === "string") {
          points.push(`• ${item}`);
        }
      }
      return points.join("\n");
    }

    if (typeof data === "string") {
      return `• ${data}`;
    }

    if (typeof data === "object") {
      const points = [];
      for (const [key, value] of Object.entries(data)) {
        if (value) {
          points.push(`• ${key}: ${value}`);
        }
      }
      return points.join("\n");
    }

    return `• ${data}`;
  };

  useEffect(() => {
    fetchResumeData();
  }, [resumeId]);

  // Toggle handlers for different item types
  const handleEducationToggle = (sectionId: string, eduId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const educationItems = section.educationItems?.map((edu) => {
        if (edu.id !== eduId) return edu;
        const newChecked = !edu.checked;
        const newEdu = { ...edu, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "education",
            sectionId,
            data: newEdu,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "education" &&
                e.data?.id === eduId &&
                e.sectionId === sectionId
              )
          );
        }
        return newEdu;
      });

      return { ...section, educationItems };
    });

    setSections(updatedSections);
  };

  const handleExperienceToggle = (sectionId: string, expId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const experienceItems = section.experienceItems?.map((exp) => {
        if (exp.id !== expId) return exp;
        const newChecked = !exp.checked;
        const newExp = { ...exp, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "experience",
            sectionId,
            data: newExp,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "experience" &&
                e.data?.id === expId &&
                e.sectionId === sectionId
              )
          );
        }
        return newExp;
      });

      return { ...section, experienceItems };
    });

    setSections(updatedSections);
  };

  const handleProjectToggle = (sectionId: string, projectId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const projectItems = section.projectItems?.map((project) => {
        if (project.id !== projectId) return project;
        const newChecked = !project.checked;
        const newProject = { ...project, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "project",
            sectionId,
            data: newProject,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "project" &&
                e.data?.id === projectId &&
                e.sectionId === sectionId
              )
          );
        }
        return newProject;
      });

      return { ...section, projectItems };
    });

    setSections(updatedSections);
  };

  const handleCertificationToggle = (sectionId: string, certId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const certificationItems = section.certificationItems?.map((cert) => {
        if (cert.id !== certId) return cert;
        const newChecked = !cert.checked;
        const newCert = { ...cert, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "certification",
            sectionId,
            data: newCert,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "certification" &&
                e.data?.id === certId &&
                e.sectionId === sectionId
              )
          );
        }
        return newCert;
      });

      return { ...section, certificationItems };
    });

    setSections(updatedSections);
  };

  const handleSkillToggle = (sectionId: string, skillId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const skillItems = section.skillItems?.map((skill) => {
        if (skill.id !== skillId) return skill;
        const newChecked = !skill.checked;
        const newSkill = { ...skill, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "skill",
            sectionId,
            data: newSkill,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "skill" &&
                e.data?.id === skillId &&
                e.sectionId === sectionId
              )
          );
        }
        return newSkill;
      });

      return { ...section, skillItems };
    });

    setSections(updatedSections);
  };

  const handleVolunteerToggle = (sectionId: string, volId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const volunteerItems = section.volunteerItems?.map((vol) => {
        if (vol.id !== volId) return vol;
        const newChecked = !vol.checked;
        const newVol = { ...vol, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({
            type: "volunteer",
            sectionId,
            data: newVol,
          });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "volunteer" &&
                e.data?.id === volId &&
                e.sectionId === sectionId
              )
          );
        }
        return newVol;
      });

      return { ...section, volunteerItems };
    });

    setSections(updatedSections);
  };

  const handleItemToggle = (sectionId: string, itemId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const items = section.items?.map((item) => {
        if (item.id !== itemId) return item;
        const newChecked = !item.checked;
        const newItem = { ...item, checked: newChecked };
        if (newChecked) {
          pushedResume.current.push({ type: "item", sectionId, data: newItem });
        } else {
          pushedResume.current = pushedResume.current.filter(
            (e) =>
              !(
                e.type === "item" &&
                e.data?.id === itemId &&
                e.sectionId === sectionId
              )
          );
        }
        return newItem;
      });

      return { ...section, items };
    });

    setSections(updatedSections);
  };

  const handleSelectTemplate = (index: number) => {
    setSelectedTemplate(index);
  };

  // Click handlers
  const handleExperienceClick = (sectionId: string, expId: string) => {
    handleExperienceToggle(sectionId, expId);
  };

  const handleEducationClick = (sectionId: string, eduId: string) => {
    handleEducationToggle(sectionId, eduId);
  };

  const handleProjectClick = (sectionId: string, projectId: string) => {
    handleProjectToggle(sectionId, projectId);
  };

  const handleCertificationClick = (sectionId: string, certId: string) => {
    handleCertificationToggle(sectionId, certId);
  };

  const handleSkillClick = (sectionId: string, skillId: string) => {
    handleSkillToggle(sectionId, skillId);
  };

  const handleVolunteerClick = (sectionId: string, volId: string) => {
    handleVolunteerToggle(sectionId, volId);
  };

  const handleItemClick = (sectionId: string, itemId: string) => {
    handleItemToggle(sectionId, itemId);
  };

  const handleNavigateToProfile = () => {
    navigate("/Profile");
  };

  const handleNavigateToComparison = () => {
    navigate("/ComparePage");
  };

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  // Generate resume based on selected items
  const generateResume = () => {
    console.log(resumeData);
    // Navigate to ComparePage and pass the combined resume via location state
    // so the ComparePage can consume it as a parameter (or via props).
    if (resumeData) {
      navigate("/ComparePage", { state: { resumeObj: pushedResume.current } });
    } else {
      // If no combined resume was prepared, still navigate but warn
      navigate("/ComparePage");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
      }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        style={{
          flex: 1,
          padding: "24px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "32px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    margin: "0 0 12px 0",
                    color: "#1e293b",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Create Your Resume
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
                >
                  {resumeId
                    ? `Editing resume: ${resumeId}`
                    : "Select a template and choose which items to include from your parsed resume"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={generateResume}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#22c55e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Generate Resume
                </button>

                <button
                  onClick={handleNavigateToProfile}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  i
                </button>
              </div>
            </div>

            {showInstructions && (
              <div
                style={{
                  backgroundColor: "#ffedd6",
                  border: "1px solid #fdd9ba",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#63441a",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    margin: "0 0 8px 0",
                    color: "#63441a",
                  }}
                >
                  How to create your resume:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    lineHeight: "1.5",
                  }}
                >
                  <li>Choose a template from the left sidebar</li>
                  <li>
                    Select the checkboxes next to the content you want to
                    include
                  </li>
                  <li>Your resume will update with your selections</li>
                  <li>Click "Generate Resume" to create your final resume</li>
                  <li>
                    <strong>Note:</strong> Content is pulled from your parsed
                    resume data
                  </li>
                </ul>
              </div>
            )}

            {loading && (
              <div
                style={{
                  backgroundColor: "#dbeafe",
                  border: "1px solid #93c5fd",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#1e40af",
                  textAlign: "center",
                }}
              >
                Loading your resume data...
              </div>
            )}

            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#dc2626",
                  textAlign: "center",
                }}
              >
                Error: {error}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: "24px",
              alignItems: "start",
            }}
          >
            {/* Template Selection Sidebar */}
            <div>
              <div
                style={{
                  border: "2px solid #f1f5f9",
                  borderRadius: "16px",
                  backgroundColor: "white",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  position: "sticky",
                  top: "24px",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      margin: 0,
                      color: "#1e293b",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Choose a Template
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      margin: "4px 0 0 0",
                    }}
                  >
                    Select a design for your resume
                  </p>
                </div>

                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {templates.map((template, index) => (
                      <div
                        key={template.id}
                        style={{
                          border:
                            selectedTemplate === index
                              ? "2px solid #22c55e"
                              : "1px solid #e2e8f0",
                          borderRadius: "12px",
                          backgroundColor: "white",
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow:
                            selectedTemplate === index
                              ? "0 4px 12px rgba(34, 197, 94, 0.15)"
                              : "0 2px 4px rgba(0, 0, 0, 0.04)",
                        }}
                        onClick={() => handleSelectTemplate(index)}
                      >
                        <div
                          style={{
                            height: "80px",
                            background:
                              "linear-gradient(135deg, #dcfce7 0%, #86efac 100%)",
                          }}
                        ></div>

                        <div style={{ padding: "12px" }}>
                          <h4
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              margin: "0 0 6px 0",
                              color: "#1e293b",
                            }}
                          >
                            {template.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              margin: "0 0 8px 0",
                              lineHeight: "1.4",
                            }}
                          >
                            {template.description}
                          </p>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: "#dcfce7",
                                color: "#166534",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              {template.category}
                            </span>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#94a3b8",
                              }}
                            >
                              {template.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Content Sections */}
            <div>
              {!loading && !error && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      style={{
                        border: "2px solid #f1f5f9",
                        borderRadius: "16px",
                        backgroundColor: "white",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <div
                        style={{
                          padding: "16px 24px",
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #f1f5f9",
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() => toggleSection(section.id)}
                      >
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            margin: 0,
                            color: "#1e293b",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {section.name}
                        </h3>
                        <svg
                          style={{
                            transform: section.isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            width: "20px",
                            height: "20px",
                            color: "#64748b",
                          }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {section.isExpanded && (
                        <div style={{ padding: "24px" }}>
                          {/* Experience Items */}
                          {section.experienceItems &&
                            section.experienceItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.experienceItems.map((exp) => (
                                  <div
                                    key={exp.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleExperienceClick(section.id, exp.id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={exp.id}
                                        checked={exp.checked}
                                        onCheckedChange={() =>
                                          handleExperienceToggle(
                                            section.id,
                                            exp.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: exp.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: exp.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <h4
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                margin: "0 0 4px 0",
                                                color: "#1e293b",
                                              }}
                                            >
                                              {exp.position}
                                            </h4>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                color: "#64748b",
                                                margin: "0 0 4px 0",
                                              }}
                                            >
                                              {exp.company} • {exp.location}
                                            </p>
                                            {exp.description && (
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#64748b",
                                                  margin: 0,
                                                  fontStyle: "italic",
                                                  whiteSpace: "pre-line",
                                                }}
                                              >
                                                {exp.description}
                                              </p>
                                            )}
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                              whiteSpace: "nowrap",
                                              marginLeft: "16px",
                                            }}
                                          >
                                            {exp.startDate} - {exp.endDate}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Education Items */}
                          {section.educationItems &&
                            section.educationItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.educationItems.map((edu) => (
                                  <div
                                    key={edu.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleEducationClick(section.id, edu.id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={edu.id}
                                        checked={edu.checked}
                                        onCheckedChange={() =>
                                          handleEducationToggle(
                                            section.id,
                                            edu.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: edu.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: edu.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <h4
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                margin: "0 0 4px 0",
                                                color: "#1e293b",
                                              }}
                                            >
                                              {edu.institution}
                                            </h4>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                color: "#64748b",
                                                margin: 0,
                                              }}
                                            >
                                              {edu.degree} in {edu.field}
                                            </p>
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                              whiteSpace: "nowrap",
                                              marginLeft: "16px",
                                            }}
                                          >
                                            {edu.startDate} - {edu.endDate}
                                          </span>
                                        </div>
                                        {(edu.gpa || edu.honors) && (
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "16px",
                                              fontSize: "14px",
                                              color: "#64748b",
                                            }}
                                          >
                                            {edu.gpa && (
                                              <span>GPA: {edu.gpa}</span>
                                            )}
                                            {edu.honors && (
                                              <span>• {edu.honors}</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Certification Items */}
                          {section.certificationItems &&
                            section.certificationItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.certificationItems.map((cert) => (
                                  <div
                                    key={cert.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleCertificationClick(
                                        section.id,
                                        cert.id
                                      )
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={cert.id}
                                        checked={cert.checked}
                                        onCheckedChange={() =>
                                          handleCertificationToggle(
                                            section.id,
                                            cert.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: cert.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: cert.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <h4
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                margin: "0 0 4px 0",
                                                color: "#1e293b",
                                              }}
                                            >
                                              {cert.name}
                                            </h4>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                color: "#64748b",
                                                margin: 0,
                                              }}
                                            >
                                              {cert.issuer}
                                            </p>
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                              whiteSpace: "nowrap",
                                              marginLeft: "16px",
                                            }}
                                          >
                                            {cert.date}
                                          </span>
                                        </div>
                                        {cert.credentialId && (
                                          <div
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                            }}
                                          >
                                            Credential ID: {cert.credentialId}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Project Items */}
                          {section.projectItems &&
                            section.projectItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.projectItems.map((project) => (
                                  <div
                                    key={project.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleProjectClick(section.id, project.id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={project.id}
                                        checked={project.checked}
                                        onCheckedChange={() =>
                                          handleProjectToggle(
                                            section.id,
                                            project.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: project.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: project.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <h4
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                margin: "0 0 4px 0",
                                                color: "#1e293b",
                                              }}
                                            >
                                              {project.name}
                                            </h4>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                color: "#64748b",
                                                margin: "0 0 4px 0",
                                              }}
                                            >
                                              {project.role}
                                            </p>
                                            {project.description && (
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#64748b",
                                                  margin: "0 0 4px 0",
                                                  fontStyle: "italic",
                                                  whiteSpace: "pre-line",
                                                }}
                                              >
                                                {project.description}
                                              </p>
                                            )}
                                            {project.technologies && (
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#64748b",
                                                  margin: 0,
                                                }}
                                              >
                                                <strong>Technologies:</strong>{" "}
                                                {project.technologies}
                                              </p>
                                            )}
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                              whiteSpace: "nowrap",
                                              marginLeft: "16px",
                                            }}
                                          >
                                            {project.startDate} -{" "}
                                            {project.endDate}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Skill Items */}
                          {section.skillItems &&
                            section.skillItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.skillItems.map((skill) => (
                                  <div
                                    key={skill.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleSkillClick(section.id, skill.id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={skill.id}
                                        checked={skill.checked}
                                        onCheckedChange={() =>
                                          handleSkillToggle(
                                            section.id,
                                            skill.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: skill.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: skill.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <h4
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            margin: "0 0 8px 0",
                                            color: "#1e293b",
                                          }}
                                        >
                                          {skill.category}
                                        </h4>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                          }}
                                        >
                                          {skill.skills.map(
                                            (skillItem, index) => (
                                              <span
                                                key={index}
                                                style={{
                                                  backgroundColor: "#e2e8f0",
                                                  color: "#475569",
                                                  padding: "4px 8px",
                                                  borderRadius: "4px",
                                                  fontSize: "14px",
                                                  fontWeight: "500",
                                                }}
                                              >
                                                {skillItem}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Volunteer Items */}
                          {section.volunteerItems &&
                            section.volunteerItems.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "16px",
                                }}
                              >
                                {section.volunteerItems.map((vol) => (
                                  <div
                                    key={vol.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "12px",
                                      cursor: "pointer",
                                      padding: "4px",
                                      borderRadius: "8px",
                                    }}
                                    onClick={() =>
                                      handleVolunteerClick(section.id, vol.id)
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "20px",
                                      }}
                                    >
                                      <Checkbox
                                        id={vol.id}
                                        checked={vol.checked}
                                        onCheckedChange={() =>
                                          handleVolunteerToggle(
                                            section.id,
                                            vol.id
                                          )
                                        }
                                      />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div
                                        style={{
                                          padding: "16px",
                                          backgroundColor: vol.checked
                                            ? "#f0f9ff"
                                            : "#f8fafc",
                                          borderRadius: "8px",
                                          border: vol.checked
                                            ? "2px solid #3b82f6"
                                            : "1px solid #e2e8f0",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                            marginBottom: "8px",
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <h4
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                margin: "0 0 4px 0",
                                                color: "#1e293b",
                                              }}
                                            >
                                              {vol.organization}
                                            </h4>
                                            <p
                                              style={{
                                                fontSize: "14px",
                                                color: "#64748b",
                                                margin: "0 0 4px 0",
                                              }}
                                            >
                                              {vol.role}
                                            </p>
                                            {vol.description && (
                                              <p
                                                style={{
                                                  fontSize: "14px",
                                                  color: "#64748b",
                                                  margin: 0,
                                                  fontStyle: "italic",
                                                  whiteSpace: "pre-line",
                                                }}
                                              >
                                                {vol.description}
                                              </p>
                                            )}
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "14px",
                                              color: "#64748b",
                                              whiteSpace: "nowrap",
                                              marginLeft: "16px",
                                            }}
                                          >
                                            {vol.startDate} - {vol.endDate}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Empty state for sections with no data */}
                          {!section.experienceItems?.length &&
                            !section.educationItems?.length &&
                            !section.certificationItems?.length &&
                            !section.projectItems?.length &&
                            !section.skillItems?.length &&
                            !section.volunteerItems?.length &&
                            !section.items?.length && (
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "40px",
                                  color: "#64748b",
                                  fontSize: "14px",
                                }}
                              >
                                No {section.name.toLowerCase()} data found in
                                your resume
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
