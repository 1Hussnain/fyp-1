
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    "Automated transaction categorization",
    "Real-time spending alerts",
    "Comprehensive financial reports",
    "Goal-based savings plans",
    "Smart budget recommendations",
    "Secure data encryption"
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose FinanceAI?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who have transformed their financial lives with our intelligent platform.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div key={benefit} initial={{
                  opacity: 0,
                  x: -20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }} viewport={{
                  once: true
                }} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="relative">
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">99.9%</div>
                <div className="text-green-600 text-lg mb-6">Uptime Guarantee</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-gray-600 text-sm">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$2M+</div>
                    <div className="text-gray-600 text-sm">Tracked</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
