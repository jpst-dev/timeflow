import { Category, CategoryInfo } from "../types";

export const CATEGORIES: Record<Category, CategoryInfo> = {
  clt: {
    id: "clt",
    label: "CLT",
    color: "#3b82f6",
  },
  pj: {
    id: "pj",
    label: "PJ",
    color: "#10b981",
  },
  estudo: {
    id: "estudo",
    label: "Estudo",
    color: "#8b5cf6",
  },
  pessoal: {
    id: "pessoal",
    label: "Pessoal",
    color: "#f97316",
  },
  social: {
    id: "social",
    label: "Social",
    color: "#ec4899",
  },
};

export const getCategoryClass = (category: Category): string => {
  return `time-block-${category}`;
};

export const getCategoryFilterClass = (category: Category): string => {
  return `category-filter-${category}`;
};

export const getCategoryColor = (category: Category): string => {
  return CATEGORIES[category]?.color ?? "#9ca3af";
};
