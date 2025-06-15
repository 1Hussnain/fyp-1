import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
const HeroSection = () => {
  return <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Smart Financial
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 block">
                Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Take control of your finances with AI-powered insights, automated tracking, 
              and intelligent budgeting tools designed to help you achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="text-white shadow-lg bg-sky-700 hover:bg-sky-600">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="relative">
            <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">Total Balance</span>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">$24,580.00</div>
                <div className="text-green-600 text-sm">+12.5% from last month</div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-green-600 text-sm">Income</div>
                    <div className="text-gray-900 font-semibold">$5,420</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <div className="text-red-600 text-sm">Expenses</div>
                    <div className="text-gray-900 font-semibold">$2,180</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-200/40 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default HeroSection;