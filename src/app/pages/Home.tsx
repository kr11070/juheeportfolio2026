import React from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { StatsSection } from '../components/StatsSection';
import { PortfolioSection } from '../components/PortfolioSection';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsSection />
      <PortfolioSection />
      <Footer />
    </>
  );
}
