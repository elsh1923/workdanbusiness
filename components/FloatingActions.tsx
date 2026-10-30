"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/config";

export default function FloatingActions() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div className="gold-gradient h-full" style={{ width: `${progress}%` }} />
      </div>

      {showTop && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center">
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rise pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-lg transition hover:bg-slate-accent"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3">
        <a
          href={whatsappLink("Hello Workdane, I'd like to discuss company setup.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0f7d46] text-white shadow-xl transition hover:scale-105"
        >
          <span className="ring absolute inset-0 rounded-full bg-[#0f7d46]" />
          <MessageCircle className="relative h-6 w-6" />
        </a>
      </div>
    </>
  );
}
