import { useState } from 'react';
import { FaTrash, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { formatRupiah } from '../utils/formatCurrency';
import { motion } from 'framer-motion';
import { expenseCategories, incomeCategories } from '../utils/categories';

export default function TransactionList({ transactions, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getCategoryIcon = (type, categoryId) => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : '📋';
  };

  const getCategoryLabel = (type, categoryId) => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
    setSelectedType('all');
    setSelectedCategory('all');
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (dateRange.start && transaction.date < dateRange.start) {
      return false;
    }
    if (dateRange.end && transaction.date > dateRange.end) {
      return false;
    }

    // Filter by type
    if (selectedType !== 'all' && transaction.type !== selectedType) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== 'all' && transaction.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  return (
    <div className="bg-white/80 dark:bg-dark-card dark:text-dark-text backdrop-blur-sm rounded-xl shadow-lg p-6 h-[calc(100%-1rem)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-indigo-800">Riwayat Transaksi</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <FaFilter />
          <span>{showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}</span>
        </button>
      </div>

      {/* Filter Section */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-4"
      >
        <div className="space-y-4 p-4 bg-indigo-50 rounded-lg">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipe</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua</option>
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Semua Kategori</option>
                {selectedType === 'expense' 
                  ? expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))
                  : incomeCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.label}
                      </option>
                    ))
                }
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
            >
              <FaTimes />
              Reset Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <div className="space-y-4 h-[calc(100%-5rem)] overflow-y-auto custom-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">Belum ada transaksi</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-lg transform transition-all duration-200 hover:scale-102 hover:shadow-md ${
                transaction.type === 'expense' 
                  ? 'bg-red-50/80 dark:bg-dark-danger-light/10 hover:bg-red-100/80 dark:hover:bg-dark-danger-light/20' 
                  : 'bg-green-50/80 dark:bg-dark-success-light/10 hover:bg-green-100/80 dark:hover:bg-dark-success-light/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getCategoryIcon(transaction.type, transaction.category)}
                </div>
                <div>
                  <h3 className="font-medium">
                    {getCategoryLabel(transaction.type, transaction.category)}
                  </h3>
                  <p className="text-sm text-gray-600">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`font-medium ${
                  transaction.type === 'expense' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatRupiah(transaction.amount)}
                </span>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700 transform transition-transform hover:scale-110 p-2 rounded-full hover:bg-red-50"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}