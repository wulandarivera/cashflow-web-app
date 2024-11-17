import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { RiMoneyDollarCircleFill, RiShoppingCart2Fill } from 'react-icons/ri';
import { expenseCategories, incomeCategories } from '../utils/categories';
import { useAuth } from '../context/AuthContext';

export default function TransactionForm({ onSubmit }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.amount || !formData.category) {
        toast.error('Mohon isi jumlah dan kategori');
        return;
      }

      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      await onSubmit(transactionData);

      // Reset form setelah berhasil
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Gagal menambahkan transaksi');
    }
  };

  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="bg-white/80 dark:bg-dark-card dark:text-dark-text backdrop-blur-sm rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Tambah Transaksi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData({...formData, type: 'expense', category: ''})}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.type === 'expense'
                ? 'bg-red-50 border-red-500 text-red-600'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-300'
            }`}
          >
            <RiShoppingCart2Fill className={`text-xl mr-2 ${
              formData.type === 'expense' 
                ? 'animate-bounce'
                : ''
            }`} />
            <span className="font-medium">Pengeluaran</span>
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({...formData, type: 'income', category: ''})}
            className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.type === 'income'
                ? 'bg-green-50 border-green-500 text-green-600'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-300'
            }`}
          >
            <RiMoneyDollarCircleFill className={`text-xl mr-2 ${
              formData.type === 'income' 
                ? 'animate-bounce'
                : ''
            }`} />
            <span className="font-medium">Pemasukan</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text ${
              formData.type === 'expense' 
                ? 'border-red-200 focus:border-red-500 focus:ring-red-500 dark:focus:border-dark-danger-light dark:focus:ring-dark-danger-light'
                : 'border-green-200 focus:border-green-500 focus:ring-green-500 dark:focus:border-dark-success-light dark:focus:ring-dark-success-light'
            }`}
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori</label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 ${
                formData.type === 'expense'
                  ? 'border-red-200 focus:border-red-500 focus:ring-red-500'
                  : 'border-green-200 focus:border-green-500 focus:ring-green-500'
              } appearance-none custom-select`}
              required
              style={{
                height: 'auto',
                maxHeight: '200px' // Tinggi maksimal dropdown
              }}
            >
              <option value="" className="py-2">Pilih Kategori</option>
              {categories.map(cat => (
                <option 
                  key={cat.id} 
                  value={cat.id}
                  className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                >
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <input
            type="text"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 ${
              formData.type === 'expense'
                ? 'border-red-200 focus:border-red-500 focus:ring-red-500'
                : 'border-green-200 focus:border-green-500 focus:ring-green-500'
            }`}
            placeholder="Deskripsi opsional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tanggal</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData({...formData, date: e.target.value})}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-opacity-50 ${
              formData.type === 'expense'
                ? 'border-red-200 focus:border-red-500 focus:ring-red-500'
                : 'border-green-200 focus:border-green-500 focus:ring-green-500'
            }`}
          />
        </div>

        <button
          type="submit"
          className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
            formData.type === 'expense'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
          }`}
        >
          <FaPlus className="mr-2" />
          Tambah Transaksi
        </button>
      </form>
    </div>
  );
}