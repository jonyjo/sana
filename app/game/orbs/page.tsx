"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function UmmaRainGame() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getTarget = () => (level === 1 ? 10 : level === 2 ? 20 : 30);
  const getSpeed = () => (level === 1 ? 4 : level === 2 ? 2.5 : 1.8);

  const spawnKiss = () => {
    if (isGameFinished || !containerRef.current) return;

    const kiss = document.createElement("div");
    const isSpecial = level === 3 && Math.random() > 0.7;
    kiss.innerHTML = isSpecial ? "UMMA! 💋" : "💋";
    kiss.className = `absolute ${isSpecial ? 'text-xl font-bold' : 'text-3xl'} cursor-pointer select-none z-20 touch-none whitespace-nowrap`;
    kiss.style.left = Math.random() * 80 + 10 + "%";
    kiss.style.top = "100%";
    containerRef.current.appendChild(kiss);

    gsap.to(kiss, {
      y: -window.innerHeight - 100,
      x: `random(-100, 100)`,
      duration: getSpeed(),
      ease: "linear",
      onComplete: () => kiss.remove()
    });

    kiss.onclick = () => {
      if (navigator.vibrate) navigator.vibrate(15);
      setScore(prev => {
        const next = prev + 1;
        if (next >= getTarget()) {
          if (level < 3) {
             setLevel(l => l + 1);
             setScore(0);
             triggerLevelUp();
          } else {
             setIsGameFinished(true);
          }
        }
        return next;
      });
      gsap.to(kiss, { scale: 3, opacity: 0, duration: 0.2, onComplete: () => kiss.remove() });
    };
  };

  const triggerLevelUp = () => {
    gsap.fromTo(".level-up-toast", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", onComplete: () => {
        gsap.to(".level-up-toast", { opacity: 0, delay: 1 });
    }});
  };

  useEffect(() => {
    const interval = setInterval(spawnKiss, level === 3 ? 300 : 600);
    return () => clearInterval(interval);
  }, [level, isGameFinished]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0510] text-rose-50 overflow-hidden flex flex-col relative">
      <header className="p-6 flex justify-between items-center relative z-40">
        <Link href="/experience" className="p-3 rounded-2xl bg-white/5 border border-white/10"><ChevronLeft/></Link>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">Level {level}</p>
          <div className="h-1 w-24 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-rose-500 transition-all duration-300" 
              style={{ width: `${(score / getTarget()) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="level-up-toast absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 z-50 text-center">
        <h2 className="text-5xl font-black italic text-rose-500 italic tracking-tighter">LEVEL UP!</h2>
        <p className="text-xs text-rose-300 mt-2 uppercase tracking-widest">Speeding up for you...</p>
      </div>

      {isGameFinished && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
          <Heart fill="#f43f5e" size={60} className="text-rose-500 animate-bounce mb-6" />
          <h2 className="text-4xl font-black italic tracking-tighter mb-4">Master Kiss-Catcher!</h2>
          <p className="text-rose-200/60 text-sm italic">You caught over 60 kisses. Your reward is waiting for you in real life...</p>
          <Link href="/experience" className="mt-10 px-10 py-5 bg-rose-600 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl">Back to Chapters</Link>
        </div>
      )}

      {!isGameFinished && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-20 select-none">
          <p className="text-[10px] uppercase tracking-[0.8em]">Level {level}</p>
          <h3 className="text-lg font-light mt-2 italic">Catch {getTarget() - score} more...</h3>
        </div>
      )}
    </div>
  );
}