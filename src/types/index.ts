export type Category = "clt" | "pj" | "estudo" | "pessoal" | "social";

export interface TimeBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  category: Category;
  description?: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
}

export type CategoryFilter = Record<Category, boolean>;
