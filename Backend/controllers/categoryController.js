import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;

    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name, slug, icon });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await Category.findOneAndDelete({ slug });

    if (!result) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: `Category '${slug}' deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};