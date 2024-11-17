import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        toast.error("Terjadi kesalahan saat memuat data pengguna");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      // 1. Buat user dengan email dan password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // 2. Update profile dengan nama
      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      // 3. Set user state
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userData.name,
        photoURL: null
      });

      toast.success('Registrasi berhasil!');
      return userCredential.user;
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = 'Gagal melakukan registrasi';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password terlalu lemah';
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      toast.success('Login berhasil!');
    } catch (error) {
      toast.error('Email atau password salah!');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logout berhasil!');
    } catch (error) {
      toast.error('Gagal logout!');
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      await updateProfile(auth.currentUser, updates);
      setUser(prev => ({ ...prev, ...updates }));
      toast.success('Profil berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui profil!');
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      updateUserProfile,
      loading,
      authLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);







