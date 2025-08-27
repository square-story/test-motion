"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react"

export default function Home() {
  const GRID_SIZE = 10;
  const BASE_DELAY = 0.5;
  const NOISE_DELAY = 0.05;
  const getRandomCoodinate = (): [number, number] => [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE)
  ]
  const [orgin, setOrgin] = useState<[number, number] | undefined>()
  useEffect(() => {
    setOrgin(getRandomCoodinate())
  }, [])
  if (!orgin) return null
  const getDistance = (row: number, col: number) => {
    return (
      Math.sqrt((row - orgin[0]) ** 2 + (col - orgin[1]) ** 2) / (10 * Math.sqrt(2))
    )
  }
  return (
    <div className="flex justify-center min-h-screen items-center p-8">
      <div className="grid grid-cols-10 w-full max-w-[50vw] aspect-square gap-2 lg:gap-3">
        {[...Array(GRID_SIZE ** 2)].map((_, idx) => {
          const row = Math.floor(idx / GRID_SIZE)
          const col = idx % GRID_SIZE
          const isOrgin = (row === orgin[0]) && (col === orgin[1])
          const delay = getDistance(row, col) * BASE_DELAY + Math.random() * NOISE_DELAY
          return (
            < motion.div
              className="bg-neutral-500 rounded-sm"
              key={idx}
              style={{ backgroundColor: isOrgin ? "orange" : "" }}
              initial={{ opacity: isOrgin ? 1 : 0, scale: isOrgin ? 1 : 0.3 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: delay }}
            />
          )
        })}
      </div>
    </div>
  );
}
