
import { z } from "zod";

// Transaction validation schema
export const transactionSchema = z.object({
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount too large"),
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Type must be income or expense" }) }),
  description: z.string().max(500, "Description too long").optional(),
});

// Budget validation schema
export const budgetSchema = z.object({
  monthly_limit: z.number().positive("Budget limit must be positive").max(10000000, "Budget limit too large"),
  month: z.number().int().min(1, "Invalid month").max(12, "Invalid month"),
  year: z.number().int().min(2000, "Invalid year").max(2100, "Invalid year"),
});

// Financial goal validation schema
export const goalSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100, "Goal name too long"),
  target_amount: z.number().positive("Target amount must be positive").max(10000000, "Target amount too large"),
  saved_amount: z.number().min(0, "Saved amount cannot be negative").max(10000000, "Saved amount too large"),
  deadline: z.string().refine((date) => {
    const goalDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return goalDate >= today;
  }, "Deadline must be in the future"),
  goal_type: z.enum(["short-term", "long-term", "emergency"], {
    errorMap: () => ({ message: "Invalid goal type" })
  }),
});

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name too long"),
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Type must be income or expense" }) }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
});

// Validation helper function
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ["Validation failed"] };
  }
};
