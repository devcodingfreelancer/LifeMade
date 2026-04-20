import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const images = [
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
    "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        {/* Heading Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Build Your <span className="text-purple-400">Future</span> <br />
          With Modern Web
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-gray-300 max-w-xl mx-auto text-lg"
        >
          Create powerful, scalable and beautiful web applications using
          React, Tailwind CSS and cutting-edge animations.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition duration-300">
            Get Started
          </button>

          <button className="px-6 py-3 border border-gray-500 text-white rounded-xl hover:bg-white hover:text-black transition duration-300">
            Learn More
          </button>
        </motion.div>
      </div>

      {/* Floating Image Animation */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-10 right-10 hidden md:block"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
          alt="floating"
          className="w-24 opacity-80"
        />
      </motion.div>

      {/* Mouse Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </div>
  );
}