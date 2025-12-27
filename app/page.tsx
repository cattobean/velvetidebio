"use client";

import React, { useEffect, useRef, useState, CSSProperties } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

type Badge = { icon: string; tooltip: string };
type SocialIcon = { platform: string; label: string; url: string; iconType: "emoji" | "image"; icon: string };
type PanelWidget =
  | { type: "profile"; data: { avatar: string; name: string; bio: string; decoration?: string; badges?: Badge[] } }
  | { type: "social-icons"; data: { icons: SocialIcon[] } }
  | { type: "music-player"; data: { song: string; audioUrl: string; duration: number } }
  | { type: "gallery"; data: { title: string; items: { type: "image"; src: string; alt: string }[]; autoplay?: boolean; interval?: number } }
  | { type: "video-frame"; data: { title: string; videoUrl: string; aspectRatio: string } };

type Preset = {
  name: string;
  background: { type: "image" | "gradient" | "solid"; value: string; parallax?: boolean };
  panels: PanelWidget[];
  theme: {
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
};

const presets: Record<string, Preset> = {
  aiden: {
    name: "Aiden",
    background: { type: "image", value: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", parallax: true },
    panels: [
      {
        type: "profile",
        data: {
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aiden",
          name: "Aiden",
          bio: "Owner/Dev @ E-Z Services|",
          decoration: "cat",
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
            { platform: "github", label: "GitHub", url: "https://github.com", iconType: "emoji", icon: "💻" },
            { platform: "website", label: "Website", url: "https://example.com", iconType: "emoji", icon: "🌐" },
          ],
        },
      },
      {
        type: "music-player",
        data: {
          song: "ovine hall - pep",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration: 118,
        },
      },
    ],
    theme: {
      widgetBorder: "2px solid rgba(255, 255, 255, 0.3)",
      widgetBackground: "rgba(30, 58, 108, 0.85)",
      widgetHoverBackground: "rgba(40, 68, 118, 0.9)",
      textColor: "#ffffff",
      accentColor: "#5b7ebd",
      buttonBackground: "rgba(255, 255, 255, 0.15)",
      buttonHoverBackground: "rgba(255, 255, 255, 0.25)",
      parallaxIntensity: 0.05,
      mouseGrindIntensity: 8,
    },
  },
  vell: {
    name: "Vell",
    background: { type: "gradient", value: "linear-gradient(135deg, #1a0000 0%, #4a0000 50%, #1a0000 100%)", parallax: true },
    panels: [
      {
        type: "profile",
        data: {
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vell&backgroundColor=b6e3f4",
          name: "Vell",
          bio: "Hi! I'm velvetide but most people call me Vell",
          decoration: "cross",
        },
      },
      {
        type: "social-icons",
        data: {
          icons: [
            { platform: "discord", label: "Discord", url: "https://discord.com", iconType: "emoji", icon: "💬" },
            { platform: "youtube", label: "YouTube", url: "https://youtube.com", iconType: "emoji", icon: "▶️" },
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
      widgetBackground: "rgba(0, 0, 0, 0.6)",
      widgetHoverBackground: "rgba(20, 0, 0, 0.8)",
      textColor: "#ffffff",
      accentColor: "#ff0000",
      buttonBackground: "#ff0000",
      buttonHoverBackground: "#cc0000",
      parallaxIntensity: 0.03,
      mouseGrindIntensity: 5,
    },
  },
};

export default function Landing() {
  const [currentPreset, setCurrentPreset] = useState<keyof typeof presets>("aiden");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const preset = presets[currentPreset];

  // mouse move
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // scroll
  useEffect(() => {
    const handle = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const timeUpdate = () => setCurrentTime(audio.currentTime);
    const loaded = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loaded);
    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loaded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const masterTransform: CSSProperties = {
    transform: `
      perspective(1000px)
      rotateX(${mouse.y * -preset.theme.mouseGrindIntensity}deg)
      rotateY(${mouse.x * preset.theme.mouseGrindIntensity}deg)
      translateY(${scroll * preset.theme.parallaxIntensity}px)
    `,
    transformStyle: "preserve-3d" as "preserve-3d",
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Preset Switcher */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 bg-black bg-opacity-50 rounded-full p-2 backdrop-blur-sm">
        {Object.keys(presets).map((key) => (
          <button
            key={key}
            onClick={() => setCurrentPreset(key as keyof typeof presets)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              currentPreset === key ? "bg-white text-black" : "bg-transparent text-white hover:bg-white hover:bg-opacity-20"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Background */}
      <div
        className="fixed inset-0 w-full h-full transition-all duration-500"
        style={{
          ...(preset.background.type === "image" ? { backgroundImage: `url(${preset.background.value})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
          ...(preset.background.type === "gradient" ? { background: preset.background.value } : {}),
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div ref={containerRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen py-20 px-6" style={masterTransform}>
        {preset.panels.map((panel, i) => {
          switch (panel.type) {
            case "profile":
              return (
                <div key={i} className="relative rounded-3xl p-8 mb-10 backdrop-blur-md" style={{ border: preset.theme.widgetBorder, background: preset.theme.widgetBackground }}>
                  <img src={panel.data.avatar} alt={panel.data.name} className="w-32 h-32 rounded-full border-4" style={{ borderColor: preset.theme.accentColor }} />
                  <h1 className="text-3xl font-bold mt-4" style={{ color: preset.theme.textColor }}>{panel.data.name}</h1>
                  <p style={{ color: preset.theme.textColor, opacity: 0.8 }}>{panel.data.bio}</p>
                </div>
              );
            case "social-icons":
              return (
                <div key={i} className="rounded-3xl p-6 mb-10 backdrop-blur-md flex gap-4" style={{ border: preset.theme.widgetBorder, background: preset.theme.widgetBackground }}>
                  {panel.data.icons.map((icon, j) => (
                    <a key={j} href={icon.url} target="_blank" rel="noopener noreferrer" className="text-2xl transition hover:scale-125">
                      {icon.icon}
                    </a>
                  ))}
                </div>
              );
            case "music-player":
              return (
                <div key={i} className="rounded-3xl p-6 mb-10 backdrop-blur-md" style={{ border: preset.theme.widgetBorder, background: preset.theme.widgetBackground }}>
                  <audio ref={audioRef} src={panel.data.audioUrl} />
                  <div className="flex items-center justify-between mb-3">
                    <h3 style={{ color: preset.theme.textColor }}>{panel.data.song}</h3>
                    <button onClick={togglePlay} className="p-2 bg-gray-300 rounded-full">
                      {isPlaying ? <Pause /> : <Play />}
                    </button>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/20 relative cursor-pointer" onClick={(e) => {
                    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
                    if (!audioRef.current) return;
                    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
                  }}>
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(currentTime / duration) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1" style={{ color: preset.theme.textColor }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
