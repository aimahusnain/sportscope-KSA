'use client'

import { motion } from 'framer-motion';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);

  // Wait until component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      <Head>
        <title>Coming Soon | Database of SportScope KSA</title>
        <meta name="description" content="Our new website is coming soon" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Modern shapes and gradients */}
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-indigo-300/20 via-purple-300/20 to-pink-300/20 blur-3xl dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30" />
        
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-blue-300/20 via-cyan-300/20 to-teal-300/20 blur-3xl dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-teal-900/30" />
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
      </div>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 z-10">
        {/* Centered content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Brand logo/icon */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-12"
          >
              <span className="text-black dark:text-white text-2xl font-bold">SportScope KSA</span>
          </motion.div>
          
          {/* Coming Soon text with beautiful typography */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-7xl md:text-9xl font-black tracking-tight mb-6"
          >
            <span className="inline-block relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Coming
              </span>
              <motion.span 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.2 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              />
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400">
              Soon
            </span>
          </motion.h1>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;