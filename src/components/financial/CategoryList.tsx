
/**
 * Category List Component
 * 
 * A wrapper component that renders the optimized category list.
 * This component serves as an interface layer between parent components
 * and the optimized implementation, allowing for easy swapping of
 * implementations without changing the parent component's interface.
 */

import React from "react";
import OptimizedCategoryList from "./OptimizedCategoryList";
import { Category } from "@/types/database";

/**
 * Props interface for CategoryList component
 */
interface CategoryListProps {
  /** Array of categories to display */
  categories: Category[];
  /** Callback function to refresh the category list */
  onRefresh: () => void;
  /** Callback function when a category is edited */
  onEdit: (category: Category) => void;
  /** Callback function when a category is deleted */
  onDelete: (category: Category) => Promise<void>;
  /** Callback function when a category's budget is changed */
  onBudgetChange: (category: Category, value: string) => Promise<void>;
}

/**
 * CategoryList Component
 * 
 * Renders a list of financial categories with options to edit, delete,
 * and modify budgets. Uses the optimized implementation for better performance.
 */
const CategoryList = (props: CategoryListProps) => {
  return <OptimizedCategoryList {...props} />;
};

export default CategoryList;
