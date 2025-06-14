
import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, PieChart, TrendingUp, Shield, Smartphone } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Smart Financial Tracking",
      description: "Monitor your income and expenses with intelligent categorization and real-time insights."
    },
    {
      icon: Target,
      title: "Goal Management",
      description: "Set and track your financial goals with personalized recommendations and progress monitoring."
    },
    {
      icon: PieChart,
      title: "Budget Analytics",
      description: "Advanced analytics and visualizations to understand your spending patterns and optimize your budget."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security ensures your financial data is protected with end-to-end encryption."
    },
    {
      icon: Smartphone,
      title: "Cross-Platform",
      description: "Access your financial dashboard anywhere with our responsive web application."
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice and insights powered by artificial intelligence."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
        }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to manage your finances effectively</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{
              opacity: 0,
              y: 50
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
