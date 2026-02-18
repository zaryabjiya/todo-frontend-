// frontend/src/components/ProgressCircle.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Zap } from 'lucide-react';

interface ProgressCircleProps {
  completed: number;
  total: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ completed, total }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevProgressRef = useRef<number>(0);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Circle dimensions
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Trigger confetti when reaching 100%
  useEffect(() => {
    if (percentage === 100 && prevProgressRef.current < 100) {
      // Launch confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#8B5CF6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Additional burst
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: colors,
          gravity: 0.8,
          scalar: 1.2,
        });
      }, 300);
    }

    prevProgressRef.current = percentage;
  }, [percentage]);

  const getMotivationalMessage = () => {
    if (percentage === 100) return { text: "Excellent! 🎉", subtext: "You crushed all tasks!", icon: Trophy };
    if (percentage >= 75) return { text: "Amazing!", subtext: "Almost there!", icon: Star };
    if (percentage >= 50) return { text: "Great progress!", subtext: "Keep it up!", icon: Zap };
    if (percentage >= 25) return { text: "Good start!", subtext: "You're doing great!", icon: Star };
    return { text: "Let's go!", subtext: "You got this!", icon: Zap };
  };

  const { text, subtext, icon: Icon } = getMotivationalMessage();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="relative flex flex-col items-center"
    >
      {/* Progress Circle */}
      <div className="relative">
        {/* Glow effect behind */}
        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
          percentage === 100
            ? 'bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 scale-110'
            : percentage >= 75
            ? 'bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 scale-105'
            : 'bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-cyan-400/10'
        }`} />

        <svg
          width={size}
          height={size}
          className="relative z-10 transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.div
            key={percentage}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="text-center"
          >
            <motion.span
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent"
              animate={percentage === 100 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {percentage}%
            </motion.span>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              {completed}/{total} tasks
            </div>
          </motion.div>
        </div>
      </div>

      {/* Motivational message */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className={`w-5 h-5 ${
            percentage === 100
              ? 'text-green-500'
              : percentage >= 75
              ? 'text-purple-500'
              : 'text-blue-500'
          }`} />
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {text}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtext}</p>
      </motion.div>

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
};

export default ProgressCircle;
