import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, LogOut, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(lang === 'KR' ? '로그아웃되었습니다.' : 'Logged out.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.portfolio'), href: '/#portfolio' },
    { name: t('nav.about'), href: '/#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter"
          >
            {lang === 'KR' ? '이주희' : 'Juhee Lee'}
          </motion.div>
        </Link>
        
        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block" />

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-900 leading-none">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {user.email === 'leejuhee010340@gmail.com' ? 'Admin' : 'Member'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{lang === 'KR' ? '로그인' : 'Login'}</span>
              </Link>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Language Toggle */}
          <div className="flex items-center p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setLang('KR')}
              className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                lang === 'KR' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              KR
            </button>
            <button
              onClick={() => setLang('EN')}
              className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                lang === 'EN' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('JP')}
              className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                lang === 'JP' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              JP
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
