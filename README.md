<h1 align="center"> DocBranch 📄🌿 </h1>

<div align="center">
A version-control tool for documents where “the latest might not be the greatest.”  
DocBranch helps users manage and visualize variations of their resumes (or other documents) over time.  
By offering side-by-side comparisons, branching history, and AI-driven summaries, it allows users to efficiently reuse past work and adapt documents to new opportunities.  
</div>

---

## Summary ✍️

Many college students—especially in fields like Computer Science, Computer Engineering, and other broad STEM areas—must tailor dozens of resumes for internships and jobs.  
The details matter: one small tweak to a bullet point could mean the difference between an interview and rejection.

Traditional file systems make it easy to lose track of changes, overwrite good versions, or waste time rewriting from scratch.  
**DocBranch** solves this by providing a structured, visual version-control system for resumes and documents, making it easy to branch, merge, compare, and refine documents across many applications.
Serving as a tool to augment the process of writing, tailoring, or editing a resume (or any document for that matter), DocBranch's intuitive user flow, integral tools, and additional A.I. insight keep you focused on the most important pieces of the puzzle.

---

## MVP 🏆

- **Resume Cloud Upload**  
  Bulk upload all resume versions into secure cloud storage, accessible on any device.
- **Offline Access**  
  Local SQLite database stores and syncs file states for offline use.
- **File Relationship Tracker**  
  Parent/child file tracking with branching support (resume “lineages”).
  - Stretch: Support for multiple parents (merged documents).
- **Branching System**  
  Users can define and label branches either at a split (multiple children) or along any lineage.
- **Side-by-Side Resume Display**  
  Compare any two resumes across branches.
- **Parent-Child Resume Visualization**  
  View document history with AI-generated notes summarizing meaningful differences between versions.
- **Drag-and-Drop Interface**  
  Rearranging files directly updates their lineage relationships.
- **Resume Search**  
  Search by:
  - Date
  - Company/Position (via tags)
  - Branch name
  - Job description (AI returns most relevant resumes)

---

## Stretch Goals 🌟

- **Built-in LaTeX Editor** for advanced editing.
- **AI-Driven Resume Editing** that generates resumes based on user instructions.
  - Support for LaTeX and Word documents.
- **Generalized Document Support** beyond PDFs.
- **Resume Quality Scoring** to help users prioritize strong drafts.

---

## Milestones ☀️

<details closed>
<summary><strong>Week 1-2: Setup & Onboarding 🌱</strong></summary>
<br>

- Align on project goals and refine the app vision.
- **Team Setup**
  - Install VS Code, Electron, Node.js, React, TypeScript, Git, SQLite.
  - Tutorials on React + TypeScript for beginners.
  - Tutorials on Electron for the full team.
  - Git workflows: branching, pull requests.
- **Integration**
  - Build a sample Electron + React project (tutorial app).
- **Frontend**
  - Initial Figma designs.
- **Backend**
  - Define SQL schema and file system access.
  - Practice CRUD operations with local database.

</details>

<details closed>
<summary><strong>Week 3-4: Local Storage & UI Foundations ⚙️</strong></summary>
<br>

- **Backend**
  - Implement local storage and file selection.
  - Track relationships in SQL database.
  - Test CRUD functionality.
- **Frontend**
  - Begin UI for browsing files.
  - Integrate React Flow for visualizing file relationships.

</details>

<details closed>
<summary><strong>Weeks 4-6: Core Features 🔑</strong></summary>
<br>

- Side-by-side resume comparison and search.
- Drag-and-drop interactions to rearrange branches (reflected in DB).
- Begin bug testing.
- **Backend**
  - Integrate OpenAI API for summarization, comparisons, and search.
  - Handle REST requests through Node.js.

</details>

<details closed>
<summary><strong>Weeks 7-8: Cloud Integration ☁️</strong></summary>
<br>

- Add Supabase for cloud storage and syncing.
- Integrate local + cloud systems.
- Connect AI summarization with database and UI.
- Improve drag-and-drop interactions and branch visuals.
- Begin UI/UX polish.

</details>

<details closed>
<summary><strong>Weeks 8-9: Stabilization & Testing 🧪</strong></summary>
<br>

- Finalize integrations (frontend ↔ backend ↔ databases).
- Eliminate bugs and optimize performance.
- Streamline user flow and UI responsiveness.

</details>

<details closed>
<summary><strong>Week 10: Final Prep 🎬</strong></summary>
<br>

- Optimize for live demo.
- Presentation prep (slides, script, demo).

</details>

---

## Tech Stack 💻

**Frontend**

- [Electron](https://www.electronjs.org/) – Cross-platform desktop app framework.
- [React.js + TypeScript](https://react.dev/) – Scalable UI development.
- [React Flow](https://reactflow.dev/) – Visual file relationships and drag-and-drop editing.
- [Tailwind CSS + shadcn](https://tailwindcss.com/) – Clean, modern UI.
- [PDF.js](https://mozilla.github.io/pdf.js/) – PDF display, search, and comparison.

**Backend**

- [AWS Textract + S3 + DynamoDB](https://aws.amazon.com/) - Parsing resume data, cloud backups for resumes, and storing metadata
- [SQLite](https://www.sqlite.org/index.html) – Lightweight local database.
- [OpenAI API](https://platform.openai.com/docs/api-reference) – Resume summarization and intelligent search.

---

## Resources 🔎

**Frontend**

- [React Tutorial for Beginners](https://www.youtube.com/watch?v=SqcY0GlETPk&t=2078s)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [React Flow Docs](https://reactflow.dev/docs/)

**Backend + Electron**

- [Electron Tutorial](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app)
- [Supabase Docs](https://supabase.com/docs/guides)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Electron + React + TypeScript Integration](https://www.electronforge.io/guides/framework-integration/react-with-typescript)

## Running Instructions

**Frontend**

- In the terminal run [cd frontend/electron] to go into the electron folder
- run [npm run start] to open the electron window

**Backend**

- **AWS ACCESS KEYS ARE REQUIRED TO RUN THE BACKEND**
- In the terminal run [cd backend] to go into the electron folder
- run [node testapp.js] to run the backend
- The terminal will prompt you with three questions:
  - File path of uploaded file:
  - Location of new file:
  - Name of file in s3:
- Give a file path as a response to the first two prompts
  - Example: C:/Users/Downloads/image.jpg
  - Example: C:/Users/OneDrive/Pictures/downloadedimage.jpg
    - downloadedimage.jpg is the name of the new file that will be created
- The name of file in s3 will be the name of the file uploaded to the s3 bucket
