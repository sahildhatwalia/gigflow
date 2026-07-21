import Portfolio from "../models/Portfolio.js";

// Get portfolios for current freelancer
export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ freelancer: req.user.id })
      .sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a portfolio item
export const createPortfolio = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;

    let image = "";
    if (req.file) {
      image = `uploads/${req.file.filename}`;
    }

    let techStackArray = [];
    if (techStack) {
      if (Array.isArray(techStack)) {
        techStackArray = techStack;
      } else if (typeof techStack === "string") {
        techStackArray = techStack.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    const portfolio = await Portfolio.create({
      freelancer: req.user.id,
      title,
      description,
      techStack: techStackArray,
      githubLink,
      liveLink,
      image,
    });

    res.status(201).json({
      message: "Portfolio item added successfully",
      portfolio,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a portfolio item
export const updatePortfolio = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    // Check ownership
    if (portfolio.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify this item" });
    }

    let techStackArray = portfolio.techStack;
    if (techStack !== undefined) {
      if (Array.isArray(techStack)) {
        techStackArray = techStack;
      } else if (typeof techStack === "string") {
        techStackArray = techStack.split(",").map(t => t.trim()).filter(Boolean);
      }
    }

    portfolio.title = title || portfolio.title;
    portfolio.description = description || portfolio.description;
    portfolio.techStack = techStackArray;
    portfolio.githubLink = githubLink !== undefined ? githubLink : portfolio.githubLink;
    portfolio.liveLink = liveLink !== undefined ? liveLink : portfolio.liveLink;

    if (req.file) {
      portfolio.image = `uploads/${req.file.filename}`;
    }

    const updatedPortfolio = await portfolio.save();
    res.json(updatedPortfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a portfolio item
export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    // Check ownership
    if (portfolio.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: "Portfolio item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
