"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, Heart, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeartbeatVault() {
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const heartRef = useRef(null);
  const containerRef = useRef(null);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (isUnlocked) return;
    
    // 1. Haptic Feedback
    if (navigator.vibrate) navigator.vibrate([15, 10, 15]);

    // 2. UI Progress
    setProgress((prev) => {
      const next = prev + 4; 
      if (next >= 100) {
        setIsUnlocked(true);
        return 100;
      }
      return next;
    });

    // 3. Visual Impact: Heart Pump & Screen Shake
    const tl = gsap.timeline();
    tl.to(heartRef.current, { scale: 1.5, duration: 0.05 })
      .to(heartRef.current, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.3)" });
    
    gsap.to(containerRef.current, {
      x: "random(-4, 4)",
      y: "random(-4, 4)",
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      clearProps: "x,y"
    });

    // 4. Spawn Floating "Love" Particles
    spawnFloatingHeart(e);
  };

  const spawnFloatingHeart = (e: any) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const p = document.createElement("div");
    p.innerHTML = "❤️";
    p.className = "absolute pointer-events-none text-xl z-50";
    p.style.left = clientX + "px";
    p.style.top = clientY + "px";
    document.body.appendChild(p);

    gsap.to(p, {
      y: -150,
      x: "random(-50, 50)",
      opacity: 0,
      scale: 2,
      duration: 1,
      onComplete: () => p.remove()
    });
  };

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050208] text-rose-50 flex flex-col items-center justify-center p-6 overflow-hidden">
      <Link href="/experience" className="absolute top-6 left-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md z-50"><ChevronLeft/></Link>

      {!isUnlocked ? (
        <div className="flex flex-col items-center space-y-16">
          <div className="relative w-56 h-56 flex items-center justify-center">
             {/* Glowing Aura */}
             <div className="absolute inset-0 bg-rose-600/20 blur-[60px] rounded-full animate-pulse" />
             
             <div 
               ref={heartRef}
               onClick={handleTap}
               className="w-28 h-28 bg-gradient-to-tr from-rose-600 to-fuchsia-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.5)] cursor-pointer active:scale-90 z-20 relative"
             >
               <Zap className="text-white fill-white" size={32} />
             </div>
             
             <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
               <circle cx="112" cy="112" r="100" fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="12" />
               <circle
                 cx="112" cy="112" r="100"
                 fill="none" stroke="url(#roseGradient)" strokeWidth="12"
                 strokeDasharray="628" 
                 strokeDashoffset={628 - (628 * progress) / 100}
                 strokeLinecap="round"
                 className="transition-all duration-300 ease-out"
               />
               <defs>
                 <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#f43f5e" />
                   <stop offset="100%" stopColor="#d946ef" />
                 </linearGradient>
               </defs>
             </svg>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">Power of Love</h2>
            <div className="flex items-center justify-center gap-2">
               <div className="h-1.5 w-40 bg-white/5 rounded-full overflow-hidden border border-white/10">
                 <div className="h-full bg-rose-500 shadow-[0_0_15px_#f43f5e]" style={{ width: `${progress}%` }} />
               </div>
               <span className="text-[10px] font-bold text-rose-400 w-8">{progress}%</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-rose-300/30">Tap faster to break the seal</p>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-8 animate-in zoom-in duration-700">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-30 animate-pulse" />
            <Sparkles className="text-amber-400 w-20 h-20 mx-auto" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white">SYSTEM CHARGED</h1>
          <p className="text-rose-200/60 max-w-xs text-sm leading-relaxed">
            "Your energy has unlocked the final midnight sequence. I can't wait to see you tonight."
          </p>
          <Link href="/experience" className="inline-block px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-rose-50 transition-colors">Return to Journey</Link>
        </div>
      )}
    </main>
  );
}