import { useState } from 'react';



import { useAuth } from '../context/AuthContext';



import toast from 'react-hot-toast';



import { motion } from 'framer-motion';



import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';



import AnimatedBackground from './AnimatedBackground';







export default function Register({ onSwitchToLogin }) {



  const [name, setName] = useState('');



  const [email, setEmail] = useState('');



  const [password, setPassword] = useState('');



  const [loading, setLoading] = useState(false);



  const { register } = useAuth();







  const handleSubmit = async (e) => {



    e.preventDefault();



    if (password.length < 6) {



      toast.error('Password minimal 6 karakter');



      return;



    }







    setLoading(true);



    try {



      await register({



        name,



        email,



        password



      });



    } catch (error) {



      console.error('Registration error:', error);



    } finally {



      setLoading(false);



    }



  };







  return (



    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient bg-[length:400%_400%]">



      <AnimatedBackground />







      <motion.div



        initial={{ opacity: 0, y: 20 }}



        animate={{ opacity: 1, y: 0 }}



        transition={{ duration: 0.5 }}



        className="bg-white/90 backdrop-blur-lg p-8 rounded-lg shadow-2xl w-96 relative z-10"



      >



        <motion.div



          initial={{ scale: 0 }}



          animate={{ scale: 1 }}



          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}



          className="text-center"



        >



          <motion.div



            animate={{ 



              scale: [1, 1.2, 1],



              rotate: [0, 360, 0]



            }}



            transition={{



              duration: 3,



              repeat: Infinity,



              repeatDelay: 4



            }}



            className="inline-block mb-4"



          >



            <FaUserPlus className="text-4xl text-indigo-600" />



          </motion.div>



          <h2 className="text-3xl font-heading font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">



            Create Account



          </h2>



          <p className="text-gray-600 font-display">



            Start your financial journey



          </p>



        </motion.div>







        <form onSubmit={handleSubmit} className="space-y-4">



          <motion.div



            initial={{ x: -50, opacity: 0 }}



            animate={{ x: 0, opacity: 1 }}



            transition={{ delay: 0.3 }}



          >



            <label className="block text-gray-700 mb-2">Nama</label>



            <div className="relative">



              <FaUser className="absolute left-3 top-3 text-gray-400" />



              <input



                type="text"



                value={name}



                onChange={(e) => setName(e.target.value)}



                className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"



                required



                disabled={loading}



              />



            </div>



          </motion.div>







          <motion.div



            initial={{ x: -50, opacity: 0 }}



            animate={{ x: 0, opacity: 1 }}



            transition={{ delay: 0.4 }}



          >



            <label className="block text-gray-700 mb-2">Email</label>



            <div className="relative">



              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />



              <input



                type="email"



                value={email}



                onChange={(e) => setEmail(e.target.value)}



                className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"



                required



                disabled={loading}



              />



            </div>



          </motion.div>







          <motion.div



            initial={{ x: -50, opacity: 0 }}



            animate={{ x: 0, opacity: 1 }}



            transition={{ delay: 0.5 }}



          >



            <label className="block text-gray-700 mb-2">Password</label>



            <div className="relative">



              <FaLock className="absolute left-3 top-3 text-gray-400" />



              <input



                type="password"



                value={password}



                onChange={(e) => setPassword(e.target.value)}



                className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"



                required



                disabled={loading}



              />



            </div>



          </motion.div>







          <motion.button



            initial={{ y: 50, opacity: 0 }}



            animate={{ y: 0, opacity: 1 }}



            transition={{ delay: 0.6 }}



            whileHover={{ scale: 1.05 }}



            whileTap={{ scale: 0.95 }}



            type="submit"



            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"



            disabled={loading}



          >



            <FaUserPlus className={loading ? 'animate-spin' : ''} />



            <span>{loading ? 'Mendaftar...' : 'Register'}</span>



          </motion.button>



        </form>







        <motion.p



          initial={{ opacity: 0 }}



          animate={{ opacity: 1 }}



          transition={{ delay: 0.7 }}



          className="mt-4 text-center text-gray-600"



        >



          Sudah punya akun?{' '}



          <motion.button



            whileHover={{ scale: 1.1 }}



            whileTap={{ scale: 0.9 }}



            onClick={onSwitchToLogin}



            className="text-indigo-600 hover:underline font-medium"



            disabled={loading}



          >



            Login



          </motion.button>



        </motion.p>



      </motion.div>



    </div>



  );



} 






























