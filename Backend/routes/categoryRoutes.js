import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/")
  .post(createCategory)
  .get(getCategories);

router.delete("/:slug", deleteCategory);

export default router;