import { useAppSelector, useAppDispatch } from "../hooks";
import {
  toggleCategoryFilter,
  resetFilters,
} from "../store/slices/filtersSlice";
import { CATEGORIES } from "../utils/categories";
import { cn } from "../utils/cn";
import { Category } from "../types";
import { motion } from "framer-motion";

export const CategoryFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const handleToggleCategory = (category: Category) => {
    dispatch(toggleCategoryFilter(category));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
        Categorias
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {Object.values(CATEGORIES).map((category) => {
          const isActive = filters[category.id];
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                `category-filter category-filter-${category.id}`,
                isActive
                  ? "ring-2 ring-offset-2 dark:ring-offset-gray-800"
                  : "opacity-70 hover:opacity-100",
                "transition-all duration-200 focus:outline-none"
              )}
              onClick={() => handleToggleCategory(category.id)}
              aria-pressed={isActive}
            >
              <div className="flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                    isActive ? "bg-current" : "bg-current opacity-70"
                  }`}
                />
                {category.label}
              </div>
            </motion.button>
          );
        })}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetFilters}
          className="px-3 py-1 ml-2 text-sm font-medium text-gray-700 transition-all bg-gray-200 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Resetar
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
