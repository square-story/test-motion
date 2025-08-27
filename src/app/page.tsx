"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import GithubButtonContainer from "@/components/github-button/default";

export default function Home() {
  const GRID_SIZE = 10;
  const BASE_DELAY = 0.5;
  const NOISE_DELAY = 0.05;

  // Generate unique avatar seeds for variety
  const avatarSeeds = [
    "Felix", "Emma", "Alex", "Sarah", "Mike", "Luna", "Jack", "Zoe", "Sam", "Maya",
    "Leo", "Aria", "Max", "Ivy", "Ben", "Nova", "Kai", "Ruby", "Eli", "Sage",
    "Rio", "Wren", "Ace", "Faye", "Jax", "Iris", "Rex", "Cleo", "Zep", "Vale",
    "Fox", "Rose", "Neo", "Jade", "Axe", "Skye", "Rio", "Dawn", "Ash", "Star",
    "Ray", "Hope", "Jay", "Blue", "Zed", "Moon", "Oak", "Joy", "Fox", "Glow"
  ];

  // Available DiceBear styles for variety
  const avatarStyles = [
    "notionists"
  ];

  const getRandomCoordinate = (): [number, number] => [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE)
  ];

  const [origin, setOrigin] = useState<[number, number] | undefined>();
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setOrigin(getRandomCoordinate());
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  if (!origin) return null;

  const getDistance = (row: number, col: number) => {
    return (
      Math.sqrt((row - origin[0]) ** 2 + (col - origin[1]) ** 2) / (10 * Math.sqrt(2))
    );
  };

  const getAvatarUrl = (idx: number, size: number = 100) => {
    const seed = avatarSeeds[idx % avatarSeeds.length];
    const style = avatarStyles[Math.floor(idx / avatarSeeds.length) % avatarStyles.length];
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&size=${size}`;
  };

  const getCellColor = (idx: number, isOrigin: boolean) => {
    if (isOrigin) return "orange";

    // Different colors based on position for variety
    const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      <div className="absolute top-2 right-2 z-10 sm:top-4 sm:right-4">
        <GithubButtonContainer repoUrl="https://github.com/square-story/test-motion" />
      </div>
      <div className="absolute top-15 right-2 z-10 sm:top-15 sm:right-4">
        <Button>
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Reset Origin
        </Button>
      </div>

      {/* Main Grid Container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center">
          {/* Responsive Grid Wrapper */}
          <div
            className="grid grid-cols-10 gap-0.5 sm:gap-1 md:gap-2 lg:gap-3"
            style={{
              width: 'min(95vw, 95vh, 800px)',
              height: 'min(95vw, 95vh, 800px)',
              aspectRatio: '1 / 1'
            }}
          >
            {[...Array(GRID_SIZE ** 2)].map((_, idx) => {
              const row = Math.floor(idx / GRID_SIZE);
              const col = idx % GRID_SIZE;
              const isOrigin = (row === origin[0]) && (col === origin[1]);
              const delay = getDistance(row, col) * BASE_DELAY + Math.random() * NOISE_DELAY;

              return (
                <motion.div
                  className="rounded-sm cursor-pointer overflow-hidden relative group w-full h-full"
                  key={idx}
                  style={{
                    backgroundColor: getCellColor(idx, isOrigin),
                    aspectRatio: '1 / 1'
                  }}
                  initial={{ opacity: isOrigin ? 1 : 0, scale: isOrigin ? 1 : 0.3 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: delay }}
                  whileHover={{
                    scale: 1.05,
                    opacity: 1,
                    transition: { duration: 0.2 }
                  }}
                  onMouseEnter={(e) => {
                    setHoveredCell(idx);
                    handleMouseMove(e);
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  onMouseMove={handleMouseMove}
                >
                  {/* Avatar image with animation */}
                  <motion.div
                    className="absolute inset-0 p-0.5 sm:p-1"
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: isOrigin ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isOrigin ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <Image
                      src={getAvatarUrl(idx, 10)}
                      alt={`Avatar ${avatarSeeds[idx % avatarSeeds.length]}`}
                      className="w-full h-full object-contain rounded-sm transition-all duration-300 group-hover:scale-110"
                      width={10}
                      height={10}
                    />
                  </motion.div>

                  {/* Overlay for origin cell */}
                  {isOrigin && (
                    <motion.div
                      className="absolute inset-0 border border-yellow-400 sm:border-2 rounded-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hover Popup - Only show on larger screens */}
      <AnimatePresence>
        {hoveredCell !== null && (
          <motion.div
            className="fixed pointer-events-none z-50 rounded-lg shadow-2xl border overflow-hidden hidden sm:block"
            style={{
              left: Math.min(mousePosition.x + 15, window.innerWidth - 320),
              top: Math.max(mousePosition.y - 100, 10),
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-80 bg-white dark:bg-gray-800">
              <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                <motion.img
                  src={getAvatarUrl(hoveredCell, 200)}
                  alt={`Avatar ${avatarSeeds[hoveredCell % avatarSeeds.length]}`}
                  className="h-32 w-32 sm:h-40 sm:w-40 object-contain"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {avatarSeeds[hoveredCell % avatarSeeds.length]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This is a randomly generated avatar using DiceBear API.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}