// resume-data.js

const resumeData = {
   personalInfo: {
    name: "Kida Khanooni",
    phone: "469-920-0092",
    email: "ksk.230002@utdallas.edu",
    location: "Plano, TX",
    linkedin: "linkedin.com/in/kida-khanooni"
  },
  
  education: {
    school: "The University of Texas at Dallas",
    location: "Richardson, TX",
    degree: "Bachelor of Computer Science",
    gpa: "4.0"
  },
  
  experience: [
    {
      company: "iCode",
      location: "Plano, TX",
      position: "Instructor",
      period: "June 2025 - Sept 2025",
      responsibilities: [
        "Taught 100+ students topics including Robotics, Web Development (HTML/CSS/JS), and Java fundamentals (OOP, APIs), building strong foundations in software design and backend logic."
      ]
    },
    {
      company: "FIRST ROBOTICS COMPETITION",
      location: "Plano, TX",
      position: "Team Captain",
      period: "March 2022 - March 2025",
      responsibilities: [
        "Programming Lead at FRC team 9128, led the team to the world championships in 2023 and 2024.",
        "Worked on custom logging systems and visualizers to enhance hardware communication with multiple robots, increasing debugging efficiency by 90%.",
        "Introduced custom neural networks and OpenCV pipelines on multiple robots, including April Tag localization, object detection, and color pipelines, which decrease driver cognition load by 30%."
      ]
    }
  ],
  
  projects: [
    {
      name: "DocBranch– AI Powered Resume Version Control App (In Progress)",
      description: "Building a cross-platform Electron app with React and AWS (Lambda, DynamoDB) for CRUD storage, PDF export, and AI-driven resume feedback based on job descriptions.",
      completion: "Expected Completion December 2025"
    },
    {
      name: "FRC Facial recognition Attendance App",
      description: "Developed a facial recognition app for automated attendance tracking using OpenCV, trained on team specific image datasets"
    }
  ],
  
  leadership: [
    {
      organization: "Go Baby Go",
      location: "Plano, TX",
      position: "Developer",
      period: "January 2025- March 2025",
      responsibilities: [
        "Modified toy cars for kids with disabilities to make them accessible",
        "CAD in SolidWorks",
        "Programming various sensors for safety enhancing purposes"
      ]
    },
    {
      organization: "Red Cross",
      location: "Plano, TX",
      position: "Club President",
      period: "September 2021- April 2025",
      responsibilities: [
        "Organized volunteering events of over 100 students at school",
        "Donated supplies to over 10 shelters",
        "Accumulated over 150 hours per participant over the 4 years"
      ]
    }
  ],
  
  skills: {
    technical: [
      "Java", "JavaScript", "Python", "React", "Node.js", "Electron", 
      "AWS (Lambda, DynamoDB, S3)", "SQL/NoSQL", "OpenCV", "OpenAI API", 
      "Git", "Agile Development"
    ],
    languages: [
      "English (fluent)",
      "Hindi (fluent)"
    ],
    certifications: [
      "Java certification by Pearson"
    ]
  },

  honors: [
    "First Tech Challenge North Texas Regional Deans List Award",
    "College Board AP Scholar Award"
  ]
};

// Export if used in Node or ES Modules
module.exports = resumeData;
