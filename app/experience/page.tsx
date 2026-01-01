"use client";
import Link from "next/link";
import { ChevronLeft, Heart, Moon, Star } from "lucide-react";

const LOVE_STAGES = [
  { 
    id: "vault", 
    title: "Heartbeat Sync", 
    desc: "Match the rhythm to unlock a secret", 
    icon: <Heart className="fill-rose-500 text-rose-500" /> 
  },
  { 
    id: "orbs", 
    title: "Umma Rain", 
    desc: "Catch all the kisses I sent your way", 
    icon: <Moon className="fill-indigo-400 text-indigo-400" /> 
  },
  { 
    id: "scratch", 
    title: "The Soul Message", 
    desc: "Scratch away the stardust for a surprise", 
    icon: <Star className="fill-amber-400 text-amber-400" /> 
  },
];

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-[#0a0510] text-rose-50 p-6">
      <header className="flex items-center justify-between mb-16">
        <Link href="/" className="p-3 rounded-full bg-white/5 border border-white/10"><ChevronLeft size={20}/></Link>
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-rose-300">Love Chapters</span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {LOVE_STAGES.map((stage) => (
          <Link 
            key={stage.id} 
            href={`/game/${stage.id}`}
            className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {stage.icon}
            </div>
            <div>
              <h3 className="font-bold tracking-tight text-lg">{stage.title}</h3>
              <p className="text-xs text-rose-300/40">{stage.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}