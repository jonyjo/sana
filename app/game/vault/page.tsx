"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, Heart, Zap, Sparkles, Stars, Gift } from "lucide-react";
import Link from "next/link";

export default function HeartbeatVault() {
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const heartRef = useRef(null);
  const containerRef = useRef(null);
  const [multiplier, setMultiplier] = useState(1);

  // Increase power as they tap faster
  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isUnlocked) return;

    if (navigator.vibrate) navigator.vibrate([20]);

    setProgress((prev) => {
      const next = prev + (3 * multiplier);
      if (next >= 100) {
        setIsUnlocked(true);
        triggerFinalConfetti();
        return 100;
      }
      return next;
    });

    // Visual Feedback: Scaling & Rotation
    gsap.to(heartRef.current, {
      scale: 1.4,
      rotate: "random(-15, 15)",
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });

    // Shake the whole vault
    gsap.to(containerRef.current, {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      duration: 0.05,
      repeat: 1,
      clearProps: "all"
    });

    spawnFloatingElement(e);
  };

  const spawnFloatingElement = (e: any) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const elements = ["❤️", "✨", "💖", "🎂", "🌸"];
    const el = document.createElement("div");
    el.innerHTML = elements[Math.floor(Math.random() * elements.length)];
    el.className = "absolute pointer-events-none text-2xl z-50 select-none";
    el.style.left = clientX + "px";
    el.style.top = clientY + "px";
    document.body.appendChild(el);

    gsap.to(el, {
      y: -200 - Math.random() * 100,
      x: "random(-100, 100)",
      rotation: "random(-45, 45)",
      opacity: 0,
      scale: 3,
      duration: 1.5,
      ease: "power1.out",
      onComplete: () => el.remove()
    });
  };

  const triggerFinalConfetti = () => {
    // Optional: Add a library like canvas-confetti here for extra flair
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050208] text-rose-50 flex flex-col items-center justify-center p-6 overflow-hidden selection:bg-rose-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-900/10 blur-[120px] rounded-full" />
      </div>

      <Link href="/experience" className="absolute top-6 left-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md z-50 hover:bg-white/10 transition-all">
        <ChevronLeft className="w-5 h-5 text-rose-200" />
      </Link>

      {!isUnlocked ? (
        <div className="flex flex-col items-center space-y-12 z-10">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            <div className="absolute inset-0 border border-rose-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
            <div className="absolute inset-4 border border-rose-500/10 rounded-full animate-[ping_2s_linear_infinite]" />
            
            <div 
              ref={heartRef}
              onClick={handleTap}
              className="w-32 h-32 bg-gradient-to-br from-rose-500 via-rose-600 to-fuchsia-700 rounded-full flex items-center justify-center shadow-[0_0_70px_rgba(225,29,72,0.4)] cursor-pointer active:scale-95 transition-transform duration-75 relative group"
            >
              <Heart className="text-white fill-white group-hover:scale-110 transition-transform" size={40} />
              
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:opacity-100 transition-opacity" />
            </div>
            
            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
              <circle cx="128" cy="128" r="115" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
              <circle
                cx="128" cy="128" r="115"
                fill="none" stroke="url(#roseGradient)" strokeWidth="8"
                strokeDasharray="722" 
                strokeDashoffset={722 - (722 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#c026d3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">
                Unlock <span className="text-rose-500">My Heart</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-rose-300/50 font-medium">Your touch powers the engine</p>
            </div>

            <div className="flex flex-col items-center gap-3">
               <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
                 <div 
                   className="h-full bg-gradient-to-r from-rose-600 to-fuchsia-500 shadow-[0_0_20px_#f43f5e]" 
                   style={{ width: `${progress}%`, transition: 'width 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67)' }} 
                 />
               </div>
               <span className="text-xs font-mono font-bold text-rose-400">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-10 animate-in zoom-in fade-in duration-1000 max-w-sm px-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-rose-500 blur-[80px] opacity-40 animate-pulse" />
            <div className="relative flex space-x-2 justify-center">
                <Sparkles className="text-amber-300 w-12 h-12" />
                <Gift className="text-rose-400 w-12 h-12" />
                <Stars className="text-fuchsia-400 w-12 h-12" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black italic tracking-tighter text-white leading-none">
              HAPPY <br/> BIRTHDAY
            </h1>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50" />
            <p className="text-rose-100/80 text-lg font-medium leading-relaxed italic">
              "To the person who turns my world into a masterpiece. Today isn't just a date; it's a celebration of the light you bring into my life."
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
            <p className="text-rose-300 text-xs uppercase tracking-widest mb-2 font-bold">Midnight Access Granted</p>
            <p className="text-white/60 text-sm italic">You’ve unlocked the full sequence. Meet me where the stars touch the ocean.</p>
          </div>

          <Link 
            href="/experience" 
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-black transition-all duration-200 bg-white font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <span className="text-[10px] uppercase tracking-widest">Enter the Journey</span>
          </Link>
        </div>
      )}
    </main>
  );
}