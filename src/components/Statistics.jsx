import { useState, useEffect } from 'react';



import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';



import { Doughnut, Bar } from 'react-chartjs-2';



import { formatRupiah } from '../utils/formatCurrency';



import { expenseCategories, incomeCategories } from '../utils/categories';



import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';



import { id } from 'date-fns/locale';







ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);







export default function Statistics({ transactions }) {



  const [timeRange, setTimeRange] = useState('month');



  const [monthlyData, setMonthlyData] = useState({ labels: [], income: [], expenses: [] });







  useEffect(() => {



    calculateMonthlyData();



  }, [transactions, timeRange]);







  const calculateMonthlyData = () => {



    const now = new Date();



    let months;



    



    // Menentukan rentang bulan berdasarkan timeRange



    switch (timeRange) {



      case 'week':



        months = eachMonthOfInterval({



          start: subMonths(now, 2),



          end: now



        });



        break;



      case 'month':



        months = eachMonthOfInterval({



          start: subMonths(now, 5),



          end: now



        });



        break;



      case 'year':



        months = eachMonthOfInterval({



          start: subMonths(now, 11),



          end: now



        });



        break;



      default:



        months = eachMonthOfInterval({



          start: subMonths(now, 5),



          end: now



        });



    }







    const monthlyStats = months.map(month => {



      const start = startOfMonth(month);



      const end = endOfMonth(month);







      const monthTransactions = transactions.filter(t => {



        const transactionDate = new Date(t.date);



        return transactionDate >= start && transactionDate <= end;



      });







      const income = monthTransactions



        .filter(t => t.type === 'income')



        .reduce((sum, t) => sum + Number(t.amount), 0);







      const expenses = monthTransactions



        .filter(t => t.type === 'expense')



        .reduce((sum, t) => sum + Number(t.amount), 0);







      return {



        month: format(month, 'MMM', { locale: id }),



        income,



        expenses



      };



    });







    setMonthlyData({



      labels: monthlyStats.map(stat => stat.month),



      income: monthlyStats.map(stat => stat.income),



      expenses: monthlyStats.map(stat => stat.expenses)



    });



  };







  const getCategoryData = (type) => {



    const categories = type === 'expense' ? expenseCategories : incomeCategories;



    const filteredTransactions = transactions.filter(t => t.type === type);



    



    return categories.map(cat => ({



      category: cat.label,



      amount: filteredTransactions



        .filter(t => t.category === cat.id)



        .reduce((sum, t) => sum + Number(t.amount), 0)



    })).filter(cat => cat.amount > 0); // Hanya tampilkan kategori dengan nilai > 0



  };







  const expenseData = getCategoryData('expense');



  const incomeData = getCategoryData('income');







  const chartData = {



    labels: expenseData.map(d => d.category),



    datasets: [{



      data: expenseData.map(d => d.amount),



      backgroundColor: [



        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',



        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'



      ],



    }]



  };







  const barData = {



    labels: monthlyData.labels,



    datasets: [



      {



        label: 'Pemasukan',



        data: monthlyData.income,



        backgroundColor: 'rgba(75, 192, 192, 0.5)',



        borderColor: 'rgba(75, 192, 192, 1)',



        borderWidth: 1



      },



      {



        label: 'Pengeluaran',



        data: monthlyData.expenses,



        backgroundColor: 'rgba(255, 99, 132, 0.5)',



        borderColor: 'rgba(255, 99, 132, 1)',



        borderWidth: 1



      }



    ]



  };







  const chartOptions = {



    responsive: true,



    plugins: {



      legend: {



        position: 'bottom'



      },



      tooltip: {



        callbacks: {



          label: function(context) {



            let label = context.dataset.label || '';



            if (label) {



              label += ': ';



            }



            label += formatRupiah(context.raw);



            return label;



          }



        }



      }



    },



    scales: {



      y: {



        beginAtZero: true,



        ticks: {



          callback: function(value) {



            return formatRupiah(value);



          }



        }



      }



    }



  };







  return (



    <div className="bg-white/80 dark:bg-dark-card dark:text-dark-text backdrop-blur-sm rounded-xl shadow-lg p-6">



      <div className="flex justify-between items-center mb-6">



        <h2 className="text-xl font-semibold text-gray-800">Statistik Keuangan</h2>



        <select



          value={timeRange}



          onChange={(e) => setTimeRange(e.target.value)}



          className="p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"



        >



          <option value="week">3 Bulan Terakhir</option>



          <option value="month">6 Bulan Terakhir</option>



          <option value="year">1 Tahun Terakhir</option>



        </select>



      </div>







      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">



        <div>



          <h3 className="text-lg font-medium mb-4 text-gray-700">Pengeluaran per Kategori</h3>



          {expenseData.length > 0 ? (



            <Doughnut data={chartData} />



          ) : (



            <p className="text-center text-gray-500 py-10">Belum ada data pengeluaran</p>



          )}



        </div>



        <div>



          <h3 className="text-lg font-medium mb-4 text-gray-700">Trend Bulanan</h3>



          <Bar data={barData} options={chartOptions} />



        </div>



      </div>



    </div>



  );



} 


