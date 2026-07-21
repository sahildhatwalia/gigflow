import Project from "../models/Project.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { title, description, budget, category, skills } = req.body;

    let image = "";
    if (req.file) {
      image = `uploads/${req.file.filename}`;
    }

    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    const project = await Project.create({
      title,
      description,
      budget: Number(budget),
      category,
      skills: skillsArray,
      client: req.user.id,
      image,
    });

    res.status(201).json({
      message: "Project posted successfully",
      project,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Projects with Search, Filters and Pagination
export const getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { query, category, skills } = req.query;

    let filter = {};

    // Search query matches title or description
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (skills) {
      const skillsList = skills.split(",").map(s => s.trim()).filter(Boolean);
      if (skillsList.length > 0) {
        filter.skills = { $in: skillsList };
      }
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate("client", "name email avatar role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalProjects: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email avatar role bio github linkedin website")
      .populate("proposals.freelancer", "name email avatar role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { title, description, budget, category, skills, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    let skillsArray = project.skills;
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.budget = budget !== undefined ? Number(budget) : project.budget;
    project.category = category || project.category;
    project.skills = skillsArray;
    project.status = status || project.status;

    if (req.file) {
      project.image = `uploads/${req.file.filename}`;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Projects (specifically endpoints for search-based queries)
export const searchProjects = async (req, res) => {
  try {
    const { query } = req.query;

    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
      ],
    }).populate("client", "name email avatar");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload Project Image
export const uploadImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify this project" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    project.image = `uploads/${req.file.filename}`;
    await project.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Submit a proposal
export const submitProposal = async (req, res) => {
  try {
    const { bidAmount, coverLetter } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.client.toString() === req.user.id) {
      return res.status(400).json({ message: "Clients cannot submit proposals to their own projects" });
    }

    // Check if already applied
    const alreadyApplied = project.proposals.some(
      (p) => p.freelancer.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already submitted a proposal for this project" });
    }

    project.proposals.push({
      freelancer: req.user.id,
      bidAmount: Number(bidAmount),
      coverLetter,
    });

    await project.save();

    res.status(201).json({
      message: "Proposal submitted successfully",
      project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel a proposal
export const cancelProposal = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Filter out proposal
    const index = project.proposals.findIndex(
      (p) => p.freelancer.toString() === req.user.id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    project.proposals.splice(index, 1);
    await project.save();

    res.json({ message: "Proposal cancelled successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get freelancer proposals (my applications)
export const getMyProposals = async (req, res) => {
  try {
    const projects = await Project.find({
      "proposals.freelancer": req.user.id,
    }).populate("client", "name email avatar");

    const proposals = projects.map((project) => {
      const proposal = project.proposals.find(
        (p) => p.freelancer.toString() === req.user.id
      );
      return {
        _id: proposal._id,
        project: {
          _id: project._id,
          title: project.title,
          budget: project.budget,
          category: project.category,
          status: project.status,
        },
        client: project.client,
        bidAmount: proposal.bidAmount,
        coverLetter: proposal.coverLetter,
        status: proposal.status,
        appliedDate: proposal.createdAt,
      };
    });

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a proposal status (accept/reject)
export const updateProposalStatus = async (req, res) => {
  try {
    const { projectId, proposalId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify proposals for this project" });
    }

    const proposal = project.proposals.id(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = status;

    if (status === "accepted") {
      project.status = "in-progress";
    }

    await project.save();

    res.json({
      message: `Proposal status updated to ${status} successfully`,
      project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
