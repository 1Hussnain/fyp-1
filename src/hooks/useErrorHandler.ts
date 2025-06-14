
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    let message = "An unexpected error occurred";
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    }

    // Handle specific Supabase/PostgreSQL errors
    if (message.includes('violates row-level security policy')) {
      message = "You don't have permission to access this data. Please make sure you're logged in.";
    } else if (message.includes('violates check constraint')) {
      if (message.includes('amount_positive')) {
        message = "Amount must be a positive number";
      } else if (message.includes('month_valid')) {
        message = "Month must be between 1 and 12";
      } else if (message.includes('year_valid')) {
        message = "Year must be between 2000 and 2100";
      } else if (message.includes('deadline_future')) {
        message = "Deadline must be in the future";
      } else {
        message = "Invalid data provided";
      }
    } else if (message.includes('duplicate key value violates unique constraint')) {
      if (message.includes('unique_user_budget_month_year')) {
        message = "Budget for this month already exists";
      } else if (message.includes('unique_category_name_type')) {
        message = "A category with this name and type already exists";
      } else {
        message = "This record already exists";
      }
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });

    return message;
  }, [toast]);

  const handleSuccess = useCallback((message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  }, [toast]);

  return { handleError, handleSuccess };
};
