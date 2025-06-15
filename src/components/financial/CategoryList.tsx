
import React from "react";
import OptimizedCategoryList from "./OptimizedCategoryList";
import { Category } from "@/types/database";

interface CategoryListProps {
  categories: Category[];
  onRefresh: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => Promise<void>;
  onBudgetChange: (category: Category, value: string) => Promise<void>;
}

const CategoryList = (props: CategoryListProps) => {
  return <OptimizedCategoryList {...props} />;
};

export default CategoryList;
