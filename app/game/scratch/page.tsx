"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles, Heart, ArrowRight, Stars, Gift } from "lucide-react";
import gsap from "gsap";
import confetti from "canvas-confetti";

const DECK = [
  {
    title: "Starlight Secret",
    message: "You are the star that never stops shining in my sky.",
    colors: ["#fb7185", "#4c0519"], // Rose
    icon: <Stars className="text-rose-400" size={40} />
  },
  {
    title: "Golden Promise",
    message: "Every day with you is a gift I never want to stop opening.",
    colors: ["#f59e0b", "#78350f"], // Gold
    icon: <Gift className="text-amber-400" size={40} />
  },
  {
    title: "Forever Bond",
    message: "Happy Birthday, Umma! My heart is yours, today and always.",
    colors: ["#8b5cf6", "#2e1065"], // Purple
    icon: <Heart fill="#a78bfa" className="text-purple-400" size={40} />
  }
];

export default function MultiScratchGame() {
  const [cardIndex, setCardIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const checkpoints = useRef<{x: number, y: number, hit: boolean}[]>([]);

  // Card is 320px, but Canvas is 450px to allow "Overflow Scratching"
  const CANVAS_SIZE = 450;
  const CARD_SIZE = 320;

  useEffect(() => {
    initCanvas();
  }, [cardIndex]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRevealed(false);
    setProgress(0);
    gsap.set(canvas, { opacity: 1, scale: 1, filter: "blur(0px)" });

    // Initialize checkpoints in a grid that covers the CARD area
    const points = [];
    const offset = (CANVAS_SIZE - CARD_SIZE) / 2;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        points.push({ 
          x: offset + (i * (CARD_SIZE/10)) + 15, 
          y: offset + (j * (CARD_SIZE/10)) + 15, 
          hit: false 
        });
      }
    }
    checkpoints.current = points;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    // Draw the scratch surface only over the card area
    const current = DECK[cardIndex];
    const grad = ctx.createLinearGradient(offset, offset, offset+CARD_SIZE, offset+CARD_SIZE);
    grad.addColorStop(0, current.colors[0]);
    grad.addColorStop(1, current.colors[1]);
    
    ctx.fillStyle = grad;
    // Rounder corners for the scratch layer
    ctx.beginPath();
    ctx.roundRect(offset, offset, CARD_SIZE, CARD_SIZE, 40);
    ctx.fill();

    // Text hint
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WIPE TO REVEAL", CANVAS_SIZE/2, CANVAS_SIZE/2);
  };

  const scrub = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = (clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (clientY - rect.top) * (CANVAS_SIZE / rect.height);

    ctx!.globalCompositeOperation = "destination-out";
    ctx!.beginPath();
    ctx!.arc(x, y, 35, 0, Math.PI * 2); // Big brush
    ctx!.fill();

    let hits = 0;
    checkpoints.current.forEach(cp => {
      const dist = Math.sqrt((x - cp.x) ** 2 + (y - cp.y) ** 2);
      if (dist < 35) cp.hit = true;
      if (cp.hit) hits++;
    });

    const p = Math.round((hits / checkpoints.current.length) * 100);
    setProgress(p);
    if (p >= 80) setIsRevealed(true);
  };

  const nextCard = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: [DECK[cardIndex].colors[0], "#ffffff"]
    });

    gsap.to(canvasRef.current, {
      opacity: 0,
      scale: 1.2,
      filter: "blur(20px)",
      duration: 0.8,
      onComplete: () => {
        if (cardIndex < DECK.length - 1) {
          setCardIndex(prev => prev + 1);
        } else {
          window.location.href = "/experience";
        }
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#02040a] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <Link href="/experience" className="absolute top-6 left-6 p-3 rounded-2xl bg-white/5 border border-white/10 z-50"><ChevronLeft /></Link>

      <div className="text-center mb-6 z-10">
        <p className="text-[10px] uppercase tracking-[0.5em] text-rose-500 font-bold">Card {cardIndex + 1} of {DECK.length}</p>
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">{DECK[cardIndex].title}</h1>
      </div>

      {/* The Container is larger than the card to allow overflow scratching */}
      <div className="relative w-[340px] h-[340px] flex items-center justify-center">
        
        {/* The Card Content (Fixed Size) */}
        <div className="w-[320px] h-[320px] bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-2xl overflow-hidden">
           <div className="mb-4 animate-pulse">{DECK[cardIndex].icon}</div>
           <p className="text-xl font-serif italic text-slate-200 leading-relaxed">
             "{DECK[cardIndex].message}"
           </p>
        </div>

        {/* The Overlapping Canvas (Larger than the card) */}
        <canvas
          ref={canvasRef}
          style={{ width: '450px', height: '450px', position: 'absolute', top: '-55px', left: '-55px' }}
          className="z-20 cursor-crosshair touch-none"
          onMouseMove={(e) => e.buttons === 1 && scrub(e.clientX, e.clientY)}
          onTouchMove={(e) => scrub(e.touches[0].clientX, e.touches[0].clientY)}
        />
      </div>

      <div className="mt-16 w-full max-w-[260px] flex flex-col items-center gap-6 z-30">
        <div className="w-full h-1.5 bg-white/5 rounded-full border border-white/10 overflow-hidden">
          <div 
            className="h-full bg-rose-500 transition-all duration-300 shadow-[0_0_15px_#f43f5e]" 
            style={{ width: `${Math.min((progress / 60) * 100, 100)}%` }} 
          />
        </div>

        {isRevealed ? (
          <button
            onClick={nextCard}
            className="group flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl animate-in zoom-in duration-300"
          >
            {cardIndex === DECK.length - 1 ? "Finish Journey" : "Next Message"}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <p className="text-[9px] uppercase tracking-[0.6em] text-white/20 animate-pulse">Wipe the stardust</p>
        )}
      </div>
    </main>
  );
}