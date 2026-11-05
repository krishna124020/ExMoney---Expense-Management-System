import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import './layout.css';

export const AppShell = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        <Navbar onMenuClick={toggleSidebar} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
