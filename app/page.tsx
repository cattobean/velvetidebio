"use client";
import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

/* =======================
   PRESETS
======================= */

const PRESETS = {
  aurora: {
    name: "Aurora",
    background:
      "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
    theme: {
      panelBg: "rgba(255,255,255,0.08)",
      panelBorder: "1px solid rgba(255,255,255,0.25)",
      text: "#ffffff",
      accent: "#60a5fa",
      glow: "0 0 40px rgba(96,165,250,0.35)"
    },
    panels: [
      {
        widgets: [
          { type: "profile", name: "Aiden", bio: "Developer & Builder" },
          {
            type: "socials",
            items: [
              { label: "GitHub", icon: "💻", url: "#" },
              { label: "YouTube", icon: "▶️", url: "#" },
              { label: "Discord", icon: "💬", url: "#" }
            ]
          }
        ]
      },
      {
        widgets: [
          {
            type: "text",
            title: "About Me",
            text:
              "I build systems, interfaces, and tools. This is a modular bio system with parallax."
          },
          {
            type: "gallery",
            images: [
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
              "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600"
            ]
          }
        ]
      },
      {
        widgets: [
          {
            type: "video",
            title: "Featured Video",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ"
          }
        ]
      }
    ]
  },

  crimson: {
    name: "Crimson",
    background:
      "linear-gradient(135deg, #0b0000 0%, #3b0000 50%, #0b0000 100%)",
    theme: {
      panelBg: "rgba(0,0,0,0.6)",
      panelBorder: "1px solid rgba(255,0,0,0.4)",
      text: "#ffffff",
      accent: "#ef4444",
      glow: "0 0 40px rgba(239,68,68,0.4)"
    },
    panels: [
      {
        widgets: [
          { type: "profile", name: "vell!", bio: "Creator • Gamer" },
          {
            type: "button",
            label: "Join Discord",
            url: "#"
          }
        ]
      },
      {
        widgets: [
          {
            type: "music",
            song: "Demo Track",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
          }
        ]
      }
    ]
  }
};

/* =======================
   MAIN COMPONENT
======================= */

export default function BioPage() {
  const [presetKey, setPresetKey] = useState("aurora");
  const preset = PRESETS[presetKey];

  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);

  /* Mouse + Scroll */
  useEffect(() => {
    const move = (e) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height
      });
    };
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const masterTransform = {
    transform: `
      perspective(1200px)
      rotateX(${mouse.y * -10}deg)
      rotateY(${mouse.x * 10}deg)
      translateY(${scroll * 0.05}px)
    `,
    transformStyle: "preserve-3d"
  };

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: preset.background }}
    >
      {/* Preset Switch */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Object.keys(PRESETS).map((k) => (
          <button
            key={k}
            onClick={() => setPresetKey(k)}
            className={`px-4 py-2 rounded-full text-sm ${
              k === presetKey ? "bg-white text-black" : "bg-black/40 text-white"
            }`}
          >
            {PRESETS[k].name}
          </button>
        ))}
      </div>

      {/* MASTER PANEL */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-2xl mx-auto py-32 space-y-8 px-6"
        style={masterTransform}
      >
        {preset.panels.map((panel, i) => (
          <Panel key={i} preset={preset}>
            {panel.widgets.map((w, j) => (
              <Widget key={j} widget={w} preset={preset} />
            ))}
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* =======================
   PANEL
======================= */

function Panel({ children, preset }) {
  return (
    <div
      className="rounded-3xl p-6 space-y-5 backdrop-blur-md"
      style={{
        background: preset.theme.panelBg,
        border: preset.theme.panelBorder,
        boxShadow: preset.theme.glow
      }}
    >
      {children}
    </div>
  );
}

/* =======================
   WIDGETS
======================= */

function Widget({ widget, preset }) {
  switch (widget.type) {
    case "profile":
      return (
        <div className="text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-white/20 mb-4" />
          <h1 className="text-3xl font-bold text-white">{widget.name}</h1>
          <p className="text-white/70">{widget.bio}</p>
        </div>
      );

    case "socials":
      return (
        <div className="flex justify-center gap-4">
          {widget.items.map((s, i) => (
            <a
              key={i}
              href={s.url}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:scale-110 transition"
            >
              {s.icon}
            </a>
          ))}
        </div>
      );

    case "text":
      return (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {widget.title}
          </h3>
          <p className="text-white/70">{widget.text}</p>
        </div>
      );

    case "gallery":
      return (
        <div className="grid grid-cols-3 gap-3">
          {widget.images.map((img, i) => (
            <img
              key={i}
              src={img}
              className="rounded-xl object-cover aspect-square"
            />
          ))}
        </div>
      );

    case "video":
      return (
        <div>
          <h3 className="text-white mb-3">{widget.title}</h3>
          <div className="relative pt-[56.25%] rounded-xl overflow-hidden">
            <iframe
              src={widget.url}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      );

    case "music":
      return <MusicPlayer src={widget.src} title={widget.song} />;

    case "button":
      return (
        <a
          href={widget.url}
          className="block text-center py-3 rounded-xl font-semibold"
          style={{ background: preset.theme.accent, color: "#000" }}
        >
          {widget.label}
        </a>
      );

    default:
      return (
        <div className="text-white/50 text-sm">
          Unknown widget: {widget.type}
        </div>
      );
  }
}

/* =======================
   MUSIC PLAYER
======================= */

function MusicPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [play, setPlay] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    play ? audioRef.current.pause() : audioRef.current.play();
    setPlay(!play);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-white">{title}</span>
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
      >
        {play ? <Pause /> : <Play />}
      </button>
      <audio ref={audioRef} src={src} />
    </div>
  );
}
