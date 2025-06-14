
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-12 border border-gray-200 shadow-lg">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Finances?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey to financial freedom today with FinanceAI's intelligent tools and insights.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
