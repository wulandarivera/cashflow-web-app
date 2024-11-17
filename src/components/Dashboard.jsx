import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { formatRupiah } from '../utils/formatCurrency';
import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ transactions }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [income, expenses],
      backgroundColor: ['#4F46E5', '#EF4444'],
      borderColor: ['#4338CA', '#DC2626'],
      borderWidth: 1,
    }],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 dark:bg-dark-card dark:text-dark-text backdrop-blur-sm rounded-xl shadow-lg p-6 relative z-10"
      >
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-xl font-semibold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Financial Overview
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-indigo-50 dark:bg-dark-primary-light/10 p-4 rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            <motion.p 
              className="text-indigo-600 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Income
            </motion.p>
            <motion.p 
              className="text-2xl font-bold text-indigo-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formatRupiah(income)}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-red-50 p-4 rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            <motion.p 
              className="text-red-600 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Expenses
            </motion.p>
            <motion.p 
              className="text-2xl font-bold text-red-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formatRupiah(expenses)}
            </motion.p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-emerald-50 p-4 rounded-lg transform transition-all duration-300 hover:scale-105"
          >
            <motion.p 
              className="text-emerald-600 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Balance
            </motion.p>
            <motion.p 
              className="text-2xl font-bold text-emerald-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formatRupiah(balance)}
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          className="w-full max-w-xs mx-auto"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Doughnut 
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: 'bottom'
                }
              },
              animation: {
                animateScale: true,
                animateRotate: true
              }
            }}
          />
        </motion.div>

        {/* Animated particles in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-500 rounded-full opacity-20"
              initial={{ 
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              animate={{
                x: [Math.random() * 400 - 200, Math.random() * 400 - 200],
                y: [Math.random() * 400 - 200, Math.random() * 400 - 200],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}