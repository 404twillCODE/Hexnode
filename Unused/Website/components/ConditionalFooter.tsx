'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  
  // Hide footer on dashboard pages (it's rendered inside dashboard layout)
  if (isDashboard) {
    return null;
  }
  
  return <Footer />;
}


