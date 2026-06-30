import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../home/header';
import Footer from '../home/footer';
import { useRouteLoading } from '@/presentation/hooks/use-route-loading';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Layout: React.FC = () => {
  useRouteLoading('A carregar a página...');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main>
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
