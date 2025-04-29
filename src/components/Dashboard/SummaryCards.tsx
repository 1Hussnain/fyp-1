
import React from "react";
import { motion } from "framer-motion";
import { Wallet, CreditCard, PiggyBank, Calendar } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const SummaryCards = () => {
  const cards = [
    { title: "Total Income", amount: "$9,850", icon: Wallet, color: "text-green-500" },
    { title: "Total Expenses", amount: "$5,560", icon: CreditCard, color: "text-red-500" },
    { title: "Savings", amount: "$4,290", icon: PiggyBank, color: "text-blue-500" },
    { title: "Upcoming Bills", amount: "$1,725", icon: Calendar, color: "text-orange-500" }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="bg-white p-4 rounded-xl shadow transition hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-lg p-2 ${card.color} bg-opacity-10`}>
              <card.icon size={24} className={card.color} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold">{card.amount}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SummaryCards;
