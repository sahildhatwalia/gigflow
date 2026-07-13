import Product from "../models/model.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    let image = "";

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      price,
      category,
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Read All
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read One
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const updateData = {
      name,
      price,
      category,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search Products
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const products = await Product.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          category: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload Product Image
export const uploadImage = async (req, res) => {
  
  
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // console.log(req.file);

    // Save image path
    product.image = `uploads/${req.file.filename}`

    await product.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};