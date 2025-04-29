
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";

const GoogleButton = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50"
        type="button"
      >
        <Google size={18} />
        <span>Continue with Google</span>
      </Button>
    </motion.div>
  );
};

export default GoogleButton;
