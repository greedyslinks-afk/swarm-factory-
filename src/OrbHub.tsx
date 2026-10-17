import React, { useEffect, useRef, useState } from 'react';
import { SWARM_AGENTS, SignProfile } from './voiceProfiles';
import { audioEngine } from './audioEngine';
import {
  Bot,
  ShieldCheck,
  Box,
  Cpu,
  Database,
  Terminal,
  MousePointerClick,
  Volume2,
  ExternalLink,
  CheckCircle2,
  Zap,
  Send
} from 'lucide-react';

export interface AgentStateData {
  status: 'idle' | 'speaking' | 'deliberating' | 'attuned' | string;
  lastPrompt?: string;
  lastResponse?: string;
  updatedAt?: string;
}

interface OrbHubProps {
  activeSignId: string | null;
  targetSignId?: string | null;
  onSelectSign?: (sign: SignProfile) => void;
  onInspectNode?: (sign: SignProfile) => void;
  onPulseCore?: () => void;
  selectedSignId?: string | null;
  isDeliberating?: boolean;
  agentStates?: Record<string, AgentStateData>;
  recentlyUpdatedSignId?: string | null;
}

const NODE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'digital-products': Bot,
  'tech-essentials': ShieldCheck,
  'spatial-ui': Box,
  'ai-solutions': Cpu,
  'firebase-mcp': Database,
  'platform-core': Terminal,
};

// Orbital node positions around the Spatial Hub (matching Layout 1 + 2 side flank nodes)
const ORBIT_POSITIONS: Record<
  string,
  {
    positionClass: string;
    floatClass: string;
    svgCoord: { x: number; y: number };
  }
> = {
  'digital-products': {
    positionClass: 'top-2 left-2 sm:top-6 sm:left-6',
    floatClass: 'animate-float-a',
    svgCoord: { x: 145, y: 85 },
  },
  'tech-essentials': {
    positionClass: 'top-2 right-2 sm:top-6 sm:right-6',
    floatClass: 'animate-float-b',
    svgCoord: { x: 655, y: 85 },
  },
  'firebase-mcp': {
    positionClass: 'top-1/2 -translate-y-1/2 left-1 sm:left-2 hidden md:block',
    floatClass: 'animate-float-b',
    svgCoord: { x: 110, y: 260 },
  },
  'platform-core': {
    positionClass: 'top-1/2 -translate-y-1/2 right-1 sm:right-2 hidden md:block',
    floatClass: 'animate-float-a',
    svgCoord: { x: 690, y: 260 },
  },
  'spatial-ui': {
    positionClass: 'bottom-2 left-2 sm:bottom-6 sm:left-6',
    floatClass: 'animate-float-b',
    svgCoord: { x: 145, y: 435 },
  },
  'ai-solutions': {
    positionClass: 'bottom-2 right-2 sm:bottom-6 sm:right-6',
    floatClass: 'animate-float-a',
    svgCoord: { x: 655, y: 435 },
  },
};

