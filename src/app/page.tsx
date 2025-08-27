"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import Toggle from "@/components/ui/toggle";

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
    <div className="flex justify-center min-h-screen items-center p-8 relative">
      <div className="grid grid-cols-10 w-full max-w-[50vw] aspect-square gap-2 lg:gap-3">
        {[...Array(GRID_SIZE ** 2)].map((_, idx) => {
          const row = Math.floor(idx / GRID_SIZE);
          const col = idx % GRID_SIZE;
          const isOrigin = (row === origin[0]) && (col === origin[1]);
          const delay = getDistance(row, col) * BASE_DELAY + Math.random() * NOISE_DELAY;

          return (
            <motion.div
              className="rounded-sm cursor-pointer overflow-hidden relative group"
              key={idx}
              style={{
                backgroundColor: getCellColor(idx, isOrigin)
              }}
              initial={{ opacity: isOrigin ? 1 : 0, scale: isOrigin ? 1 : 0.3 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: delay }}
              whileHover={{
                scale: 1.1,
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
                className="absolute inset-0 p-1"
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
                <img
                  src={getAvatarUrl(idx, 50)}
                  alt={`Avatar ${avatarSeeds[idx % avatarSeeds.length]}`}
                  className="w-full h-full object-contain rounded-sm transition-all duration-300 group-hover:scale-110"
                />
              </motion.div>

              {/* Overlay for origin cell */}
              {isOrigin && (
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hover Popup */}
      <AnimatePresence>
        {hoveredCell !== null && (
          <motion.div
            className="fixed pointer-events-none z-50 rounded-lg shadow-2xl border overflow-hidden"
            style={{
              left: mousePosition.x + 15,
              top: mousePosition.y - 100,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="w-80 h-70">
              <div className="relative h-48 flex items-center justify-center">
                <motion.img
                  src={getAvatarUrl(hoveredCell, 200)}
                  alt={`Avatar ${avatarSeeds[hoveredCell % avatarSeeds.length]}`}
                  className="h-48 w-48 object-contain"
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
              <div className="p-4 bg-background">
                <h3 className="text-lg font-semibold">
                  {avatarSeeds[hoveredCell % avatarSeeds.length]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is a randomly generated avatar using DiceBear API.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => window.location.reload()}>
          <RotateCcw />
          Reset
        </Button>
      </div>
    </div>
  );
}