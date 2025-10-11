// sephora-internship.js


const jobDescription = {
  company: "Sephora",
  title: "Software Engineering Intern — Commerce / API",
  location: {
    remote: true,
    remoteTimeZone: "Pacific Standard Time (PST)",
    onsiteRequirement: {
      required: true,
      city: "San Francisco, CA",
      onsiteDuration: "1 week (during internship)"
    },
    relocationAfterGraduation: {
      openToRelocate: true,
      targetLocation: "San Francisco Bay Area (for full-time hybrid roles)"
    }
  },

  responsibilities: [
    "Hands-on development of Java-based APIs.",
    "Work with AI concepts including Model-context Protocol and software 2.0; hands-on experience in any AI-related area.",
    "Contribute to system design, architecture, security, scalability, reliability, and performance for sephora.com and commerce APIs.",
    "Work effectively under pressure in a fast-paced environment."
  ],

  requiredSkills: [
    "Familiarity with design patterns such as circuit breaker, Backend For Frontend (BFF), Saga, CQRS, etc.",
    "Ability to understand and refactor existing program code.",
    "Experience using at least one AI pair-programming tool (e.g., GitHub Copilot).",
    "Knowledge of Kafka and event-driven architecture.",
    "Experience with Oracle / MySQL / NoSQL databases.",
    "Familiarity with application monitoring solutions (e.g., Splunk, Dynatrace).",
    "Ability to write and consume RESTful APIs.",
    "Excellent written and verbal communication skills.",
    "Results-oriented and self-motivated."
  ],

  prerequisites: {
    niceToHave: [
      "Experience developing microservices using Spring Boot framework."
    ]
  },

  eligibilityRequirements: {
    graduationYears: [2026, 2027],
    degreeLevels: ["Undergraduate", "Graduate"],
    residency: {
      mustResideInUS: true,
      ableToWorkPermanentlyInUS: true
    },
    availability: {
      internshipWindow: {
        start: "2026-06-01",
        end: "2026-08-14"
      },
      onsiteWeek: "1-week on-site experience in San Francisco, CA (dates TBD)"
    },
    timezoneAlignment: "Work schedule must align with Pacific Standard Time (PST)"
  },

  notes: [
    "Remote program during internship; candidates must permanently reside and work in the U.S.",
    "Candidates should be open to relocating to the San Francisco Bay Area upon graduation for consideration for full-time hybrid roles."
  ]
};


//const jobDescription = "https://join.sephora.com/careers?query=790312030987&location=any&pid=790312030986&domain=sephora.com&sort_by=relevance"
// Export for Node or ES module usage
module.exports = jobDescription;
