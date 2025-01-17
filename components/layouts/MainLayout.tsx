'use client';

import React from 'react';
import Navbar from './includes/Navbar';
import SideNav from './includes/SideNav';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { shouldUseMainLayout } from '@/utils/path-utils';
import ProfileCompletionManager from '../ProfileCompletionManager';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const useMainLayout = shouldUseMainLayout(pathname || '');

  if (!useMainLayout) {
    return <div>{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 pb-14 overflow-hidden">
        <aside className="fixed left-0 top-0 h-full z-50">
          <SideNav />
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-30">
            <Navbar />

          </header>
          <main className="relative h-full mt-16 overflow-y-auto">
            <div className="p-6">
              <ProfileCompletionManager />
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}