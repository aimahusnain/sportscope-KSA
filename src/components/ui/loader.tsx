"use client";
import React from "react";

export const LoaderOne = () => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300 animate-bounce"
        style={{ animationDelay: '0ms', animationDuration: '1000ms' }}
      />
      <div 
        className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300 animate-bounce"
        style={{ animationDelay: '200ms', animationDuration: '1000ms' }}
      />
      <div 
        className="h-4 w-4 rounded-full border border-neutral-300 bg-gradient-to-b from-neutral-400 to-neutral-300 animate-bounce"
        style={{ animationDelay: '400ms', animationDuration: '1000ms' }}
      />
    </div>
  );
};

export const LoaderTwo = () => {
  return (
    <div className="flex items-center">
      <div
        className="h-4 w-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500 loader-slide"
        style={{ animationDelay: '0ms' }}
      />
      <div
        className="h-4 w-4 -translate-x-2 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500 loader-slide"
        style={{ animationDelay: '800ms' }}
      />
      <div
        className="h-4 w-4 -translate-x-4 rounded-full bg-neutral-200 shadow-md dark:bg-neutral-500 loader-slide"
        style={{ animationDelay: '1600ms' }}
      />
      <style jsx>{`
        .loader-slide {
          animation: slide 2s ease-in-out infinite;
        }
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
};

export const LoaderThree = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-20 w-20 stroke-neutral-500 dark:stroke-neutral-100"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"
        className="animate-lightning"
        fill="var(--color-neutral-50) dark:var(--color-neutral-800)"
      />
      <style jsx>{`
        .animate-lightning {
          animation: lightning 2s ease-in-out infinite alternate;
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
        }
        @keyframes lightning {
          0% {
            stroke-dashoffset: 50;
            fill: var(--color-neutral-50);
          }
          100% {
            stroke-dashoffset: 0;
            fill: var(--color-yellow-300);
          }
        }
        @media (prefers-color-scheme: dark) {
          @keyframes lightning {
            0% {
              stroke-dashoffset: 50;
              fill: var(--color-neutral-800);
            }
            100% {
              stroke-dashoffset: 0;
              fill: var(--color-yellow-500);
            }
          }
        }
      `}</style>
    </svg>
  );
};

export const LoaderFour = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="relative font-bold text-black dark:text-white">
      <span className="relative z-20 inline-block animate-glitch">
        {text}
      </span>
      <span className="absolute inset-0 text-[#00e571]/50 blur-[0.5px] dark:text-[#00e571] animate-glitch-1">
        {text}
      </span>
      <span className="absolute inset-0 text-[#8b00ff]/50 dark:text-[#8b00ff] animate-glitch-2">
        {text}
      </span>
      <style jsx>{`
        .animate-glitch {
          animation: glitch 0.05s linear infinite alternate;
          animation-play-state: paused;
          animation-delay: 2s;
        }
        .animate-glitch-1 {
          animation: glitch-1 0.5s linear infinite alternate;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.8s linear infinite alternate;
        }
        @keyframes glitch {
          0% { transform: skew(0deg) scaleX(1); }
          20% { transform: skew(-40deg) scaleX(2); }
          40% { transform: skew(0deg) scaleX(1); }
          60% { transform: skew(-40deg) scaleX(2); }
          80% { transform: skew(0deg) scaleX(1); }
          100% { transform: skew(0deg) scaleX(1); }
        }
        @keyframes glitch-1 {
          0% { transform: translate(-2px, -2px); opacity: 0.3; }
          20% { transform: translate(4px, 4px); opacity: 0.9; }
          40% { transform: translate(-3px, -3px); opacity: 0.4; }
          60% { transform: translate(1.5px, 1.5px); opacity: 0.8; }
          80% { transform: translate(-2px, -2px); opacity: 0.3; }
          100% { transform: translate(-2px, -2px); opacity: 0.3; }
        }
        @keyframes glitch-2 {
          0% { transform: translate(0px, 0px); opacity: 0.4; }
          30% { transform: translate(1px, -1px); opacity: 0.8; }
          60% { transform: translate(-1.5px, 1.5px); opacity: 0.3; }
          80% { transform: translate(1.5px, -0.5px); opacity: 0.9; }
          100% { transform: translate(-1px, 0px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export const LoaderFive = ({ text }: { text: string }) => {
  return (
    <div className="font-sans font-bold text-neutral-700 dark:text-neutral-200">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-wave"
          style={{ 
            animationDelay: `${i * 50}ms`,
            animationIterationCount: 'infinite'
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <style jsx>{`
        .animate-wave {
          animation: wave 0.5s ease-in-out infinite;
          animation-fill-mode: both;
        }
        @keyframes wave {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.5;
            text-shadow: 0 0 0 var(--color-neutral-500);
          }
          50% { 
            transform: scale(1.1); 
            opacity: 1;
            text-shadow: 0 0 1px var(--color-neutral-500);
          }
        }
      `}</style>
    </div>
  );
};