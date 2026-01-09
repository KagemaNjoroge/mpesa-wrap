"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);

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

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setDirection('forward');
      setCurrentSlide(currentSlide + 1);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [currentSlide, slides.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0 && !isAnimating) {
      setIsAnimating(true);
      setDirection('backward');
      setCurrentSlide(currentSlide - 1);
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, [currentSlide, isAnimating]);

  const goToSlide = (index: number) => {
    if (index !== currentSlide && !isAnimating) {
      setIsAnimating(true);
      setDirection(index > currentSlide ? 'forward' : 'backward');
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // keyboard avigation
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
  }, [nextSlide, prevSlide]);

  // stacked poker effect
  const getCardStyle = (index: number) => {
    const diff = index - currentSlide;
    
    // cards to be viewed
    if (diff < 0) {
      return {
        transform: `translateX(-120%) rotateY(-25deg) rotateZ(-5deg) scale(0.85)`,
        opacity: 0,
        zIndex: index,
        pointerEvents: 'none' as const,
      };
    }
    
    // curr card (front)
    if (diff === 0) {
      return {
        transform: 'translateX(0) rotateY(0deg) rotateZ(0deg) scale(1)',
        opacity: 1,
        zIndex: 100,
        pointerEvents: 'auto' as const,
      };
    }
    
    // // show 4 cards in stack
    const stackOffset = Math.min(diff, 4); 
    return {
      transform: `translateX(${stackOffset * -12}px) translateY(${stackOffset * -8}px) rotateZ(${stackOffset * -2}deg) scale(${1 - stackOffset * 0.02})`,
      opacity: diff <= 4 ? 0.4 : 0,
      zIndex: 50 - diff,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-black dark:to-green-950/20 overflow-hidden flex flex-col">
      {/* top bar*/}
      <div className="flex-shrink-0 flex justify-between items-center px-4 py-3 sm:px-8 sm:py-4">
        <div className="text-xs text-gray-400 dark:text-gray-600">
          Use ← → keys to navigate
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* cards stack */}
      <div className="flex-1 perspective-container flex items-center justify-center px-4 sm:px-8 pb-4 min-h-0">
        <div className="relative w-full max-w-4xl h-full max-h-[calc(100dvh-160px)] sm:max-h-[calc(100dvh-180px)] card-stack">
          {slides.map((slide, index) => {
            const SlideComponent = slide.component;
            const style = getCardStyle(index);
            const isCurrent = index === currentSlide;
            const isVisible = index >= currentSlide && index <= currentSlide + 4;
            
            
            if (!isVisible && index < currentSlide) return null;
            if (index > currentSlide + 4) return null;
            
            return (
              <div
                key={slide.key}
                className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 card-shadow overflow-hidden"
                style={{
                  ...style,
                  transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
               
                {isCurrent && (
                  <>
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col items-center z-10">
                      <span className="text-green-600 font-bold text-sm sm:text-lg">{index + 1}</span>
                      <span className="text-green-600 text-lg sm:text-2xl">♣</span>
                    </div>
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex flex-col items-center rotate-180 z-10">
                      <span className="text-green-600 font-bold text-sm sm:text-lg">{index + 1}</span>
                      <span className="text-green-600 text-lg sm:text-2xl">♣</span>
                    </div>
                  </>
                )}
                
                {/* only render content for current slide */}
                {isCurrent && (
                  <div className="w-full h-full overflow-y-auto">
                    <SlideComponent data={data} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* nav bar - always visible */}
      <div className="flex-shrink-0 px-4 py-3 sm:py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center space-x-3 sm:space-x-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0 || isAnimating}
            className="p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 border border-gray-200 dark:border-gray-700"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
          </button>

          {/* dots */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-green-600'
                    : index < currentSlide
                    ? 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-400 dark:bg-green-700 hover:bg-green-500'
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                } rounded-full disabled:cursor-not-allowed`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1 || isAnimating}
            className="p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 border border-gray-200 dark:border-gray-700"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
