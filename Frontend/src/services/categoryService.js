import api from "../lib/api";

export const fetchCategories = async () => {
  try {
    const response = await api.get("/categories");
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories from backend, using fallback:", error);
  }

  return [
    { _id: "1", name: "Gaming", slug: "gaming", icon: "🎮" },
    { _id: "2", name: "Music", slug: "music", icon: "🎵" },
    { _id: "3", name: "Movies", slug: "movies", icon: "🎬" },
    { _id: "4", name: "Sports", slug: "sports", icon: "⚽" },
    { _id: "5", name: "Technology", slug: "technology", icon: "💻" },
  ];
};