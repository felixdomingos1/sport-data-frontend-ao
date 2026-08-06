import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../home/header';
import Footer from '../home/footer';
import { useRouteLoading } from '@/presentation/hooks/use-route-loading';
import { useTheme } from '../ui/theme-provider';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Layout: React.FC = () => {
  useRouteLoading('A carregar a página...');
  const { resolved } = useTheme();

  return (
    <div className={`min-h-screen ${resolved === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <Header />
      <main className="pt-16 lg:pt-[72px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
