export type Category =
  | "clt"
  | "pj"
  | "estudo"
  | "pessoal"
  | "social"
  | "external";

export interface TimeBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  category: Category;
  source?: "google" | "outlook" | "apple";
}

export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
}

export type CategoryFilter = Record<Category, boolean>;
