
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Target, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const LandingPage = () => {
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

  const benefits = [
    "Automated transaction categorization",
    "Real-time spending alerts",
    "Comprehensive financial reports",
    "Goal-based savings plans",
    "Smart budget recommendations",
    "Secure data encryption"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">FinanceAI</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors">About</a>
              <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-green-400 transition-colors">Benefits</a>
            </div>
            <Link to="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                <Link to="/dashboard">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-white border-green-400 hover:bg-green-400/10">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">About FinanceAI</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              FinanceAI is a comprehensive financial management platform that leverages artificial intelligence 
              to provide personalized insights and recommendations. Our mission is to democratize financial 
              literacy and empower users to make informed decisions about their money through intuitive tools 
              and smart automation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-300">Everything you need to manage your finances effectively</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              >
                <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose FinanceAI?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who have transformed their financial lives with our intelligent platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-green-500/20">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-green-400 text-lg mb-6">Uptime Guarantee</div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">10K+</div>
                      <div className="text-gray-300 text-sm">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">$2M+</div>
                      <div className="text-gray-300 text-sm">Tracked</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-12 border border-green-500/30"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey to financial freedom today with FinanceAI's intelligent tools and insights.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-green-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">FinanceAI</div>
          <p className="text-gray-400 mb-6">Smart Financial Management for Everyone</p>
          <div className="text-gray-500 text-sm">
            © 2024 FinanceAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
