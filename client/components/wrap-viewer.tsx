"use client";

import { useState, useEffect } from "react";
import { ParsedStatement } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  IntroSlide,
  SummarySlide,
  TopCategoriesSlide,
  SoulmatesSlide,
  TimeOfDaySlide,
  WeekdaySlide,
  WeekendVsWeekdaySlide,
  FinalSlide,
} from "./wrap-slides";

interface WrapViewerProps {
  data: ParsedStatement;
}

export function WrapViewer({ data }: WrapViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const slides = [
    { component: IntroSlide, key: "intro" },
    { component: SummarySlide, key: "summary" },
    { component: TopCategoriesSlide, key: "categories" },
    { component: SoulmatesSlide, key: "soulmates" },
    { component: TimeOfDaySlide, key: "time" },
    { component: WeekdaySlide, key: "weekday" },
    { component: WeekendVsWeekdaySlide, key: "weekend" },
    { component: FinalSlide, key: "final" },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection('forward');
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection('backward');
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 'forward' : 'backward');
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-black dark:to-green-950/20 overflow-hidden">
      {/* content */}
      <div 
        className={`w-full h-full transition-all duration-500 ${
          direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
        }`}
        key={currentSlide}
      >
        <CurrentSlideComponent data={data} />
      </div>

      {/* nav btns */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-white dark:bg-gray-900 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>

        {/* prog dots */}
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-8 h-3 bg-green-600'
                  : 'w-3 h-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-white dark:bg-gray-900 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </div>

      {/* counter */}
      <div className="absolute top-8 right-8 text-sm font-medium text-gray-500 dark:text-gray-400">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* keyboard nav hint */}
      <div className="absolute top-8 left-8 text-xs text-gray-400 dark:text-gray-600">
        Use ← → keys to navigate
      </div>
    </div>
  );
}
