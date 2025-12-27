"use client";

import React, { useEffect, useRef, useState, CSSProperties } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

// ---------------------- Types ----------------------
type Badge = { icon: string; tooltip: string };
type Panel = { type: string; data: any };
type Theme = {
  widgetBorder: string;
  widgetBackground: string;
  widgetHoverBackground: string;
  textColor: string;
  accentColor: string;
  buttonBackground: string;
  buttonHoverBackground: string;
  parallaxIntensity: number;
  mouseGrindIntensity: number;
};
type Preset = { name: string; background: any; panels: Panel[]; theme: Theme };

// ---------------------- Sample Presets ----------------------
const presets: Preset[] = [
  {
    name: "Aiden",
    background: {
      type: "image",
      value: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200",
    },
    panels: [
      {
        type: "profile",
        data: {
          name: "Aiden",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiden",
          bio: "Owner/Dev @ E-Z Services",
          badges: [
            { icon: "crown", tooltip: "Owner" },
            { icon: "code", tooltip: "Developer" },
            { icon: "shield", tooltip: "Admin" },
          ],
        },
      },
      {
        type: "social-icons",
        data: {
          icons: [
            { icon: "🌐", label: "Website", url: "https://example.com" },
            { icon: "💻", label: "GitHub", url: "https://github.com" },
          ],
        },
      },
      {
        type: "music-player",
        data: {
          song: "Ovine Hall - Pep",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration: 118,
        },
      },
    ],
    theme: {
      widgetBorder: "2px solid rgba(255, 255, 255, 0.3)",
      widgetBackground: "rgba(30, 58, 108, 0.85)",
      widgetHoverBackground: "rgba(40, 68, 118, 0.9)",
      textColor: "#fff",
      accentColor: "#5b7ebd",
      buttonBackground: "rgba(255,255,255,0.15)",
      buttonHoverBackground: "rgba(255,255,255,0.25)",
      parallaxIntensity: 0.05,
      mouseGrindIntensity: 8,
    },
  },
  {
    name: "Vell",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #1a0000 0%, #4a0000 50%, #1a0000 100%)",
    },
    panels: [
      {
        type: "profile",
        data: {
          name: "Vell",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vell",
          bio: "Hi! I'm Velvetide, people call me Vell",
          badges: [{ icon: "gem", tooltip: "Premium" }],
        },
      },
      {
        type: "social-icons",
        data: {
          icons: [
            { icon: "💬", label: "Discord", url: "https://discord.com" },
            { icon: "🎮", label: "Roblox", url: "https://roblox.com" },
          ],
        },
      },
      {
        type: "music-player",
        data: {
          song: "Gorillaz - Dare",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          duration: 243,
        },
      },
    ],
    theme: {
      widgetBorder: "2px solid #ff0000",
      widgetBackground: "rgba(0,0,0,0.6)",
      widgetHoverBackground: "rgba(20,0,0,0.8)",
      textColor: "#fff",
      accentColor: "#ff0000",
      buttonBackground: "#ff0000",
      buttonHoverBackground: "#cc0000",
      parallaxIntensity: 0.03,
      mouseGrindIntensity: 5,
    },
  },
];

