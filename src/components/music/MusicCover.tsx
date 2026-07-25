"use client";

import { motion } from "framer-motion";

type Props = {
  cover: string;
  title: string;
  playing: boolean;
};

export default function MusicCover({
  cover,
  title,
  playing,
}: Props) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-28 w-28 rounded-full bg-pink-300/30 blur-2xl" />

      <motion.img
        src={cover}
        alt={title}
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={
          playing
            ? { duration: 8, repeat: Infinity, ease: "linear" }
            : { duration: 0.3 }
        }
        className="music-cover relative z-10 h-24 w-24 rounded-full object-cover"
      />

      <div className="absolute z-20 h-4 w-4 rounded-full bg-white shadow" />
    </div>
  );
}