
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TransactionFilterProps {
  filter: {
    type: "all" | "income" | "expense";
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  onFilterChange: (filter: {
    type: "all" | "income" | "expense";
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  onResetFilters: () => void;
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  filter,
  onFilterChange,
  onResetFilters,
}) => {
  const handleTypeChange = (value: "all" | "income" | "expense") => {
    onFilterChange({ ...filter, type: value });
  };

  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    if (type === "start") {
      onFilterChange({ ...filter, startDate: date });
    } else {
      onFilterChange({ ...filter, endDate: date });
    }
  };

  return (
    <div className="mb-4 p-4 border rounded-lg bg-white">
      <h4 className="text-md font-medium mb-4">Filter Transactions</h4>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Transaction Type</div>
          <RadioGroup
            value={filter.type}
            onValueChange={(value) => handleTypeChange(value as "all" | "income" | "expense")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income">Income</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">Expense</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Start Date</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filter.startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filter.startDate ? format(filter.startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filter.startDate}
                  onSelect={(date) => handleDateChange(date, "start")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">End Date</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filter.endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filter.endDate ? format(filter.endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filter.endDate}
                  onSelect={(date) => handleDateChange(date, "end")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetFilters}
            className="text-xs"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;