// ---------------------- Helper Functions ----------------------
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// ---------------------- Main Component ----------------------
export default function BioSystem() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const preset = presets[presetIndex];

  // ---------------------- Effects ----------------------
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMouse({ x: (e.clientX - centerX) / (rect.width / 2), y: (e.clientY - centerY) / (rect.height / 2) });
    };
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // ---------------------- Transform ----------------------
  const masterTransform: CSSProperties = {
    transform: `
      perspective(1000px)
      rotateX(${mouse.y * -preset.theme.mouseGrindIntensity}deg)
      rotateY(${mouse.x * preset.theme.mouseGrindIntensity}deg)
      translateY(${scroll * preset.theme.parallaxIntensity}px)
    `,
    transformStyle: "preserve-3d" as "preserve-3d",
  };

  // ---------------------- Panel Renderer ----------------------
  const renderPanel = (panel: Panel, i: number) => {
    const theme = preset.theme;

    switch (panel.type) {
      case "profile":
        return (
          <div
            key={i}
            className="relative w-full max-w-lg p-8 rounded-3xl backdrop-blur-md shadow-xl flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl"
            style={{ border: theme.widgetBorder, background: theme.widgetBackground }}
          >
            <img src={panel.data.avatar} alt={panel.data.name} className="w-32 h-32 rounded-full mb-4 border-4" style={{ borderColor: theme.accentColor }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>
              {panel.data.name}
            </h1>
            <p className="text-sm mb-4" style={{ color: theme.textColor, opacity: 0.9 }}>
              {panel.data.bio}
            </p>
            <div className="flex gap-2">
              {panel.data.badges?.map((b: Badge, j: number) => (
                <div key={j} className="p-1 rounded-full text-xs bg-white bg-opacity-20" style={{ color: theme.textColor }}>
                  {b.tooltip}
                </div>
              ))}
            </div>
          </div>
        );
      case "social-icons":
        return (
          <div
            key={i}
            className="relative w-full max-w-lg p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-wrap justify-center gap-4 transition-all duration-300 hover:shadow-2xl"
            style={{ border: theme.widgetBorder, background: theme.widgetBackground }}
          >
            {panel.data.icons.map((icon: any, j: number) => (
              <a
                key={j}
                href={icon.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full transition-transform hover:scale-110"
                style={{ backgroundColor: theme.buttonBackground, border: `2px solid ${theme.accentColor}` }}
                onMouseEnter={() => setHoveredIcon(`${i}-${j}`)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {icon.icon}
              </a>
            ))}
          </div>
        );
      case "music-player":
        return (
          <div
            key={i}
            className="relative w-full max-w-lg p-6 rounded-3xl backdrop-blur-md shadow-xl flex flex-col gap-3 transition-all duration-300 hover:shadow-2xl"
            style={{ border: theme.widgetBorder, background: theme.widgetBackground }}
          >
            <audio ref={audioRef} src={panel.data.audioUrl} />
            <h3 className="text-center font-semibold" style={{ color: theme.textColor }}>
              {panel.data.song}
            </h3>
            <div className="flex items-center justify-between">
              <span style={{ color: theme.textColor, opacity: 0.7 }}>{formatTime(currentTime)}</span>
              <div
                className="flex-1 h-1.5 rounded-full bg-white bg-opacity-20 mx-2 cursor-pointer"
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  if (audioRef.current) audioRef.current.currentTime = percent * duration;
                }}
              >
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${(currentTime / duration) * 100}%` }} />
              </div>
              <span style={{ color: theme.textColor, opacity: 0.7 }}>{formatTime(duration)}</span>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <button onClick={togglePlay} className="p-2 rounded-full" style={{ backgroundColor: theme.accentColor }}>
                {isPlaying ? <Pause color={theme.textColor} /> : <Play color={theme.textColor} />}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: preset.background.type === "image" ? `url(${preset.background.value})` : undefined,
          background: preset.background.type === "gradient" ? preset.background.value : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Preset selector */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black bg-opacity-50 rounded-full p-2 backdrop-blur-sm">
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => setPresetIndex(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              presetIndex === i ? "bg-white text-black" : "bg-transparent text-white hover:bg-white hover:bg-opacity-20"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Master Panel Container */}
      <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-start min-h-screen py-32 px-6 gap-12" style={masterTransform}>
        {preset.panels.map((panel, i) => renderPanel(panel, i))}
      </div>

      {/* Custom cursor */}
      <div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none bg-white mix-blend-difference"
        style={{ transform: `translate(${mouse.x * 20 + window.innerWidth / 2}px, ${mouse.y * 20 + window.innerHeight / 2}px)` }}
      />
    </div>
  );
}
