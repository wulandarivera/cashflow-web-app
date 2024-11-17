import { useState } from 'react';
import { FaChartLine, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfile from './EditProfile';

export default function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const displayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'User';

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const menuItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.2
      }
    }),
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <FaChartLine className="text-2xl animate-bounce-slow" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              CashFlow Tracker
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center space-x-4"
          >
            <p className="text-indigo-200 hidden md:block">
              Selamat datang, <span className="font-medium text-white">{displayName}</span>
            </p>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center border-2 border-white/30">
                    <span className="font-semibold">{getInitials(displayName)}</span>
                  </div>
                )}
                <motion.span 
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden md:block"
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <motion.div 
                        variants={menuItemVariants}
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        className="px-4 py-2 border-b"
                      >
                        <p className="text-sm text-gray-700">{user.email}</p>
                      </motion.div>
                      
                      <motion.button
                        variants={menuItemVariants}
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => {
                          setIsEditProfileOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FaUserCircle />
                        <span>Edit Profil</span>
                      </motion.button>

                      <motion.button
                        variants={menuItemVariants}
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => {/* Tambahkan fungsi pengaturan */}}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FaCog />
                        <span>Pengaturan</span>
                      </motion.button>

                      <motion.button
                        variants={menuItemVariants}
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <EditProfile 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </header>
  );
}