const { app } = require('electron');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function createResumePDF() {
    console.log('Starting PDF generation...');

    const outputPath = path.resolve(__dirname, 'professional-resume.pdf');
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(outputPath));

    doc.info.Title = 'Professional Resume';
    doc.info.Author = 'Jake Ryan';
    doc.info.Subject = 'Resume generated using PDFKit';

    const pageWidth = doc.page.width-100;

    const resumeData = {
        name: "Jake Ryan",
        contact: {
            phone: "(123)-456-7890",
            email: "jake@su.edu",
            linkedin: "linkedin.com/in/jake",
            github: "github.com/jake"
        },
        education: [
            {
                degree: "Bachelor of Arts in Computer Science, Minor in Business",
                school: "Southwestern University",
                location: "Georgetown, TX",
                period: "Aug. 2018 - May 2021"

            },
            {
                degree: "Associate's in Liberal Arts",
                school: "Blinn College",
                location: "Bryan, TX",
                period: "Aug. 2014 - May 2018"
            }
        ],
        experience: [
            {
                position: "Undergraduate Research Assistant",
                location: "College Station, TX",
                period: "June 2020 - Present",
                bullets: [
                    "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems.",
                    "Built a full-stack web app using Flask, React, PostgreSQL, and Docker to analyze GitHub data.",
                    "Visualized GitHub collaboration in classroom settings."
                ]
            },
            {
                position: "Information Technology Support Specialist",
                location: "Georgetown, TX",
                period: "Sep. 2018 - Present",
                bullets: [
                    "Communicated with managers to deploy and maintain campus computers.",
                    "Troubleshot hardware/software issues for students, faculty, and staff.",
                    "Maintained over 200 printers and classroom equipment."
                ]
            }
        ],
        projects: [
            {
                name: "Gitlytcs",
                tech: "Python, Flask, React, PostgreSQL, Docker",
                period: "June 2020 - Present",
                bullets: [
                    "Developed a full-stack app using Flask (backend) and React (frontend).",
                    "Implemented GitHub OAuth for repository data access.",
                    "Visualized GitHub data to show collaboration metrics."
                ]
            },
            {
                name: "Simple Paintball",
                tech: "Spigot API, Java, Maven, TravisCI, Git",
                period: "May 2018 - May 2020",
                bullets: [
                    "Created a Minecraft server plugin with 2K+ downloads and 4.5/5 rating.",
                    "Implemented continuous delivery using TravisCI.",
                    "Collaborated with server administrators for feedback and feature ideas."
                ]
            }
        ],
        skills: {
            languages: "Java, Python, C/C++, SQL, JavaScript, HTML/CSS",
            frameworks: "React, Node.js, Flask, JUnit, WordPress",
            tools: "Git, VS Code, PyCharm, IntelliJ, Eclipse"
        }
    };
    let y = 50;

    doc.fontSize(24).font('Helvetica-Bold')
        .text(resumeData.name, 50, y, { align: 'center', width: pageWidth });
    y += 30;

    const contactInfo = [
        resumeData.contact.phone,
        resumeData.contact.email,
        resumeData.contact.linkedin,
        resumeData.contact.github
    ].join(' | ');

    doc.fontSize(10).font('Helvetica')
        .text(contactInfo, 50, y, { align: 'center', width: pageWidth });
    y += 40;

    doc.fontSize(12).font('Helvetica-Bold').text('EDUCATION', 50, y);
    y += 20;

    resumeData.education.forEach(edu => {
        doc.fontSize(11).font('Helvetica-Bold').text(edu.school, 50, y);
        doc.fontSize(10).font('Helvetica').text(edu.degree, 200, y);
        doc.fontSize(10).text(edu.period, 450, y, { align: 'right' });
        y += 15;

        doc.fontSize(10).font('Helvetica').text(edu.location, 50, y);
        y += 25;
    });

    doc.fontSize(12).font('Helvetica-Bold').text('EXPERIENCE', 50, y);
    y += 20;

    resumeData.experience.forEach(job => {
        doc.fontSize(11).font('Helvetica-Bold').text(job.position, 50, y);
        doc.fontSize(10).font('Helvetica').text(job.company, 200, y);
        doc.fontSize(10).text(job.period, 450, y, { align: 'right' });
        y += 15;

        doc.fontSize(10).font('Helvetica').text(job.location, 50, y);
        y += 20;

        job.bullets.forEach(bullet => {
            doc.fontSize(9).font('Helvetica').text(`• ${bullet}`, 60, y, { width: 480 });
            y += 15;
        });
        y += 10;
    });

    doc.fontSize(12).font('Helvetica-Bold').text('PROJECTS', 50, y);
    y += 20;

    resumeData.projects.forEach(project => {
        doc.fontSize(11).font('Helvetica-Bold').text(project.name, 50, y);
        doc.fontSize(9).font('Helvetica').text(project.tech, 200, y);
        doc.fontSize(9).text(project.period, 450, y, { align: 'right' });
        y += 15;

        project.bullets.forEach(bullet => {
            doc.fontSize(9).font('Helvetica').text(`• ${bullet}`, 60, y, { width: 480 });
            y += 15;
        });
        y += 10;
    });

    //new page
    if (y > 600) {
        doc.addPage();
        y = 50;
    }

    doc.fontSize(12).font('Helvetica-Bold').text('SKILLS',50,y);
    y += 20;

    const skillsText = [
        `Languages: ${resumeData.skills.languages}`,
        `Frameworks: ${resumeData.skills.frameworks}`,
        `Developer Tools: ${resumeData.skills.tools}`
    ].join('\n');
    doc.fontSize(9).font('Helvetica').text(skillsText, 50, y, { width: 500 });

    doc.end();

    doc.on('end', () => {
        console.log('Resume generated');
        console.log('File saved at:', outputPath);
    });
}

app.whenReady().then(() => {
    console.log('Electron started');
    createResumePDF();
});

app.on('window-all-closed', () => app.quit());