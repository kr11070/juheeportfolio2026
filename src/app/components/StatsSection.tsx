import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function StatsSection() {
  const { t } = useLanguage();
  const stats = [
    { label: t('stats.exp'), value: '1+', delay: 0 },
    { label: t('stats.projects'), value: '3+', delay: 0.1 },
    { label: t('stats.skills'), value: '5', delay: 0.2 },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-gray-100 flex flex-col md:flex-row gap-12 items-start">
      <div className="w-1/4">
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{t('stats.title')}</h3>
      </div>
      
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-12 w-full">
        {stats.map((stat) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: stat.delay }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="h-[2px] w-full bg-gray-900 mb-8 transition-all group-hover:bg-green-600 group-hover:w-full"></div>
            <div className="text-6xl font-black text-gray-900 mb-4 transition-colors group-hover:text-green-600">
              {stat.value}
            </div>
            <div className="text-lg font-medium text-gray-400 group-hover:text-gray-900">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
