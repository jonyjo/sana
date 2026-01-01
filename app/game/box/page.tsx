"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, Gift, Sparkles } from "lucide-react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";

export default function VaultGame() {
  const [status, setStatus] = useState<"idle" | "shuffling" | "opened">("idle");
  // Correctly typing the ref array for standard HTML Elements
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const startShuffle = () => {
    if (status !== "idle") return;
    setStatus("shuffling");

    const tl = gsap.timeline({
      onComplete: () => {
        setStatus("opened");
        // Use GSAP to animate the scale and opacity of the prize
        gsap.to(".reveal-content", { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "back.out(1.7)",
          delay: 0.2
        });
      },
    });

    // High-end 3D Shuffle Logic
    tl.to(cardsRef.current, {
      x: (i) => (i === 0 ? 100 : i === 2 ? -100 : 0),
      rotateY: 180,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.inOut",
    })
    .to(cardsRef.current, {
      x: 0,
      rotateY: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "elastic.out(1, 0.75)",
    });
  };

  return (
    <SmoothScroll>
      <main ref={containerRef} className="min-h-[100dvh] bg-[#020617] text-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
        
        {/* Nav */}
        <div className="w-full flex justify-start">
          <Link href="/" className="p-3 rounded-2xl bg-white/5 border border-white/10 active:scale-90 transition-transform">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
        </div>

        {/* Professional Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            The Vault
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em]">Precision Shuffle Protocol</p>
        </div>

        {/* 3D Game Area - Pure HTML/CSS for GSAP to target */}
        <div className="relative w-full max-w-sm flex items-center justify-center gap-3 [perspective:1000px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              onClick={startShuffle}
              className="w-24 h-36 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-2xl cursor-pointer relative overflow-hidden group [backface-visibility:hidden]"
            >
              {/* Prize Reveal (Pure GSAP targeted) */}
              {status === "opened" && i === 1 ? (
                <div className="reveal-content opacity-0 scale-50">
                  <Sparkles className="text-yellow-400 w-8 h-8 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                </div>
              ) : (
                <Gift className="text-slate-700 group-hover:text-slate-500 transition-colors" size={24} />
              )}
            </div>
          ))}
        </div>

        {/* Button Wrapper */}
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={startShuffle}
            disabled={status !== "idle"}
            className="w-full py-5 bg-white text-black rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all active:scale-95 disabled:opacity-20"
          >
            {status === "idle" ? "Initiate Shuffle" : status === "shuffling" ? "Analyzing..." : "Access Granted"}
          </button>
          <p className="text-center text-[9px] text-slate-600 uppercase tracking-widest">
            {status === "opened" ? "Golden Spark Detected" : "Selection Required"}
          </p>
        </div>
      </main>
    </SmoothScroll>
  );
}