import React, { useEffect, useState } from 'react'
// import '@/styles/SplashScreen.css'
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselText {
  id: number;
  title: string;
  description: string;
}

const carouselTexts: CarouselText[] = [
  {
    id: 1,
    title: "Welcome to Our Platform",
    description: "Discover amazing possibilities with our innovative solutions"
  },
  {
    id: 2,
    title: "Build Better Together",
    description: "Join our community of creative minds and passionate builders"
  },
  {
    id: 3,
    title: "Achieve Your Goals",
    description: "Let us help you reach new heights in your journey"
  }
];


const SplashScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: {
      y: 20,
      opacity: 0
    },
    center: {
      y: 0,
      opacity: 1
    },
    exit: {
      y: -20,
      opacity: 0
    }
  };

  const transition = {
    y: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };


  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/SplashBg.png')",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <div className="relative h-full flex items-center justify-center">
        <div className="w-full max-w-4xl px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="text-center"
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {carouselTexts[currentIndex].title}
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {carouselTexts[currentIndex].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
