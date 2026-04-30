import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';

export function Hero() {
  const { t } = useLanguage();
  const heroImg = "https://images.unsplash.com/photo-1458061453415-5a6c94dcc174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd29ya3NwYWNlJTIwZ3JlZW4lMjBwbGFudCUyMGRlc2lnbiUyMHBvcnRmb2xpbyUyMGRlc2lnbmVyJTIwZGVzayUyMGFwcGxlJTIwc3R1ZGlvJTIwZGlzcGxheXxlbnwxfHx8fDE3NzYxNTU4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full aspect-[21/9] rounded-[48px] overflow-hidden mb-16 shadow-2xl shadow-green-100/50"
      >
        <div className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            heroImg,
            "https://images.unsplash.com/photo-1641057350568-babe1e84aedf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzaWduZXIlMjB3b3Jrc3BhY2UlMjBncmVlbnxlbnwxfHx8fDE3NzYxNTY3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            "https://images.unsplash.com/photo-1707386320247-0bd3e8e8ea6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcHBsZSUyMHN0dWRpbyUyMGRpc3BsYXklMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzc2MTU2NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            "https://images.unsplash.com/photo-1760720962321-f03e04a03b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBkZXNrJTIwc2V0dXAlMjBncmVlbiUyMHBsYW50fGVufDF8fHx8MTc3NjE1NjcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            "https://images.unsplash.com/photo-1742440710226-450e3b85c100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMGludGVyaW9yfGVufDF8fHx8MTc3NjE1NjcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            "https://images.unsplash.com/photo-1576153192286-defd01e1e4b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1eCUyMHVpJTIwZGVzaWduJTIwcHJvY2VzcyUyMHNrZXRjaCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzYxNTY3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          ].map((src, index) => (
            <div key={index} className="flex-none w-full h-full snap-center">
              <ImageWithFallback 
                src={src} 
                alt={`Designer Workspace ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-black tracking-tighter text-gray-900 text-[96px]"
        >
          {t('hero.name')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl font-medium tracking-tight text-green-600 uppercase"
        >
          {t('hero.title')}
        </motion.p>
      </div>
    </section>
  );
}
