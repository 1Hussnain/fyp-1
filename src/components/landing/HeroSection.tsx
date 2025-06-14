
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-inherit text-slate-100">
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
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Smart Financial
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 block">
                Management
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Take control of your finances with AI-powered insights, automated tracking, 
              and intelligent budgeting tools designed to help you achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
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
            <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-green-500/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-semibold">Total Balance</span>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">$24,580.00</div>
                <div className="text-green-400 text-sm">+12.5% from last month</div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-500/10 rounded-lg p-4">
                    <div className="text-green-400 text-sm">Income</div>
                    <div className="text-white font-semibold">$5,420</div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4">
                    <div className="text-red-400 text-sm">Expenses</div>
                    <div className="text-white font-semibold">$2,180</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
