"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ImagePopup() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Fade in animation
    setIsAnimating(true);

    // Start fade out after 4.5 seconds (to complete fade by 5 seconds)
    const fadeOutTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 4500);

    // Completely hide after fade out completes
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Cleanup timers
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for fade out
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div 
        className={`relative bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4 transition-all duration-500 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          aria-label="Close popup"
        >
          ×
        </button>
        
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Welcome to ImmunoLab"
            width={400}
            height={400}
            priority
            className="rounded-lg"
          />
          
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to ImmunoLab!
            </h2>
            <p className="text-gray-600">
              Your trusted partner in immunological testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}