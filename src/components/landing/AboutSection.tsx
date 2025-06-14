
import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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
        }}>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">About FinanceAI</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            FinanceAI is a comprehensive financial management platform that leverages artificial intelligence 
            to provide personalized insights and recommendations. Our mission is to democratize financial 
            literacy and empower users to make informed decisions about their money through intuitive tools 
            and smart automation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
