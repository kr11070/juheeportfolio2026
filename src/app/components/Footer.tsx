import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex items-center gap-4 group">
        <div className="w-12 h-[2px] bg-gray-900 group-hover:bg-green-600 transition-colors"></div>
        <span className="text-xl font-black text-gray-900 tracking-tighter group-hover:text-green-600 transition-colors">
          {lang === 'KR' ? '이주희' : 'Juhee Lee'}
        </span>
      </div>
      
      <motion.a
        href="mailto:jenny08138@naver.com"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-10 py-5 bg-white border-2 border-gray-900 rounded-[24px] text-lg font-black text-gray-900 hover:bg-green-600 hover:border-green-600 hover:text-white transition-all duration-300 shadow-xl shadow-gray-200/50 hover:shadow-green-100/50 inline-block text-center"
      >
        {t('footer.contact')}
      </motion.a>
    </footer>
  );
}
