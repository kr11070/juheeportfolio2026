import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-green-100 selection:text-green-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
