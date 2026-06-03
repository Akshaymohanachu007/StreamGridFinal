import React, {
  useEffect,
  useState,
} from "react";

import { Link, useLocation }
  from "react-router-dom";

import {
  fetchCategories,
} from "../services/categoryService";

function CategoryScrollingbar() {

  const [categories, setCategories] =
    useState([]);

  const location = useLocation();

  
  const currentSlug = location.pathname.startsWith("/category/")
    ? location.pathname.split("/category/")[1]
    : null;

  const isHome = location.pathname === "/";

  useEffect(() => {

    const loadCategories =
      async () => {

        try {

          const data =
            await fetchCategories();

          setCategories(data);

        } catch (error) {

          console.error(error);
        }
      };

    loadCategories();

  }, []);

  return (
    <nav
      className="
        flex
        gap-3
        overflow-x-auto
        px-4
        py-3
        bg-black
        border-b
        border-white/10
        relative
        z-20
        hide-scrollbar
      "
    >

      
      <Link to="/">
        <button
          className={`
            whitespace-nowrap
            px-3
            py-1.5
            text-sm
            font-medium
            transition-colors
            duration-200
            rounded-lg
            ${isHome && !currentSlug
              ? "bg-white text-black"
              : "bg-white/10 text-white hover:bg-white/20"
            }
          `}
        >
          All
        </button>
      </Link>

      
      {categories.map((category) => (

        <Link
          key={category._id}
          to={`/category/${category.slug}`}
        >

          <button
            className={`
              whitespace-nowrap
              px-3
              py-1.5
              text-sm
              font-medium
              transition-colors
              duration-200
              rounded-lg
              ${currentSlug === category.slug
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
          >

            {category.icon}
            {" "}
            {category.name}

          </button>
        </Link>
      ))}

    </nav>
  );
}

export default CategoryScrollingbar;