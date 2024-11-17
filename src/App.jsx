import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import Register from './components/Register';
import Statistics from './components/Statistics';
import { motion } from 'framer-motion';
import { 
  getTransactions, 
  addTransaction as addTransactionToDb, 
  deleteTransaction as deleteTransactionFromDb
} from './services/transactionService';
import toast from 'react-hot-toast';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        console.log('Loading transactions for user:', user.uid);
        const data = await getTransactions(user.uid);
        
        if (isMounted) {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        if (isMounted) {
          toast.error('Gagal memuat transaksi: ' + error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Add new transaction
  const addTransaction = async (transactionData) => {
    try {
      if (!user) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      const newTransaction = await addTransactionToDb(user.uid, transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaksi berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error(error.message || 'Gagal menambahkan transaksi');
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await deleteTransactionFromDb(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaksi berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Gagal menghapus transaksi');
    }
  };

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return isLoginView ? (
      <Login onSwitchToRegister={() => setIsLoginView(false)} />
    ) : (
      <Register onSwitchToLogin={() => setIsLoginView(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg transition-colors duration-200">
      <div className="relative z-10">
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'backdrop-blur-md bg-white/90',
          }}
        />
        <Header />
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            {/* Left Column - 8 columns wide */}
            <div className="col-span-8 space-y-8">
              {/* Financial Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6"
              >
                <Dashboard transactions={transactions} />
              </motion.div>
              
              {/* Transaction Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
              >
                <TransactionForm onSubmit={addTransaction} />
              </motion.div>

              {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
              >
                <Statistics transactions={transactions} />
              </motion.div>
            </div>

            {/* Right Column - 4 columns wide */}
            <div className="col-span-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="sticky top-8 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
                >
                  <TransactionList 
                    transactions={transactions} 
                    onDelete={deleteTransaction} 
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {/* Financial Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <Dashboard transactions={transactions} />
            </motion.div>
            
            {/* Transaction Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <TransactionForm onSubmit={addTransaction} />
            </motion.div>

            {/* Transaction List */}
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
              >
                <TransactionList 
                  transactions={transactions} 
                  onDelete={deleteTransaction} 
                />
              </motion.div>
            )}

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl shadow-lg"
            >
              <Statistics transactions={transactions} />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default App;