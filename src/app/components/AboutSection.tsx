import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center">
      <motion.p 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-semibold leading-[1.2] text-gray-800 tracking-tight"
        dangerouslySetInnerHTML={{ __html: t('about.text') }}
      />
    </section>
  );
}
