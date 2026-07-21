import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: "",
    },
    liveLink: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
