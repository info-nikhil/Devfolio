const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    demoLink: { type: String, default: "" },
    repoLink: { type: String, default: "" }
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    description: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" }
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    description: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      default: "My Portfolio"
    },
    templateId: {
      type: String,
      default: "template1"
    },
    profile: {
      name: { type: String, default: "" },
      profilePicture: { type: String, default: "" },
      aboutMe: { type: String, default: "" }
    },
    skills: [{ type: String }],
    projects: [projectSchema],
    experience: [experienceSchema],
    education: [educationSchema],
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" }
    },
    contactInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" }
    },
    customCode: {
      type: String,
      default: ""
    },
    deployUrl: {
      type: String,
      default: ""
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
