"use client";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Heart, Sparkles, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";


interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}


export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });
  const [isAwakened, setIsAwakened] = useState(false);
  const router = useRouter();
  const heartRef = useRef(null);
const [deferredPrompt, setDeferredPrompt] =
  useState<BeforeInstallPromptEvent | null>(null);
const [showInstall, setShowInstall] = useState(false);
const isIOS =
  typeof window !== "undefined" &&
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

useEffect(() => {
const handler = (e: Event) => {
  e.preventDefault();
  setDeferredPrompt(e as BeforeInstallPromptEvent);
  setShowInstall(true);
};


  window.addEventListener("beforeinstallprompt", handler);

  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);

  // 1. Timer for the on-screen display
  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date();
      target.setHours(24, 0, 0, 0);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ h: "00", m: "00", s: "00" });
        return;
      }

      setTimeLeft({
        h: Math.floor((diff / 36e5) % 24).toString().padStart(2, "0"),
        m: Math.floor((diff / 6e4) % 60).toString().padStart(2, "0"),
        s: Math.floor((diff / 1e3) % 60).toString().padStart(2, "0")
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Notification Logic
  const triggerBirthdayNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/android-chrome-192x192.png",
        requireInteraction: true, // Keeps it visible
      });
    }
  };

  const startCountdownWatch = () => {
    const watchTimer = setInterval(() => {
      const target = new Date();
      target.setHours(24, 0, 0, 0);
      const now = new Date();
      const diffInMs = target.getTime() - now.getTime();
      const diffInSecs = Math.floor(diffInMs / 1000);

      // 10 Minutes (600 seconds)
      if (diffInSecs === 600) {
        triggerBirthdayNotification("10 Minutes Left ✨", "The vault is beginning to glow. Almost time.");
      }
      // 5 Minutes (300 seconds)
      if (diffInSecs === 300) {
        triggerBirthdayNotification("5 Minutes Remaining ⏳", "Final calibration in progress. Get ready.");
      }
      // Midnight (0 seconds)
      if (diffInSecs === 0) {
        triggerBirthdayNotification("HAPPY BIRTHDAY! ❤️", "The Heartbeat Vault is officially OPEN. Tap to enter.");
        clearInterval(watchTimer);
      }
    }, 1000);
  };

  const handleAwaken = async () => {
    // Request permission as soon as they tap
    if ("Notification" in window) {
      await Notification.requestPermission();
    }

    if (navigator.vibrate) navigator.vibrate([50, 20, 50]);
    
    // Start the background countdown listener
    startCountdownWatch();
    
    const tl = gsap.timeline({ onComplete: () => setIsAwakened(true) });
    
    tl.to(heartRef.current, { scale: 0.8, duration: 0.1 })
      .to(heartRef.current, { 
        scale: 100, 
        opacity: 0, 
        duration: 1.2, 
        ease: "expo.in",
        filter: "blur(20px)" 
      })
      .from(".love-content", { scale: 0.9, opacity: 0, duration: 1, ease: "back.out(1.7)" });
  };

  return (
    <main className="relative min-h-screen bg-[#050208] text-rose-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      {!isAwakened && (
        <div className="absolute inset-0 z-50 bg-[#050208] flex flex-col items-center justify-center" onClick={handleAwaken}>
          <div ref={heartRef} className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-rose-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-100 transition-opacity" />
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-pulse relative z-10" />
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-50" size={30} />
          </div>
          <p className="mt-16 text-[10px] uppercase tracking-[0.8em] text-rose-500 font-bold animate-bounce text-center">
            Tap to Unleash <br/> & Enable Alerts
          </p>
        </div>
      )}
      {showInstall && (
  <button
    onClick={async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("PWA installed");
      }
      setDeferredPrompt(null);
      setShowInstall(false);
    }}
    className="mt-6 px-10 py-4 rounded-full bg-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition"
  >
    Install App ❤️
  </button>
)}
{isIOS && (
  <p className="mt-6 text-xs text-rose-400">
    Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> ❤️
  </p>
)}


      <div className="love-content flex flex-col items-center text-center">
        <div className="relative mb-8">
           <div className="absolute -inset-4 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
           <h1 className="text-8xl md:text-9xl font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-950">
             {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
           </h1>
        </div>
        
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-rose-400 mb-12">Seconds until your universe begins</p>

        <button 
          onClick={() => router.push('/experience')}
          className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center gap-4">Enter Journey <ArrowRight size={18}/></span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </main>
  );
}