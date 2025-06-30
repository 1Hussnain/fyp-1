import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
// Temporarily disabled complex features to fix crashes
// import { useSearchOptimized } from "@/hooks/useSearchOptimized";
// import NotificationCenter from "./NotificationCenter";
const EnhancedTopNav = () => {
  const {
    user
  } = useAuth();
  const {
    isDarkMode,
    toggleDarkMode
  } = useTheme();
  const [showSearchResults, setShowSearchResults] = useState(false);
  // Temporarily disabled search to fix crashes
  const searchTerm = '';
  const searchResults: any[] = [];
  const isSearching = false;
  const handleSearch = (term: string) => {};
  const handleResultClick = (result: any) => {};
  const clearSearch = () => {};
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to transactions page with search filter if no specific results
      if (searchResults.length === 0) {
        window.location.href = `/transactions?search=${encodeURIComponent(searchTerm)}`;
      }
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
    setShowSearchResults(value.length > 0);
  };
  const handleResultSelect = (result: any) => {
    handleResultClick(result);
    setShowSearchResults(false);
  };
  return <motion.div initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 px-4 lg:px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">
            Financial Dashboard
          </h2>
          
          <div className="relative max-w-md flex-1 sm:flex-initial">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input placeholder="Search transactions, goals..." value={searchTerm} onChange={handleInputChange} onFocus={() => searchTerm && setShowSearchResults(true)} className="pl-10 pr-10 w-full sm:w-64 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
              {searchTerm && <Button type="button" variant="ghost" size="sm" onClick={() => {
              clearSearch();
              setShowSearchResults(false);
            }} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>}
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {isSearching ? <div className="p-4 text-center text-gray-500">Searching...</div> : searchResults.length > 0 ? <div className="py-2">
                    {searchResults.map(result => <button key={result.id} onClick={() => handleResultSelect(result)} className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {result.description}
                          </div>
                        </div>
                        {result.amount && <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            ${result.amount.toFixed(2)}
                          </div>}
                      </button>)}
                  </div> : searchTerm ? <div className="p-4 text-center text-gray-500">
                    No results found. Press Enter to search in transactions.
                  </div> : null}
              </div>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <NotificationCenter /> */}
          
          <Button variant="outline" size="sm" onClick={toggleDarkMode} className="dark:border-gray-600 dark:hover:bg-gray-700">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
    </motion.div>;
};
export default EnhancedTopNav;