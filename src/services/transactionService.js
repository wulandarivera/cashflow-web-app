import { 

  collection, 

  addDoc, 

  getDocs, 

  deleteDoc, 

  doc, 

  query, 

  where,

  orderBy,

  serverTimestamp,

  limit

} from 'firebase/firestore';

import { db } from '../config/firebase';



// Menambah transaksi baru

export const addTransaction = async (userId, transaction) => {

  try {

    if (!userId || !transaction) {

      throw new Error('Data transaksi tidak lengkap');

    }



    const transactionData = {

      ...transaction,

      userId,

      amount: Number(transaction.amount),

      createdAt: serverTimestamp(),

      timestamp: new Date().toISOString()

    };



    const docRef = await addDoc(collection(db, 'transactions'), transactionData);



    return {

      id: docRef.id,

      ...transactionData,

      createdAt: new Date().toISOString()

    };

  } catch (error) {

    console.error("Error adding transaction:", error);

    throw new Error('Gagal menambahkan transaksi: ' + error.message);

  }

};



// Mengambil semua transaksi user

export const getTransactions = async (userId) => {

  try {

    if (!userId) {

      console.error('User ID is missing');

      return [];

    }



    console.log('Fetching transactions for user:', userId);



    const q = query(

      collection(db, 'transactions'),

      where('userId', '==', userId),

      orderBy('createdAt', 'desc'),

      limit(100)

    );



    const querySnapshot = await getDocs(q);

    const transactions = [];



    querySnapshot.forEach((doc) => {

      const data = doc.data();

      transactions.push({

        id: doc.id,

        ...data,

        createdAt: data.createdAt?.toDate?.() || new Date(),

        amount: Number(data.amount)

      });

    });



    console.log('Fetched transactions:', transactions);

    return transactions;

  } catch (error) {

    console.error("Error getting transactions:", error);

    if (error.code === 'failed-precondition') {

      throw new Error('Sedang mempersiapkan database, silakan coba lagi dalam beberapa saat');

    }

    throw new Error('Gagal memuat transaksi: ' + error.message);

  }

};



// Menghapus transaksi

export const deleteTransaction = async (transactionId) => {

  try {

    if (!transactionId) {

      throw new Error('Transaction ID is required');

    }

    await deleteDoc(doc(db, 'transactions', transactionId));

  } catch (error) {

    console.error("Error deleting transaction:", error);

    throw new Error('Gagal menghapus transaksi: ' + error.message);

  }

};



// Mengambil transaksi berdasarkan filter

export const getFilteredTransactions = async (userId, filters) => {

  try {

    if (!userId) {

      return [];

    }



    let conditions = [

      where('userId', '==', userId)

    ];



    if (filters.type !== 'all') {

      conditions.push(where('type', '==', filters.type));

    }



    const q = query(

      collection(db, 'transactions'),

      ...conditions,

      orderBy('createdAt', 'desc'),

      limit(100)

    );



    const querySnapshot = await getDocs(q);

    let transactions = querySnapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data(),

      amount: Number(doc.data().amount)

    }));



    if (filters.searchTerm) {

      const searchLower = filters.searchTerm.toLowerCase();

      transactions = transactions.filter(t => 

        t.category.toLowerCase().includes(searchLower) ||

        t.description.toLowerCase().includes(searchLower)

      );

    }



    if (filters.dateRange.start) {

      transactions = transactions.filter(t => t.date >= filters.dateRange.start);

    }



    if (filters.dateRange.end) {

      transactions = transactions.filter(t => t.date <= filters.dateRange.end);

    }



    return transactions;

  } catch (error) {

    console.error("Error filtering transactions:", error);

    throw new Error('Gagal memfilter transaksi: ' + error.message);

  }

};






