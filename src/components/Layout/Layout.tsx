import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default Layout;