import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../ui/Toast';

export function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // "Smooth page transition: 200ms fade on route change"
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitonStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitonStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-textPrimary">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main 
          className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-opacity duration-200 ${
            transitionStage === 'fadeIn' ? 'opacity-100' : 'opacity-0'
          }`}
          onTransitionEnd={() => {
            if (transitionStage === 'fadeOut') {
              setDisplayLocation(location);
              setTransitonStage('fadeIn');
            }
          }}
        >
          {/* We only render the outlet matching the displayed location so it stays rendered during fade */}
          <Outlet />
        </main>
      </div>
      
      <ToastContainer />
    </div>
  );
}