export const OrbHub: React.FC<OrbHubProps> = ({
  activeSignId,
  onSelectSign,
  onInspectNode,
  onPulseCore,
  selectedSignId,
  isDeliberating = false,
  agentStates = {},
  recentlyUpdatedSignId = null,
}) => {
  const [corePulsing, setCorePulsing] = useState(false);
  const [audioPulse, setAudioPulse] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePulse = () => {
      const data = audioEngine.getFrequencyData();
      if (data && data.length > 0) {
        let sum = 0;
        const count = Math.min(16, data.length);
        for (let i = 0; i < count; i++) {
          sum += data[i];
        }
        setAudioPulse(sum / (count * 255));
      }
      animationFrameRef.current = requestAnimationFrame(updatePulse);
    };

    animationFrameRef.current = requestAnimationFrame(updatePulse);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleCoreClick = () => {
    setCorePulsing(true);
    setTimeout(() => setCorePulsing(false), 350);
    audioEngine.initAudio();
    audioEngine.playGuitarChord([216, 324, 432, 648]);
    if (onPulseCore) {
      onPulseCore();
    }
  };

  const handleNodeClick = (agent: SignProfile) => {
    audioEngine.initAudio();
    audioEngine.playSignHarmonic(agent, 1.2);
    if (onSelectSign) {
      onSelectSign(agent);
    }
  };

  return (
    <div className="relative w-full max-w-5xl h-[490px] sm:h-[530px] flex items-center justify-center my-1 select-none">
      {/* SVG Telemetry Connection Beams from Central Core to Orbital Nodes */}
      <svg
        viewBox="0 0 800 520"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      >
        <defs>
          <linearGradient id="beamCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4facfe" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {SWARM_AGENTS.map((agent) => {
          const pos = ORBIT_POSITIONS[agent.id];
          if (!pos) return null;
          const state = agentStates[agent.id];
          const isSpeaking =
            activeSignId === agent.id || state?.status === 'speaking';
          const isSelected = selectedSignId === agent.id;
          const isRecent = recentlyUpdatedSignId === agent.id;
          const isAttuned = state?.status === 'attuned';

          const strokeOpacity =
            isSpeaking || isRecent
              ? 0.9
              : isSelected
              ? 0.55
              : isAttuned
              ? 0.35
              : 0.14;
          const strokeWidth =
            isSpeaking || isRecent ? 2.8 : isSelected ? 1.8 : 1;

          return (
            <g key={agent.id}>
              <line
                x1={400}
                y1={260}
                x2={pos.svgCoord.x}
                y2={pos.svgCoord.y}
                stroke={isSpeaking || isRecent ? '#00f2fe' : agent.color}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                strokeDasharray={isSpeaking || isRecent ? undefined : '5 5'}
              />
              {(isSpeaking || isRecent) && (
                <circle
                  cx={(400 + pos.svgCoord.x) / 2}
                  cy={(260 + pos.svgCoord.y) / 2}
                  r={4}
                  fill="#00f2fe"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Rotating Ring Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[330px] h-[330px] sm:w-[460px] sm:h-[460px] rounded-full border border-cyan-400/20 border-dashed animate-[spin_38s_linear_infinite]" />
        <div className="absolute w-[250px] h-[250px] sm:w-[360px] sm:h-[360px] rounded-full border border-indigo-500/30 animate-[spin_24s_linear_infinite_reverse]" />
        <div className="absolute w-[175px] h-[175px] sm:w-[265px] sm:h-[265px] rounded-full border border-cyan-400/15" />
      </div>

      {/* Central 3D Glowing Core */}
      <div
        onClick={handleCoreClick}
        style={{
          transform: `scale(${
            corePulsing ? 1.09 : 1 + audioPulse * 0.08
          })`,
        }}
        className="relative z-20 w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-cyan-600/30 via-indigo-950/90 to-slate-950 border-2 border-[#00f2fe] shadow-[0_0_60px_rgba(0,242,254,0.42)] flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-transform duration-300 hover:scale-105 group"
      >
        <div className="absolute -inset-1.5 rounded-full bg-cyan-400/15 blur-md group-hover:bg-cyan-400/30 transition" />
        <span className="relative z-10 text-[10px] sm:text-xs font-mono tracking-widest text-[#00f2fe] uppercase font-bold mb-1">
          AI Powers Business
        </span>
        <h2 className="relative z-10 text-xl sm:text-2xl font-extrabold tracking-tight text-white glow-text-cyan">
          SWARM FACTORY
        </h2>
        <p className="relative z-10 text-xs sm:text-sm font-mono text-cyan-300 font-semibold mt-0.5">
          GREEDYSLINKS AI HUB
        </p>
        <div className="relative z-10 mt-3 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/35 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 group-hover:border-[#00f2fe] transition whitespace-nowrap">
          <MousePointerClick className="w-3.5 h-3.5 text-[#00f2fe]" />
          <span>{isDeliberating ? 'Swarm Executing' : 'Click Core to Pulse'}</span>
        </div>
      </div>

      {/* Orbiting Swarm Factory Agent Nodes */}
      {SWARM_AGENTS.map((agent) => {
        const pos = ORBIT_POSITIONS[agent.id];
        if (!pos) return null;
        const IconComponent = NODE_ICONS[agent.id] || Cpu;
        const state = agentStates[agent.id];
        const isSpeaking =
          activeSignId === agent.id || state?.status === 'speaking';
        const isAttuned = state?.status === 'attuned';
        const isSelected = selectedSignId === agent.id;
        const isRecent = recentlyUpdatedSignId === agent.id;

        return (
          <div
            key={agent.id}
            className={`absolute ${pos.positionClass} z-30 ${pos.floatClass}`}
          >
            <div
              onClick={() => handleNodeClick(agent)}
              className={`p-3 sm:p-3.5 rounded-xl w-[205px] sm:w-[240px] cursor-pointer transition-all duration-200 hover:scale-[1.03] group ${
                isSpeaking || isRecent || isSelected
                  ? 'glass-panel-active'
                  : 'glass-panel hover:border-cyan-400/70'
              }`}
              style={{
                borderColor:
                  isSpeaking || isRecent
                    ? '#00f2fe'
                    : isSelected
                    ? agent.color
                    : undefined,
              }}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="p-2 rounded-lg border transition shrink-0"
                    style={{
                      backgroundColor:
                        isSpeaking || isRecent
                          ? '#00f2fe'
                          : `${agent.color}20`,
                      borderColor: `${agent.color}55`,
                      color:
                        isSpeaking || isRecent ? '#030712' : agent.color,
                    }}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00f2fe] transition truncate">
                      {agent.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {agent.subtitle}
                    </p>
                  </div>
                </div>

                {/* Inspect Details Trigger */}
                {onInspectNode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectNode(agent);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-cyan-500/20 text-slate-400 hover:text-[#00f2fe] border border-slate-800 transition shrink-0"
                    title="Inspect Node Specs & Send Prompt"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Real-Time Firestore State Bar inside the Orbital Node */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 truncate">
                  {state?.status ? (
                    <span
                      className={
                        isSpeaking
                          ? 'text-amber-300 font-semibold'
                          : isAttuned
                          ? 'text-emerald-400 font-semibold'
                          : 'text-slate-400'
                      }
                    >
                      State: {state.status.toUpperCase()}
                    </span>
                  ) : (
                    <span>State: READY</span>
                  )}
                </span>
                <span className="text-cyan-400/90">{agent.element}</span>
              </div>

              {/* Show live snippet if a custom prompt was sent to this agent */}
              {state?.lastPrompt && (
                <div className="mt-1.5 px-2 py-1 rounded bg-slate-950/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 truncate">
                  Prompt: "{state.lastPrompt}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrbHub;
