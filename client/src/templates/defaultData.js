export const defaultPortfolioData = {
  title: "My Portfolio",
  templateId: "template1",
  profile: {
    name: "Your Name",
    profilePicture: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=500",
    aboutMe:
      "I am a full stack developer passionate about building clean, useful, and scalable web applications."
  },
  skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
  projects: [
    {
      title: "Portfolio Builder",
      description: "A SaaS platform that lets users create and deploy portfolios quickly.",
      demoLink: "https://example.com/demo",
      repoLink: "https://github.com/example/portfolio-builder"
    }
  ],
  experience: [
    {
      role: "Frontend Developer",
      company: "Tech Studio",
      description: "Built reusable React components and improved web performance.",
      startDate: "Jan 2024",
      endDate: "Present"
    }
  ],
  education: [
    {
      institution: "State University",
      degree: "B.Tech in Computer Science",
      description: "Focused on web technologies and software engineering.",
      startYear: "2020",
      endYear: "2024"
    }
  ],
  socialLinks: {
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    twitter: "https://twitter.com/example",
    website: "https://example.com"
  },
  contactInfo: {
    email: "you@example.com",
    phone: "+1 123 456 7890",
    location: "San Francisco, USA"
  }
};
