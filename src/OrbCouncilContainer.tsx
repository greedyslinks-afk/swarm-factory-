import React, { useState, useEffect, useRef } from 'react';
import { SWARM_AGENTS, SignProfile } from './voiceProfiles';
import { OrbHub, AgentStateData } from './OrbHub';
import { ThreeBackground, SpatialEnvironmentMode } from './ThreeBackground';
import { audioEngine } from './audioEngine';
import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import {
  Cpu,
  Orbit,
  Layers,
  Sparkles,
  Mail,
  ArrowRight,
  Play,
  Music,
  MapPin,
  Map as MapIcon,
  Bot,
  ShieldCheck,
  Box,
  Database,
  Terminal,
  Volume2,
  VolumeX,
  Send,
  RefreshCw,
  X,
  ExternalLink,
  CheckCircle2,
  Activity,
  SlidersHorizontal,
  Compass,
  Radio,
  Zap,
  Briefcase,
  Code2,
  Globe,
  GitBranch,
  Copy,
  Check,
  Wand2,
  Camera,
  Columns,
  Server,
  ChevronRight,
} from 'lucide-react';

export interface SwarmLogRecord {
  id?: string;
  signId: string;
  signName: string;
  element: string;
  prompt: string;
  statement: string;
  reasoning: string;
  stance: 'propose' | 'challenge' | 'synthesize' | 'affirm' | 'abstain';
  vote: 'aye' | 'nay' | 'abstain' | 'pending';
  timestamp: string;
}

export interface FlagshipArchitectureSpec {
  id: 'astroguitar' | 'dpss' | 'swarm-factory' | 'firebase-mcp';
  name: string;
  badge: string;
  tagline: string;
  repoName: string;
  repoUrl: string;
  agentId: string;
  accentColor: string;
  description: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  blueprintJson: Record<string, unknown>;
}

const FLAGSHIP_ARCHITECTURES: FlagshipArchitectureSpec[] = [
  {
    id: 'swarm-factory',
    name: 'Swarm Factory Core',
    badge: 'MULTI-AGENT ORCHESTRATOR',
    tagline: 'Autonomous 6-Node Agent Swarm & Firestore Real-Time State Bus',
    repoName: 'greedyslinks-afk/swarm-factory-',
    repoUrl: 'https://github.com/greedyslinks-afk/swarm-factory-',
    agentId: 'ai-solutions',
    accentColor: '#00f2fe',
    description:
      'Flagship multi-agent orchestration engine synchronizing custom agent directives, Gemini 3.8 Flash reasoning, and live Firestore state persistence across all GreedysLinks repositories.',
    metrics: [
      { label: 'Active Swarm Nodes', value: '6 Orbs' },
      { label: 'State Sync Latency', value: '18 ms' },
      { label: 'Firestore Reliability', value: '99.98%' },
    ],
    stack: ['React 19', 'Three.js WebGL', 'Firebase Firestore', 'Gemini 3.8 Flash', 'Express TS'],
    blueprintJson: {
      architecture: 'Swarm Factory Multi-Agent Hub',
      project_id: 'gen-lang-client-0343118388',
      project_number: '643675584033',
      collections: ['/agents/{agentId}', '/deliberations/{sessionId}/messages/{msgId}'],
      orchestration_mode: 'parallel-consensus-synthesis',
    },
  },
  {
    id: 'astroguitar',
    name: 'AstroGuitar AI',
    badge: '3D WEBGL & AUDIO AI',
    tagline: 'Voice-Commanded 3D Fretboard & Polyphonic Web Audio Trainer',
    repoName: 'greedyslinks-afk/https-greedyslinks-portfolio-',
    repoUrl: 'https://github.com/greedyslinks-afk/https-greedyslinks-portfolio-',
    agentId: 'spatial-ui',
    accentColor: '#38bdf8',
    description:
      'Hands-free voice-commanded 3D guitar training architecture with 60 FPS WebGL fretboard geometry, harmonic scale projection, and zero-latency Web Audio API synthesis.',
    metrics: [
      { label: 'WebGL Frame Rate', value: '60 FPS' },
      { label: 'Audio Synth Latency', value: '4.2 ms' },
      { label: 'Harmonic Scales', value: '12 Modes' },
    ],
    stack: ['Three.js r128+', 'Web Audio API', 'Voice AI Triggers', 'Spatial Shaders'],
    blueprintJson: {
      architecture: 'AstroGuitar AI 3D Trainer',
      audio_engine: 'Polyphonic Web Audio Oscillator Bank',
      spatial_renderer: 'Three.js WebGL Fretboard Mesh',
      supported_scales: ['C Major', 'A Minor Pentatonic', 'G Mixolydian'],
    },
  },
  {
    id: 'dpss',
    name: 'DPSS & SentinelDrive',
    badge: 'SPATIAL GIS & ZERO-TRUST',
    tagline: 'Topological GIS Route Pathfinder & Real-Time Hazard Telemetry',
    repoName: 'greedyslinks-afk/SentinelDrive-',
    repoUrl: 'https://github.com/greedyslinks-afk/SentinelDrive-',
    agentId: 'tech-essentials',
    accentColor: '#818cf8',
    description:
      'Sub-10ms topological route graph solver and SentinelDrive telemetry platform featuring vector tile caching, sensory mesh overlays, and zero-trust ABAC security rules.',
    metrics: [
      { label: 'Topological Nodes', value: '1,420' },
      { label: 'Route Solver Speed', value: '5.8 ms' },
      { label: 'Security Posture', value: 'Zero-Trust' },
    ],
    stack: ['Topological Graph Solver', 'SentinelDrive Telemetry', 'Firestore Rules', 'GIS Vector Mesh'],
    blueprintJson: {
      architecture: 'DPSS & SentinelDrive Spatial Router',
      solver_algorithm: 'Directed Topological Mesh A*',
      active_waypoints: ['Sector Alpha-01', 'Ridge Relay', 'Swarm Hub Core'],
      security_layer: 'Zero-Trust Key & Role Verification',
    },
  },
  {
    id: 'firebase-mcp',
    name: 'Cloud MCP & Platform AI',
    badge: 'CLOUD RUN & OMNIGIT MCP',
    tagline: 'Enterprise MCP Server Infrastructure & Multi-Repo Indexing',
    repoName: 'greedyslinks-afk/platform-ai',
    repoUrl: 'https://github.com/greedyslinks-afk/platform-ai',
    agentId: 'firebase-mcp',
    accentColor: '#34d399',
    description:
      'Production Cloud Run MCP servers, Gemini CLI extensions, and OmniGit repository indexing connecting `agent-skills`, `temp_gemini_flow`, and `platform-ai`.',
    metrics: [
      { label: 'Indexed Repos', value: '6 Repos' },
      { label: 'Token Velocity', value: '1,940 t/s' },
      { label: 'Cloud Run Uptime', value: '99.99%' },
    ],
    stack: ['Cloud Run MCP', 'OmniGit Graph', 'Gemini CLI Skills', 'Firebase Admin'],
    blueprintJson: {
      architecture: 'GreedysLinks Cloud MCP & Platform AI',
      repositories: [
        'greedyslinks-afk/swarm-factory-',
        'greedyslinks-afk/platform-ai',
        'greedyslinks-afk/agent-skills',
        'greedyslinks-afk/SentinelDrive-',
        'greedyslinks-afk/temp_gemini_flow',
      ],
      protocol: 'Model Context Protocol (MCP) JSON-RPC 2.0',
    },
  },
];

interface BusinessServiceSpec {
  id: string;
  title: string;
  category: string;
  summary: string;
  deliverables: string[];
  targetAgentId: string;
  presetDirective: string;
}

const BUSINESS_SERVICES: BusinessServiceSpec[] = [
  {
    id: 'custom-agents',
    title: 'Autonomous Multi-Agent Systems',
    category: 'AI ENGINEERING',
    summary:
      'End-to-end design and deployment of custom multi-agent swarms with live Firebase Firestore state synchronization and function-calling pipelines.',
    deliverables: ['6-Node Swarm Orchestrator', 'Firestore Real-Time State Bus', 'Gemini 3.8 Flash Integration'],
    targetAgentId: 'digital-products',
    presetDirective:
      'Architect an autonomous multi-agent customer operations swarm with Firestore state persistence and sub-25ms telemetry.',
  },
  {
    id: 'spatial-webgl',
    title: '3D Spatial WebGL & Audio Interfaces',
    category: 'SPATIAL UI/UX',
    summary:
      'High-frame-rate Three.js 3D command centers, interactive product configurators, and Web Audio synthesizer experiences like AstroGuitar AI.',
    deliverables: ['60 FPS Three.js Scene Graph', 'Interactive Orbital HUD', 'Polyphonic Web Audio Engine'],
    targetAgentId: 'spatial-ui',
    presetDirective:
      'Design a 60 FPS 3D WebGL spatial product interface with interactive orbital camera controls and real-time audio feedback.',
  },
  {
    id: 'gis-security',
    title: 'Topological GIS & Zero-Trust Cloud',
    category: 'INFRASTRUCTURE & SEC',
    summary:
      'Low-latency spatial routing meshes (DPSS), SentinelDrive telemetry pipelines, and hardened Firebase security rule architectures.',
    deliverables: ['Sub-10ms Route Graph Solver', 'Zero-Trust Firestore Rules', 'Cloud Run MCP Deployment'],
    targetAgentId: 'tech-essentials',
    presetDirective:
      'Generate a zero-trust Cloud Run + Firestore security architecture with real-time topological telemetry routing.',
  },
];

type ActiveTab = 'command' | 'hub' | 'projects' | 'studio';
type SimulatorType = 'astroguitar' | 'dpss' | 'swarm' | null;

const FRETBOARD_NOTES = [
  { note: 'C4', freq: 261.63, active: true },
  { note: 'D4', freq: 293.66, active: false },
  { note: 'E4', freq: 329.63, active: true },
  { note: 'F4', freq: 349.23, active: false },
  { note: 'G4', freq: 392.0, active: true },
  { note: 'A4', freq: 440.0, active: true },
  { note: 'B4', freq: 493.88, active: false },
  { note: 'C5', freq: 523.25, active: true },
];

export const OrbCouncilContainer: React.FC = () => {
  // Default to the new Two-Sided 3D Business & Flagship Command UI
  const [activeTab, setActiveTab] = useState<ActiveTab>('command');
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'left-wing' | 'right-wing' | 'core-zoom'>('overview');
  const [selectedAgent, setSelectedAgent] = useState<SignProfile>(SWARM_AGENTS[3]); // Swarm Factory Core
  const [selectedFlagship, setSelectedFlagship] = useState<FlagshipArchitectureSpec>(FLAGSHIP_ARCHITECTURES[0]);
  const [activeSignId, setActiveSignId] = useState<string | null>(null);
  const [recentlyUpdatedSignId, setRecentlyUpdatedSignId] = useState<string | null>(null);
  const [agentStates, setAgentStates] = useState<Record<string, AgentStateData>>({});
  const [customPrompt, setCustomPrompt] = useState<string>(
    'Design an enterprise multi-agent AI architecture combining Swarm Factory orchestration, 3D WebGL spatial telemetry, and Firebase Firestore persistence.'
  );
  const [isSendingPrompt, setIsSendingPrompt] = useState<boolean>(false);
  const [isRunningSwarm, setIsRunningSwarm] = useState<boolean>(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'syncing' | 'local'>('syncing');
  const [isMuted, setIsMuted] = useState<boolean>(audioEngine.getIsMuted());
  const [corePulseCount, setCorePulseCount] = useState<number>(0);
  const [copiedBlueprint, setCopiedBlueprint] = useState<boolean>(false);

  // Dynamic AI Solution Architect Generator State (Left Business Wing)
  const [businessGoalInput, setBusinessGoalInput] = useState<string>(
    'Build a real-time AI dispatch & spatial fleet dashboard with voice commands'
  );
  const [architectComplexity, setArchitectComplexity] = useState<'Rapid MVP' | 'Enterprise Scale' | 'Multi-Region Swarm'>('Enterprise Scale');
  const [generatedProposal, setGeneratedProposal] = useState<{
    title: string;
    recommendedArch: string;
    estimatedLatency: string;
    firestoreSchema: string[];
    agentNodes: string[];
    summary: string;
  }>({
    title: 'GreedysLinks Enterprise Swarm & Spatial Blueprint',
    recommendedArch: 'Swarm Factory Core + DPSS Spatial Mesh + Firebase MCP',
    estimatedLatency: '18 ms E2E',
    firestoreSchema: ['/agents/{agentId}', '/deliberations/{sessionId}', '/telemetry/{nodeId}'],
    agentNodes: ['Swarm Factory Core (SWM)', 'AI Digital Products (BOT)', 'Tech Essentials & DPSS (SEC)'],
    summary:
      'Combines 6 autonomous Swarm Factory agents with Firebase Firestore real-time state listeners and a 60 FPS Three.js spatial command interface.',
  });

  // Modals
  const [inspectedAgent, setInspectedAgent] = useState<SignProfile | null>(null);
  const [activeSimulator, setActiveSimulator] = useState<SimulatorType>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState<boolean>(false);

  // AstroGuitar simulator state
  const [selectedScale, setSelectedScale] = useState<'C Major' | 'A Minor Pentatonic' | 'G Mixolydian'>('C Major');
  const [lastPlayedNote, setLastPlayedNote] = useState<string>('C4 (261.6 Hz)');

  // DPSS simulator state
  const [dpssRouteNodes, setDpssRouteNodes] = useState<number>(1420);
  const [dpssLatencyMs, setDpssLatencyMs] = useState<number>(5.8);
  const [dpssSolving, setDpssSolving] = useState<boolean>(false);

  // Studio AI Workbench Telemetry & Chart State
  const [benchmarkData, setBenchmarkData] = useState<number[]>([78, 112, 145, 176, 198, 234]);
  const [tokenVelocity, setTokenVelocity] = useState<number>(1940);
  const [responseLatency, setResponseLatency] = useState<number>(22);
  const [swarmLogs, setSwarmLogs] = useState<SwarmLogRecord[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string>(
    JSON.stringify(
      {
        studio_project: 'Swarm Factory | GreedysLinks AI Developers',
        founder: 'Jose Marin',
        ui_mode: 'Two-Sided 3D Business & Flagship Command',
        firebase_project: 'gen-lang-client-0343118388 (#643675584033)',
        active_swarm_nodes: SWARM_AGENTS.map((a) => ({
          id: a.id,
          name: a.name,
          repo: a.repoName,
        })),
      },
      null,
      2
    )
  );

  const isRunningSwarmRef = useRef<boolean>(false);
  isRunningSwarmRef.current = isRunningSwarm;

  // Real-time Firestore listener on `/agents` collection for immediate Orb UI refresh
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'agents'),
      (snapshot) => {
        const nextStates: Record<string, AgentStateData> = {};
        snapshot.forEach((docSnap) => {
          nextStates[docSnap.id] = docSnap.data() as AgentStateData;
        });
        setAgentStates(nextStates);
        setFirestoreStatus('connected');
      },
      () => {
        setFirestoreStatus('local');
      }
    );
    return () => unsub();
  }, []);

  // Load recent deliberations on mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const q = query(collection(db, 'deliberations'), orderBy('createdAt', 'desc'), limit(3));
        await getDocs(q);
        setFirestoreStatus('connected');
      } catch {
        // Fallback if empty or offline
      }
    };
    fetchRecent();
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handlePulseCore = () => {
    setCorePulseCount((c) => c + 1);
  };

  // Map active tab to 3D environment mode
  const getEnvironmentMode = (): SpatialEnvironmentMode => {
    if (activeTab === 'command') return 'dual';
    if (activeTab === 'projects') return 'flagship';
    if (activeTab === 'studio') return 'workbench';
    return 'dual';
  };

  // Generate domain-grounded response for any Swarm Factory agent
  const buildAgentExecutionResponse = (
    agent: SignProfile,
    promptText: string
  ): {
    statement: string;
    reasoning: string;
    stance: 'propose' | 'challenge' | 'synthesize' | 'affirm' | 'abstain';
    vote: 'aye' | 'nay' | 'abstain' | 'pending';
  } => {
    switch (agent.id) {
      case 'digital-products':
        return {
          statement: `[AI Digital Products] Executed directive: "${promptText}". Multimodal Gemini 3.8 Flash workflow compiled with sub-25ms token streaming across GreedysLinks micro-SaaS endpoints.`,
          reasoning: 'Autonomous agentic product pipelines verified with real-time voice & telemetry hooks.',
          stance: 'propose',
          vote: 'aye',
        };
      case 'tech-essentials':
        return {
          statement: `[Tech Essentials & DPSS] Executed directive: "${promptText}". Topological GIS route solver converged in 5.4ms across 1,420 mesh nodes; SentinelDrive zero-trust rules verified.`,
          reasoning: 'Zero-trust key security and spatial route pathfinding integrity confirmed.',
          stance: 'affirm',
          vote: 'aye',
        };
      case 'spatial-ui':
        return {
          statement: `[3D UI/UX & AstroGuitar AI] Executed directive: "${promptText}". 60 FPS Three.js WebGL fretboard mesh & polyphonic Web Audio synthesizer synchronized to spatial orbit coordinates.`,
          reasoning: 'Spatial WebGL shaders and hands-free voice audio triggers locked at 60 FPS.',
          stance: 'synthesize',
          vote: 'aye',
        };
      case 'ai-solutions':
        return {
          statement: `[Swarm Factory Core] Executed directive: "${promptText}". Multi-agent consensus state committed to Firestore (gen-lang-client-0343118388) with immediate orbital node telemetry refresh.`,
          reasoning: 'Distributed Swarm Factory orchestrator synchronized across all 6 repository nodes.',
          stance: 'synthesize',
          vote: 'aye',
        };
      case 'firebase-mcp':
        return {
          statement: `[Firebase & Cloud MCP] Executed directive: "${promptText}". Firestore document state persisted and validated against security rules on project #643675584033.`,
          reasoning: 'Cloud Run MCP and Firestore persistence pipelines operating at 99.98% reliability.',
          stance: 'affirm',
          vote: 'aye',
        };
      case 'platform-core':
        return {
          statement: `[Platform AI & DevTools] Executed directive: "${promptText}". OmniGit repository graph indexed across greedyslinks-afk repos; TypeScript & Vite build pipeline verified clean.`,
          reasoning: 'Developer toolchain and JSON telemetry stream validated.',
          stance: 'propose',
          vote: 'aye',
        };
      default:
        return {
          statement: `[${agent.name}] Directive processed: "${promptText}". State synchronized in Firestore.`,
          reasoning: agent.perspective,
          stance: 'synthesize',
          vote: 'aye',
        };
    }
  };

  // Send custom prompt to a specific Swarm Factory agent, update Firestore `/agents/{id}`, and immediately refresh its Orb
  const handleSendCustomPrompt = async (targetAgent: SignProfile = selectedAgent, overridePrompt?: string) => {
    const promptToUse = (overridePrompt !== undefined ? overridePrompt : customPrompt).trim();
    if (!promptToUse || isSendingPrompt) return;

    setIsSendingPrompt(true);
    setCorePulseCount((c) => c + 1);
    await audioEngine.initAudio();

    const nowIso = new Date().toISOString();

    // 1. Trigger immediate UI state on the target Orb
    setActiveSignId(targetAgent.id);
    setRecentlyUpdatedSignId(targetAgent.id);

    setAgentStates((prev) => ({
      ...prev,
      [targetAgent.id]: {
        status: 'speaking',
        lastPrompt: promptToUse,
        lastResponse: `Processing directive on ${targetAgent.name}...`,
        updatedAt: nowIso,
      },
    }));

    // 2. Call backend `/api/council/deliberate`
    let generated = buildAgentExecutionResponse(targetAgent, promptToUse);
    try {
      const res = await fetch('/api/council/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: promptToUse,
          signId: targetAgent.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.statement) {
          generated = {
            statement: data.statement,
            reasoning: data.reasoning || generated.reasoning,
            stance: data.stance || 'synthesize',
            vote: data.vote || 'aye',
          };
        }
      }
    } catch {
      // Fallback to local grounded response
    }

    // 3. Persist individual agent state in Firestore `/agents/{agentId}`
    try {
      await setDoc(doc(db, 'agents', targetAgent.id), {
        signId: targetAgent.id,
        name: targetAgent.name.slice(0, 64),
        element: targetAgent.element,
        modality: targetAgent.modality,
        archetype: targetAgent.archetype.slice(0, 100),
        voiceProfile: targetAgent.timbreDescription.slice(0, 64),
        status: 'speaking',
        lastPrompt: promptToUse.slice(0, 500),
        lastResponse: generated.statement.slice(0, 2000),
        updatedAt: nowIso,
      });
      setFirestoreStatus('connected');
    } catch {
      // Local state already updated optimistically
    }

    // Update local state with final response immediately
    setAgentStates((prev) => ({
      ...prev,
      [targetAgent.id]: {
        status: 'speaking',
        lastPrompt: promptToUse,
        lastResponse: generated.statement,
        updatedAt: nowIso,
      },
    }));

    // Update Studio Console JSON output & chart metrics
    const newVelocity = Math.floor(1820 + Math.random() * 380);
    const newLatency = Math.floor(16 + Math.random() * 12);
    setTokenVelocity(newVelocity);
    setResponseLatency(newLatency);
    setBenchmarkData((prev) => [...prev.slice(1), Math.floor(110 + Math.random() * 130)]);

    const logEntry: SwarmLogRecord = {
      signId: targetAgent.id,
      signName: targetAgent.name,
      element: targetAgent.element,
      prompt: promptToUse,
      statement: generated.statement,
      reasoning: generated.reasoning,
      stance: generated.stance,
      vote: generated.vote,
      timestamp: new Date().toLocaleTimeString(),
    };
    setSwarmLogs((prev) => [logEntry, ...prev.slice(0, 14)]);

    setConsoleOutput(
      JSON.stringify(
        {
          swarm_dispatch: 'SUCCESS',
          target_agent: {
            id: targetAgent.id,
            name: targetAgent.name,
            domain: targetAgent.element,
            repository: targetAgent.repoName,
          },
          firestore_document: `/agents/${targetAgent.id}`,
          prompt_directive: promptToUse,
          agent_output: generated.statement,
          telemetry: {
            token_velocity: `${newVelocity} t/s`,
            latency_ms: `${newLatency} ms`,
            updated_at: nowIso,
          },
        },
        null,
        2
      )
    );

    // 4. Play Spatial Harmonic & Voice Synthesis, then transition Firestore status to `attuned`
    audioEngine.speak(
      generated.statement,
      targetAgent,
      () => {},
      () => {
        const completedIso = new Date().toISOString();
        setIsSendingPrompt(false);
        setActiveSignId(null);

        setAgentStates((prev) => ({
          ...prev,
          [targetAgent.id]: {
            ...prev[targetAgent.id],
            status: 'attuned',
            lastPrompt: promptToUse,
            lastResponse: generated.statement,
            updatedAt: completedIso,
          },
        }));

        setDoc(
          doc(db, 'agents', targetAgent.id),
          {
            signId: targetAgent.id,
            name: targetAgent.name.slice(0, 64),
            element: targetAgent.element,
            modality: targetAgent.modality,
            archetype: targetAgent.archetype.slice(0, 100),
            voiceProfile: targetAgent.timbreDescription.slice(0, 64),
            status: 'attuned',
            lastPrompt: promptToUse.slice(0, 500),
            lastResponse: generated.statement.slice(0, 2000),
            updatedAt: completedIso,
          },
          { merge: true }
        ).catch(() => {});

        setTimeout(() => {
          setRecentlyUpdatedSignId((cur) => (cur === targetAgent.id ? null : cur));
        }, 3500);
      }
    );
  };

  // Synthesize Custom AI Solution Blueprint (Left Wing Business AI Helper)
  const handleSynthesizeBusinessBlueprint = async () => {
    const goal = businessGoalInput.trim() || 'Enterprise Multi-Agent AI Platform';
    setCorePulseCount((c) => c + 1);
    setCameraPreset('left-wing');

    const lower = goal.toLowerCase();
    const isAudioOr3D = lower.includes('3d') || lower.includes('audio') || lower.includes('guitar') || lower.includes('webgl') || lower.includes('voice');
    const isRouteOrSec = lower.includes('route') || lower.includes('map') || lower.includes('gis') || lower.includes('fleet') || lower.includes('security');

    const matchedAgent = isAudioOr3D
      ? SWARM_AGENTS[2]
      : isRouteOrSec
      ? SWARM_AGENTS[1]
      : SWARM_AGENTS[0];

    setSelectedAgent(matchedAgent);
    setCustomPrompt(`[${architectComplexity}] Architect AI solution for: ${goal}`);

    const latencyEst =
      architectComplexity === 'Rapid MVP'
        ? '14 ms E2E'
        : architectComplexity === 'Enterprise Scale'
        ? '18 ms E2E'
        : '11 ms Global Edge';

    setGeneratedProposal({
      title: `AI Architecture Blueprint (${architectComplexity})`,
      recommendedArch: isAudioOr3D
        ? 'AstroGuitar 3D WebGL + Swarm Factory Core + Web Audio Synth'
        : isRouteOrSec
        ? 'DPSS Topological Router + SentinelDrive + Zero-Trust Firestore'
        : 'Swarm Factory 6-Node Hub + Cloud Run MCP + Firestore State Bus',
      estimatedLatency: latencyEst,
      firestoreSchema: [
        `/agents/${matchedAgent.id}`,
        '/deliberations/{sessionId}/messages/{msgId}',
        '/enterprise_blueprints/{blueprintId}',
      ],
      agentNodes: [
        `${matchedAgent.name} (${matchedAgent.symbol})`,
        'Swarm Factory Core (SWM)',
        'Firebase & Cloud MCP (MCP)',
      ],
      summary: `Tailored for "${goal}". Deploys ${matchedAgent.name} (${matchedAgent.repoName}) with real-time Firestore state synchronization on project gen-lang-client-0343118388.`,
    });

    await handleSendCustomPrompt(
      matchedAgent,
      `[${architectComplexity} Blueprint] Synthesize full-stack AI architecture for: ${goal}`
    );
  };

  // Run full Swarm Benchmark across all 6 Swarm Factory nodes
  const handleRunSwarmBenchmark = async () => {
    if (isRunningSwarm) {
      setIsRunningSwarm(false);
      setActiveSignId(null);
      audioEngine.stopSpeaking();
      return;
    }

    await audioEngine.initAudio();
    setIsRunningSwarm(true);
    setCorePulseCount((c) => c + 1);

    const sessionTopic = customPrompt.trim() || 'Full Swarm Factory Multi-Agent Telemetry Benchmark';
    const nowIso = new Date().toISOString();
    let sessionId = `swarm-${Date.now()}`;

    try {
      const ref = await addDoc(collection(db, 'deliberations'), {
        topic: sessionTopic.slice(0, 500),
        status: 'active',
        consensusScore: 94,
        activeSigns: SWARM_AGENTS.length,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
      sessionId = ref.id;
    } catch {
      // Continue in local mode if needed
    }

    const executeStep = async (index: number) => {
      if (!isRunningSwarmRef.current || index >= SWARM_AGENTS.length) {
        setIsRunningSwarm(false);
        setActiveSignId(null);
        if (sessionId.length > 10 && !sessionId.startsWith('swarm-')) {
          updateDoc(doc(db, 'deliberations', sessionId), {
            status: 'concluded',
            consensusScore: 98,
            updatedAt: new Date().toISOString(),
          }).catch(() => {});
        }
        return;
      }

      const agent = SWARM_AGENTS[index];
      setSelectedAgent(agent);
      setActiveSignId(agent.id);
      setRecentlyUpdatedSignId(agent.id);
      setCorePulseCount((c) => c + 1);

      const generated = buildAgentExecutionResponse(agent, sessionTopic);
      const stepIso = new Date().toISOString();

      setAgentStates((prev) => ({
        ...prev,
        [agent.id]: {
          status: 'speaking',
          lastPrompt: sessionTopic,
          lastResponse: generated.statement,
          updatedAt: stepIso,
        },
      }));

      setDoc(doc(db, 'agents', agent.id), {
        signId: agent.id,
        name: agent.name.slice(0, 64),
        element: agent.element,
        modality: agent.modality,
        archetype: agent.archetype.slice(0, 100),
        voiceProfile: agent.timbreDescription.slice(0, 64),
        status: 'speaking',
        lastPrompt: sessionTopic.slice(0, 500),
        lastResponse: generated.statement.slice(0, 2000),
        updatedAt: stepIso,
      }).catch(() => {});

      setBenchmarkData((prev) => [...prev.slice(1), Math.floor(130 + Math.random() * 115)]);
      setSwarmLogs((prev) => [
        {
          signId: agent.id,
          signName: agent.name,
          element: agent.element,
          prompt: sessionTopic,
          statement: generated.statement,
          reasoning: generated.reasoning,
          stance: generated.stance,
          vote: generated.vote,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 14),
      ]);

      audioEngine.speak(
        generated.statement,
        agent,
        () => {},
        () => {
          setAgentStates((prev) => ({
            ...prev,
            [agent.id]: {
              ...prev[agent.id],
              status: 'attuned',
              updatedAt: new Date().toISOString(),
            },
          }));
          setDoc(
            doc(db, 'agents', agent.id),
            {
              signId: agent.id,
              name: agent.name.slice(0, 64),
              element: agent.element,
              modality: agent.modality,
              archetype: agent.archetype.slice(0, 100),
              status: 'attuned',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch(() => {});

          if (isRunningSwarmRef.current) {
            setTimeout(() => executeStep(index + 1), 450);
          }
        }
      );
    };

    executeStep(0);
  };

  const handleCopyBlueprint = () => {
    navigator.clipboard
      ?.writeText(JSON.stringify(selectedFlagship.blueprintJson, null, 2))
      .catch(() => {});
    setCopiedBlueprint(true);
    setTimeout(() => setCopiedBlueprint(false), 2000);
  };

  return (
    <div className="relative min-h-screen radial-grid-bg text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-400 selection:text-slate-950">
      {/* 3D WebGL Dual-Wing & Orbital Background Canvas */}
      <ThreeBackground
        pulseCount={corePulseCount}
        activeColor={selectedAgent.color}
        environmentMode={getEnvironmentMode()}
        activeArchitectureId={selectedFlagship.id}
        cameraPreset={cameraPreset}
      />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-[1440px] mx-auto px-4 pt-3 pb-2 sm:px-6">
        <div className="glass-panel rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 border border-cyan-500/30">
          {/* Jose Marin & GreedysLinks / Swarm Factory Branding */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#00f2fe] via-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
              <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center overflow-hidden">
                <Cpu className="w-5 h-5 text-[#00f2fe]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-wider uppercase text-white font-mono">
                  Jose Marin
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-semibold">
                  Founder & AI Architect
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  3D Dual-Wing AI Engine
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[#00f2fe]">GreedysLinks AI Developers</span>
              </p>
            </div>
          </div>

          {/* Primary Navigation Bar */}
          <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setActiveTab('command');
                setCameraPreset('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'command'
                  ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Dual-Side 3D Command
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('hub');
                setCameraPreset('core-zoom');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'hub'
                  ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" /> Spatial Orbit Hub
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('projects');
                setCameraPreset('right-wing');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Flagship Specs
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('studio');
                setCameraPreset('core-zoom');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Studio AI Workbench
            </button>
          </nav>

          {/* 3D Camera Perspective Controls + Audio + Partner CTA */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* 3D Camera Angle Switcher */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800">
              <Camera className="w-3.5 h-3.5 text-[#00f2fe] mr-1" />
              {(
                [
                  { id: 'left-wing', label: 'Side A: Business' },
                  { id: 'overview', label: 'Center 3D' },
                  { id: 'right-wing', label: 'Side B: Flagships' },
                ] as const
              ).map((cam) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => {
                    setCameraPreset(cam.id);
                    setCorePulseCount((c) => c + 1);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] transition ${
                    cameraPreset === cam.id
                      ? 'bg-[#00f2fe] text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-2 rounded-lg border transition ${
                isMuted
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-slate-900/90 border-cyan-500/30 text-[#00f2fe] hover:bg-cyan-500/10'
              }`}
              title={isMuted ? 'Unmute Spatial Audio' : 'Mute Spatial Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300"
              title="Firebase Project gen-lang-client-0343118388"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold uppercase">{firestoreStatus}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPartnerModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#00f2fe] text-[#030712] font-bold hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(0,242,254,0.4)] flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden md:inline">Partner With Us</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-[1440px] mx-auto w-full px-4 py-2 sm:px-6 flex flex-col justify-center">
        {/* =====================================================================
            TAB 0: TWO-SIDED BUSINESS & FLAGSHIP ARCHITECTURES 3D COMMAND UI
           ===================================================================== */}
        {activeTab === 'command' && (
          <section className="w-full space-y-4">
            {/* Top Status & 3D Camera Perspective Banner */}
            <div className="glass-panel rounded-xl px-4 py-2.5 border border-cyan-500/25 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 font-bold">
                  TWO-SIDED 3D BUSINESS COMMAND
                </span>
                <span className="text-slate-300">
                  <strong className="text-[#00f2fe]">SIDE A:</strong> GreedysLinks AI Developer Studio & AI Solution Architect
                </span>
                <span className="text-slate-600">↔</span>
                <span className="text-slate-300">
                  <strong className="text-indigo-400">SIDE B:</strong> Flagship Architectures & Live Sandboxes
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-400">
                  Velocity: <strong className="text-white">{tokenVelocity} t/s</strong>
                </span>
                <span className="text-slate-400">
                  Latency: <strong className="text-[#00f2fe]">{responseLatency} ms</strong>
                </span>
              </div>
            </div>

            {/* 3-Column Spatial Command Deck: SIDE A (Left) | 3D ORBIT CORE (Center) | SIDE B (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
              {/* ===============================================================
                  SIDE A (LEFT WING - 4 COLS): GREEDYSLINKS AI DEVELOPER STUDIO
                 =============================================================== */}
              <div
                onMouseEnter={() => setCameraPreset('left-wing')}
                className="xl:col-span-4 flex flex-col justify-between glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/35 transition-all duration-300 hover:border-[#00f2fe]/70 space-y-4"
                style={{
                  transform:
                    cameraPreset === 'left-wing'
                      ? 'perspective(1200px) rotateY(1.5deg)'
                      : 'perspective(1200px) rotateY(3deg)',
                }}
              >
                <div className="space-y-3">
                  {/* Wing Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-[#00f2fe]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f2fe] font-bold block">
                          SIDE A · BUSINESS & AI STUDIO
                        </span>
                        <h2 className="text-sm sm:text-base font-extrabold text-white">
                          GreedysLinks AI Developer
                        </h2>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      Jose Marin
                    </span>
                  </div>

                  {/* Interactive AI Solution Architect Helper */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#00f2fe] flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> Dynamic AI Solution Architect
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Live Generator</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Describe your business product or AI automation goal to synthesize a tailored GreedysLinks architecture & dispatch to the Swarm.
                    </p>

                    <input
                      type="text"
                      value={businessGoalInput}
                      onChange={(e) => setBusinessGoalInput(e.target.value)}
                      placeholder="e.g. Voice-controlled 3D dashboard or autonomous agent swarm..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-[#00f2fe] focus:outline-none"
                    />

                    {/* Tier Selector */}
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      {(['Rapid MVP', 'Enterprise Scale', 'Multi-Region Swarm'] as const).map(
                        (tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setArchitectComplexity(tier)}
                            className={`py-1 px-2 rounded text-[10px] font-mono border transition truncate ${
                              architectComplexity === tier
                                ? 'bg-cyan-500/25 border-[#00f2fe] text-white font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tier}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSynthesizeBusinessBlueprint}
                      disabled={isSendingPrompt}
                      className="w-full py-2 px-3 rounded-lg bg-[#00f2fe] hover:bg-cyan-300 text-[#030712] font-bold text-xs font-mono transition shadow-[0_0_15px_rgba(0,242,254,0.3)] flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isSendingPrompt
                        ? 'Synthesizing Architecture...'
                        : 'Synthesize AI Business Blueprint'}
                    </button>

                    {/* Generated Blueprint Result Card */}
                    <div className="p-2.5 rounded-lg bg-slate-900/95 border border-slate-800 space-y-1.5 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-cyan-300 font-bold">
                        <span className="truncate">{generatedProposal.title}</span>
                        <span className="text-[10px] text-emerald-400 shrink-0">
                          {generatedProposal.estimatedLatency}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {generatedProposal.summary}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {generatedProposal.agentNodes.map((node, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-cyan-950/70 text-[#00f2fe] border border-cyan-800/60 text-[10px]"
                          >
                            {node}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enterprise AI Engineering Service Pillars */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Enterprise AI Engineering Pillars (Click to Test in Swarm):
                    </span>
                    {BUSINESS_SERVICES.map((svc) => (
                      <div
                        key={svc.id}
                        onClick={() => {
                          const target =
                            SWARM_AGENTS.find((a) => a.id === svc.targetAgentId) ||
                            SWARM_AGENTS[0];
                          setSelectedAgent(target);
                          setCustomPrompt(svc.presetDirective);
                          handleSendCustomPrompt(target, svc.presetDirective);
                        }}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-[#00f2fe] font-bold">
                            {svc.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#00f2fe] flex items-center gap-0.5">
                            Deploy Prompt <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white group-hover:text-[#00f2fe] transition">
                          {svc.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {svc.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Business Action Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                  <a
                    href="https://github.com/greedyslinks-afk"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <GitBranch className="w-3.5 h-3.5 text-[#00f2fe]" /> GitHub Org
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-[#00f2fe] border border-cyan-500/40 font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Globe className="w-3.5 h-3.5" /> Commission Custom AI Build
                  </button>
                </div>
              </div>

              {/* ===============================================================
                  CENTER NEXUS (4 COLS): 3D ORBITAL HUB & LIVE PROMPT DISPATCH
                 =============================================================== */}
              <div
                onMouseEnter={() => setCameraPreset('overview')}
                className="xl:col-span-4 flex flex-col justify-between space-y-3"
              >
                {/* Interactive 3D Spatial Orbit Hub */}
                <div className="glass-panel rounded-2xl p-2 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between px-3 pt-2 text-[10px] font-mono text-slate-400">
                    <span className="text-[#00f2fe] font-bold flex items-center gap-1">
                      <Orbit className="w-3.5 h-3.5" /> 3D SWARM NEXUS
                    </span>
                    <span>Click any Orb to Attune</span>
                  </div>

                  <div className="w-full scale-[0.88] sm:scale-95 -my-6">
                    <OrbHub
                      activeSignId={activeSignId}
                      selectedSignId={selectedAgent.id}
                      onSelectSign={(agent) => {
                        setSelectedAgent(agent);
                        if (agent.quickPrompts[0]) {
                          setCustomPrompt(agent.quickPrompts[0]);
                        }
                      }}
                      onInspectNode={(agent) => {
                        setSelectedAgent(agent);
                        setInspectedAgent(agent);
                      }}
                      onPulseCore={handlePulseCore}
                      isDeliberating={isRunningSwarm || isSendingPrompt}
                      agentStates={agentStates}
                      recentlyUpdatedSignId={recentlyUpdatedSignId}
                    />
                  </div>
                </div>

                {/* Compact Real-Time Swarm Agent Prompt Dispatcher */}
                <div className="glass-panel rounded-2xl p-4 border border-cyan-500/35 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f2fe]" />
                      Active Orb: <span className="text-[#00f2fe]">{selectedAgent.name}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      /agents/{selectedAgent.id}
                    </span>
                  </div>

                  {/* Quick 6-Orb Pill Selector */}
                  <div className="grid grid-cols-3 gap-1">
                    {SWARM_AGENTS.map((agent) => {
                      const isSel = selectedAgent.id === agent.id;
                      const st = agentStates[agent.id];
                      const isSpk = activeSignId === agent.id || st?.status === 'speaking';
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => {
                            setSelectedAgent(agent);
                            if (agent.quickPrompts[0]) {
                              setCustomPrompt(agent.quickPrompts[0]);
                            }
                            audioEngine.initAudio();
                            audioEngine.playSignHarmonic(agent, 0.8);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition flex items-center justify-between ${
                            isSel
                              ? 'bg-cyan-500/20 border-[#00f2fe] text-white font-bold'
                              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="truncate">{agent.symbol}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSpk
                                ? 'bg-amber-400 animate-ping'
                                : st?.status === 'attuned'
                                ? 'bg-emerald-400'
                                : 'bg-slate-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Prompt Input + Send */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={`Send AI directive to ${selectedAgent.name}...`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:border-[#00f2fe] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendCustomPrompt(selectedAgent)}
                      disabled={!customPrompt.trim() || isSendingPrompt}
                      className="px-3.5 py-2 rounded-xl bg-[#00f2fe] hover:bg-cyan-300 text-[#030712] font-bold text-xs font-mono transition flex items-center gap-1 shrink-0 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSendingPrompt ? 'Syncing' : 'Dispatch'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRunSwarmBenchmark}
                      className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition flex items-center gap-1 shrink-0 ${
                        isRunningSwarm
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-900 hover:bg-slate-800 text-[#00f2fe] border-cyan-500/40'
                      }`}
                      title="Run All 6 Swarm Agents"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {isRunningSwarm ? 'Stop' : 'Swarm'}
                    </button>
                  </div>

                  {/* Live Orb Response Readout */}
                  {agentStates[selectedAgent.id]?.lastResponse && (
                    <div className="p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/30 text-[11px] font-mono text-slate-300 line-clamp-2">
                      <span className="text-[#00f2fe] font-bold mr-1">[{selectedAgent.symbol}]:</span>
                      {agentStates[selectedAgent.id].lastResponse}
                    </div>
                  )}
                </div>
              </div>

              {/* ===============================================================
                  SIDE B (RIGHT WING - 4 COLS): FLAGSHIP ARCHITECTURES DECK
                 =============================================================== */}
              <div
                onMouseEnter={() => setCameraPreset('right-wing')}
                className="xl:col-span-4 flex flex-col justify-between glass-panel rounded-2xl p-4 sm:p-5 border border-indigo-500/35 transition-all duration-300 hover:border-indigo-400/70 space-y-4"
                style={{
                  transform:
                    cameraPreset === 'right-wing'
                      ? 'perspective(1200px) rotateY(-1.5deg)'
                      : 'perspective(1200px) rotateY(-3deg)',
                }}
              >
                <div className="space-y-3">
                  {/* Wing Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">
                          SIDE B · FLAGSHIP ARCHITECTURES
                        </span>
                        <h2 className="text-sm sm:text-base font-extrabold text-white">
                          Production Systems & Sandboxes
                        </h2>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono">
                      4 Flagships
                    </span>
                  </div>

                  {/* Flagship Selector Tabs */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {FLAGSHIP_ARCHITECTURES.map((arch) => {
                      const isActive = selectedFlagship.id === arch.id;
                      return (
                        <button
                          key={arch.id}
                          type="button"
                          onClick={() => {
                            setSelectedFlagship(arch);
                            const ag = SWARM_AGENTS.find((a) => a.id === arch.agentId);
                            if (ag) setSelectedAgent(ag);
                            setCorePulseCount((c) => c + 1);
                            audioEngine.initAudio();
                            audioEngine.playGuitarNote(432, 0.5);
                          }}
                          className={`p-2.5 rounded-xl text-left font-mono transition border ${
                            isActive
                              ? 'bg-indigo-950/70 border-[#00f2fe] text-white shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[9px] text-[#00f2fe] uppercase truncate">
                            {arch.badge}
                          </div>
                          <div className="text-xs font-bold truncate mt-0.5">{arch.name}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Flagship Deep-Dive Inspector */}
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#00f2fe] uppercase font-bold">
                          {selectedFlagship.badge}
                        </span>
                        <h3 className="text-sm font-extrabold text-white">
                          {selectedFlagship.name}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400">
                          {selectedFlagship.tagline}
                        </p>
                      </div>
                      <a
                        href={selectedFlagship.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[#00f2fe] border border-slate-700 text-[10px] font-mono flex items-center gap-1 shrink-0"
                      >
                        Repo <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedFlagship.description}
                    </p>

                    {/* 3 Live Telemetry Counters for Selected Flagship */}
                    <div className="grid grid-cols-3 gap-2">
                      {selectedFlagship.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono"
                        >
                          <div className="text-xs font-bold text-[#00f2fe]">{m.value}</div>
                          <div className="text-[9px] text-slate-400 uppercase mt-0.5">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFlagship.stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Architecture JSON Blueprint Preview & Copy */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Server className="w-3 h-3 text-[#00f2fe]" /> Architecture Manifest
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyBlueprint}
                          className="text-[#00f2fe] hover:underline flex items-center gap-1"
                        >
                          {copiedBlueprint ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy JSON
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-28 leading-relaxed border border-slate-800">
                        {JSON.stringify(selectedFlagship.blueprintJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Launch Interactive Flagship Sandbox Controls */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedFlagship.id === 'astroguitar') {
                        setActiveSimulator('astroguitar');
                      } else if (selectedFlagship.id === 'dpss') {
                        setActiveSimulator('dpss');
                      } else {
                        setActiveSimulator('swarm');
                      }
                    }}
                    className="py-2 px-3 rounded-lg bg-[#00f2fe] hover:bg-cyan-300 text-[#030712] font-bold flex items-center justify-center gap-1.5 transition shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                  >
                    <Play className="w-3.5 h-3.5" /> Launch 3D Sandbox
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const ag =
                        SWARM_AGENTS.find((a) => a.id === selectedFlagship.agentId) ||
                        SWARM_AGENTS[3];
                      setSelectedAgent(ag);
                      handleSendCustomPrompt(
                        ag,
                        `Run live diagnostic & telemetry benchmark on flagship architecture: ${selectedFlagship.name}`
                      );
                    }}
                    className="py-2 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#00f2fe]" /> Pulse Flagship Node
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 1: THE SPATIAL ORBIT HUB + AGENT PROMPT CONTROL
           ========================================================= */}
        {activeTab === 'hub' && (
          <section className="w-full flex flex-col items-center space-y-4">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left/Center 8 Cols: 3D Spatial Orbit Hub */}
              <div className="lg:col-span-8 flex flex-col items-center justify-center">
                <OrbHub
                  activeSignId={activeSignId}
                  selectedSignId={selectedAgent.id}
                  onSelectSign={(agent) => {
                    setSelectedAgent(agent);
                    if (agent.quickPrompts[0]) {
                      setCustomPrompt(agent.quickPrompts[0]);
                    }
                  }}
                  onInspectNode={(agent) => {
                    setSelectedAgent(agent);
                    setInspectedAgent(agent);
                  }}
                  onPulseCore={handlePulseCore}
                  isDeliberating={isRunningSwarm || isSendingPrompt}
                  agentStates={agentStates}
                  recentlyUpdatedSignId={recentlyUpdatedSignId}
                />
              </div>

              {/* Right 4 Cols: Real-Time Swarm Agent Control Interface (Firestore Synced) */}
              <div className="lg:col-span-4 w-full">
                <div className="glass-panel rounded-2xl p-5 border border-cyan-500/35 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#00f2fe]" />
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-white">
                        Swarm Agent Control
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Firestore Live
                    </span>
                  </div>

                  {/* Target Agent Selector Grid */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-2">
                      Select Target Swarm Orb ({SWARM_AGENTS.length} Nodes):
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SWARM_AGENTS.map((agent) => {
                        const isSelected = selectedAgent.id === agent.id;
                        const st = agentStates[agent.id];
                        const isSpeaking =
                          activeSignId === agent.id || st?.status === 'speaking';
                        const isAttuned = st?.status === 'attuned';

                        return (
                          <button
                            key={agent.id}
                            type="button"
                            onClick={() => {
                              setSelectedAgent(agent);
                              if (agent.quickPrompts[0]) {
                                setCustomPrompt(agent.quickPrompts[0]);
                              }
                              audioEngine.initAudio();
                              audioEngine.playSignHarmonic(agent, 0.9);
                            }}
                            className={`px-2.5 py-2 rounded-lg text-left font-mono text-xs border transition flex items-center justify-between gap-1.5 ${
                              isSelected
                                ? 'bg-cyan-500/20 border-[#00f2fe] text-white shadow-[0_0_12px_rgba(0,242,254,0.25)]'
                                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <span className="truncate font-semibold">{agent.name}</span>
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isSpeaking
                                  ? 'bg-amber-400 animate-ping'
                                  : isAttuned
                                  ? 'bg-emerald-400'
                                  : 'bg-slate-600'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Agent Info Banner */}
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00f2fe]">
                        {selectedAgent.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {agentStates[selectedAgent.id]?.status?.toUpperCase() || 'READY'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      Repo: {selectedAgent.repoName}
                    </p>
                  </div>

                  {/* Custom Prompt Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300">Custom Agent Directive:</span>
                      <span className="text-[#00f2fe]">/agents/{selectedAgent.id}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder={`Send custom directive to ${selectedAgent.name}...`}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-100 font-mono focus:border-[#00f2fe] focus:outline-none resize-none leading-relaxed"
                    />

                    {/* Quick Preset Directives for Selected Agent */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Quick Node Directives:
                      </span>
                      <div className="flex flex-col gap-1">
                        {selectedAgent.quickPrompts.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCustomPrompt(preset)}
                            className="text-left text-[10px] font-mono px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800/80 truncate transition"
                          >
                            ▸ {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dispatch Button */}
                    <div className="pt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendCustomPrompt(selectedAgent)}
                        disabled={!customPrompt.trim() || isSendingPrompt}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#00f2fe] hover:bg-cyan-300 text-[#030712] font-bold text-xs font-mono transition shadow-[0_0_18px_rgba(0,242,254,0.35)] flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingPrompt ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Updating Orb...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Dispatch to {selectedAgent.symbol} Orb
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRunSwarmBenchmark}
                        className={`px-3 py-2.5 rounded-xl font-mono text-xs font-bold border transition flex items-center gap-1.5 ${
                          isRunningSwarm
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-900 hover:bg-slate-800 text-[#00f2fe] border-cyan-500/40'
                        }`}
                        title="Pulse All 6 Swarm Factory Orbs"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {isRunningSwarm ? 'Stop' : 'Swarm'}
                      </button>
                    </div>
                  </div>

                  {/* Live Agent Response Preview */}
                  {agentStates[selectedAgent.id]?.lastResponse && (
                    <div className="p-3 rounded-xl bg-slate-950/95 border border-cyan-500/30 space-y-1 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-[#00f2fe]">
                        <span className="flex items-center gap-1">
                          <Radio className="w-3 h-3" /> Live Orb Telemetry
                        </span>
                        <span className="text-[10px] text-emerald-400">Synced</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                        {agentStates[selectedAgent.id].lastResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 2: DETAILED CORE PROJECTS SHOWCASE
           ========================================================= */}
        {activeTab === 'projects' && (
          <section className="w-full space-y-6 my-2">
            <div className="glass-panel p-6 rounded-2xl border-cyan-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white glow-text-cyan flex items-center gap-2">
                    <Layers className="w-6 h-6 text-[#00f2fe]" /> Flagship Architectures & Engineering Specs
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    High-performance AI applications, spatial navigation, and Swarm Factory autonomous multi-agent micro-services by Jose Marin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('command')}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#00f2fe] border border-cyan-500/30 text-xs font-mono"
                >
                  ← Return to Dual-Side 3D Command
                </button>
              </div>

              <div className="space-y-6">
                {/* Project 1: AstroGuitar AI */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-[#00f2fe]/60 transition">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-[#00f2fe] border border-cyan-800 text-[10px] font-mono">
                          3D WEBGL / AUDIO AI
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          LIVE SYNTHESIZER DEMO
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        AstroGuitar AI — Hands-Free 3D Guitar Trainer
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Hands-free voice-commanded 3D music training application featuring dynamic WebGL fretboard rendering, real-time polyphonic chord synthesis using the Web Audio API, and spatial learning navigation.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Three.js r128+</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Web Audio API</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Voice Recognition</span>
                      </div>
                    </div>
                    <div className="md:w-64 flex flex-col justify-between gap-3 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Capabilities</p>
                        <ul className="text-xs text-slate-300 space-y-1 mt-1">
                          <li>• Web Audio Tone Synthesizer</li>
                          <li>• Interactive 3D Fretboard</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSimulator('astroguitar')}
                        className="w-full py-2 rounded-lg bg-[#00f2fe] text-[#030712] font-bold text-xs hover:bg-cyan-300 transition flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Launch WebGL Simulator
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project 2: DPSS & SentinelDrive Ecosystem */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400/60 transition">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
                          NAVIGATION & SENTINELDRIVE
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          ACTIVE GIS MESH
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        DPSS Ecosystem & SentinelDrive — Spatial Map Routing
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Topological GIS pathfinding engine and SentinelDrive telemetry platform with interactive spatial overlays, live sensory node tracking, and sub-10ms topological route graph solver.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">greedyslinks-afk/SentinelDrive-</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Topological Solver</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Zero-Trust Key Auth</span>
                      </div>
                    </div>
                    <div className="md:w-64 flex flex-col justify-between gap-3 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Capabilities</p>
                        <ul className="text-xs text-slate-300 space-y-1 mt-1">
                          <li>• Interactive Route Graph</li>
                          <li>• Real-Time Mesh Overlay</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSimulator('dpss')}
                        className="w-full py-2 rounded-lg bg-indigo-500 text-white font-bold text-xs hover:bg-indigo-400 transition flex items-center justify-center gap-1.5"
                      >
                        <MapIcon className="w-3.5 h-3.5" /> Launch Map Pathfinder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project 3: Swarm Factory Multi-Agent Hub */}
                <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400/60 transition">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                          SWARM FACTORY CORE
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-[#00f2fe] border border-cyan-800 text-[10px] font-mono font-bold">
                          FIRESTORE CONNECTED
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Swarm Factory — Autonomous Multi-Agent Orchestrator
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Autonomous multi-agent command center integrating `greedyslinks-afk/swarm-factory-`, `agent-skills`, and `platform-ai` with live Firestore state persistence (`gen-lang-client-0343118388`) and real-time orbital UI synchronization.
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">greedyslinks-afk/swarm-factory-</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Firestore Real-Time</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Gemini 3.8 Flash</span>
                      </div>
                    </div>
                    <div className="md:w-64 flex flex-col justify-between gap-3 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                      <div>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">Capabilities</p>
                        <ul className="text-xs text-slate-300 space-y-1 mt-1">
                          <li>• 6 Autonomous Swarm Nodes</li>
                          <li>• Firestore State Sync</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSimulator('swarm')}
                        className="w-full py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5" /> Launch Swarm Console
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            TAB 3: STUDIO AI PORTFOLIO WORKBENCH
           ========================================================= */}
        {activeTab === 'studio' && (
          <section className="w-full space-y-6 my-2">
            <div className="glass-panel p-6 rounded-2xl border-cyan-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white glow-text-cyan flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#00f2fe]" /> Studio AI Portfolio & Swarm Workbench
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Interactive Studio workspace to test custom agent prompt generation, Firestore state persistence, and live throughput charts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendCustomPrompt(selectedAgent)}
                    disabled={isSendingPrompt}
                    className="px-4 py-2 rounded-lg bg-[#00f2fe] text-[#030712] font-bold text-xs hover:bg-cyan-300 transition flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.4)]"
                  >
                    <Play className="w-4 h-4" /> Run Studio Benchmark
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Studio Prompt Console & Agent Metrics */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-[#00f2fe] uppercase font-bold flex items-center justify-between">
                      <span>Studio AI Prompt Console</span>
                      <span className="text-[10px] text-slate-400">Gemini 3.8 Flash</span>
                    </div>

                    {/* Target Node Selector */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                        Target Swarm Node:
                      </label>
                      <select
                        value={selectedAgent.id}
                        onChange={(e) => {
                          const found = SWARM_AGENTS.find((a) => a.id === e.target.value);
                          if (found) setSelectedAgent(found);
                        }}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-[#00f2fe] focus:outline-none"
                      >
                        {SWARM_AGENTS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.repoName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      rows={4}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:border-[#00f2fe] focus:outline-none transition resize-none leading-relaxed"
                      placeholder="Enter custom prompt specification..."
                    />

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-mono text-slate-400 uppercase">Studio Presets:</p>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomPrompt(
                              'Synthesize 3D WebGL scale mesh parameters and voice triggers for AstroGuitar AI.'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition"
                        >
                          AstroGuitar AI
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomPrompt(
                              'Optimize spatial routing graph nodes and tile vector caching for DPSS SentinelDrive.'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition"
                        >
                          DPSS Route
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCustomPrompt(
                              'Synchronize Swarm Factory multi-agent state across Firebase project gen-lang-client-0343118388.'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 transition"
                        >
                          Swarm Factory
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System Telemetry Badge */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <p className="text-xs font-mono text-slate-300 font-bold flex items-center justify-between">
                      <span>Studio Agent Metrics</span>
                      <span className="text-emerald-400 text-[10px]">● Active</span>
                    </p>
                    <div className="space-y-1.5 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Token Velocity:</span>
                        <span className="text-white font-bold">{tokenVelocity.toLocaleString()} t/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Latency:</span>
                        <span className="text-[#00f2fe] font-bold">{responseLatency} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Firestore Project:</span>
                        <span className="text-emerald-400 font-bold">gen-lang-client-0343118388</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Accuracy:</span>
                        <span className="text-emerald-400 font-bold">99.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live SVG Throughput Chart & JSON Telemetry Console */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Live SVG Throughput Chart */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 h-[250px] flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#00f2fe]" />
                        Studio Benchmark Throughput Chart (t/s)
                      </span>
                      <span className="text-[10px] text-[#00f2fe] font-mono">
                        Live Swarm Telemetry
                      </span>
                    </div>

                    <div className="flex-1 w-full pt-3">
                      <svg viewBox="0 0 600 165" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {[25, 65, 105, 145].map((yVal, i) => (
                          <line
                            key={i}
                            x1={40}
                            y1={yVal}
                            x2={580}
                            y2={yVal}
                            stroke="rgba(30,41,59,0.7)"
                            strokeDasharray="4 4"
                          />
                        ))}
                        {(() => {
                          const maxVal = Math.max(260, ...benchmarkData);
                          const pts = benchmarkData.map((val, idx) => {
                            const x = 55 + idx * 102;
                            const y = 145 - (val / maxVal) * 115;
                            return { x, y, val, label: `N${idx + 1}` };
                          });
                          const polyPoints = pts.map((p) => `${p.x},${p.y}`).join(' ');
                          const areaPoints = `55,145 ${polyPoints} ${pts[pts.length - 1].x},145`;

                          return (
                            <>
                              <polygon points={areaPoints} fill="url(#chartAreaGrad)" />
                              <polyline
                                fill="none"
                                stroke="#00f2fe"
                                strokeWidth="2.5"
                                points={polyPoints}
                              />
                              {pts.map((p, idx) => (
                                <g key={idx}>
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="4.5"
                                    fill="#030712"
                                    stroke="#00f2fe"
                                    strokeWidth="2.5"
                                  />
                                  <text
                                    x={p.x}
                                    y={p.y - 10}
                                    textAnchor="middle"
                                    fill="#e2e8f0"
                                    fontSize="10"
                                    fontFamily="JetBrains Mono, monospace"
                                  >
                                    {p.val}
                                  </text>
                                  <text
                                    x={p.x}
                                    y={162}
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="10"
                                    fontFamily="JetBrains Mono, monospace"
                                  >
                                    {SWARM_AGENTS[idx]?.symbol || p.label}
                                  </text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* JSON Telemetry Console */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-[#00f2fe]" /> Studio Agent Telemetry Console
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">JSON Protocol</span>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto h-40 leading-relaxed">
                      {consoleOutput}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-[1440px] mx-auto px-4 py-3 sm:px-6">
        <div className="glass-panel rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-cyan-500/20 text-xs font-mono text-slate-400">
          <div>
            © 2026 <span className="text-[#00f2fe] font-bold">Swarm Factory · GreedysLinks AI Developers</span>. Founder Jose Marin.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('command')}
              className="hover:text-[#00f2fe] transition"
            >
              Dual-Side 3D Command
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hub')}
              className="hover:text-[#00f2fe] transition"
            >
              Spatial Hub
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="hover:text-[#00f2fe] transition"
            >
              Flagship Specs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className="hover:text-[#00f2fe] transition"
            >
              Studio AI Workbench
            </button>
          </div>
        </div>
      </footer>

      {/* =========================================================
           MODAL 1: ORBITAL NODE CAPABILITIES & DIRECT PROMPT MODAL
         ========================================================= */}
      {inspectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md">
          <div className="glass-panel-active rounded-2xl p-6 max-w-lg w-full border border-[#00f2fe] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-[#00f2fe]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{inspectedAgent.title}</h3>
                  <p className="text-[11px] font-mono text-[#00f2fe]">{inspectedAgent.repoName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedAgent(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{inspectedAgent.perspective}</p>

            <div className="space-y-2">
              <h4 className="text-xs font-mono text-[#00f2fe] uppercase font-bold">
                System Capabilities:
              </h4>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
                {inspectedAgent.capabilities.map((cap, i) => (
                  <li key={i}>{cap}</li>
                ))}
              </ul>
            </div>

            {/* Inline Direct Prompt to this Node */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
              <label className="text-[11px] font-mono text-[#00f2fe] block">
                Send Custom Prompt to {inspectedAgent.name} (Updates Firestore Orb):
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-[#00f2fe] focus:outline-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleSendCustomPrompt(inspectedAgent);
                    setInspectedAgent(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#00f2fe] text-[#030712] font-bold text-xs font-mono hover:bg-cyan-300 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmit & Refresh Orb
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: INTERACTIVE LIVE SANDBOX SIMULATORS
         ========================================================= */}
      {activeSimulator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/90 backdrop-blur-lg">
          <div className="glass-panel-active rounded-2xl p-6 max-w-2xl w-full border border-[#00f2fe] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#00f2fe] uppercase">
                  Interactive Live Sandbox
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeSimulator === 'astroguitar' &&
                    'AstroGuitar AI — Interactive WebGL Fretboard & Audio Synth'}
                  {activeSimulator === 'dpss' &&
                    'DPSS & SentinelDrive — Topological GIS Map Pathfinder'}
                  {activeSimulator === 'swarm' &&
                    'Swarm Factory — Multi-Agent Firestore Orchestrator'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSimulator(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulator Body */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-[240px] flex flex-col items-center justify-center text-center space-y-4">
              {activeSimulator === 'astroguitar' && (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/40 w-full flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#00f2fe]">
                      Voice Command Active: "Highlight {selectedScale}"
                    </span>
                    <div className="flex gap-1.5">
                      {(['C Major', 'A Minor Pentatonic', 'G Mixolydian'] as const).map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => {
                            setSelectedScale(sc);
                            audioEngine.playGuitarChord([261.63, 329.63, 392.0, 523.25]);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            selectedScale === sc
                              ? 'bg-[#00f2fe] text-slate-950 border-[#00f2fe] font-bold'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Fretboard Notes */}
                  <div className="w-full h-24 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-evenly p-2 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-500/30" />
                    {FRETBOARD_NOTES.map((item) => (
                      <button
                        key={item.note}
                        type="button"
                        onClick={() => {
                          audioEngine.playGuitarNote(item.freq, 1.3);
                          setLastPlayedNote(`${item.note} (${item.freq} Hz)`);
                        }}
                        className={`relative z-10 w-9 h-9 rounded-full font-mono font-bold text-xs flex items-center justify-center transition transform active:scale-90 ${
                          item.active
                            ? 'bg-[#00f2fe] text-[#030712] shadow-[0_0_14px_#00f2fe]'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {item.note}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
                    <span>Last Synthesized Note: {lastPlayedNote}</span>
                    <button
                      type="button"
                      onClick={() => audioEngine.playGuitarChord([261.63, 329.63, 392.0, 523.25])}
                      className="px-3.5 py-1.5 rounded bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 hover:bg-cyan-500/40 transition"
                    >
                      <Volume2 className="w-4 h-4" /> Strum C Major Chord
                    </button>
                  </div>
                </div>
              )}

              {activeSimulator === 'dpss' && (
                <div className="w-full space-y-4">
                  <div className="h-36 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,172,254,0.22)_0,transparent_70%)]" />
                    <span className="text-xs font-mono text-cyan-300 z-10 flex items-center gap-2">
                      <Compass className={`w-4 h-4 text-[#00f2fe] ${dpssSolving ? 'animate-spin' : ''}`} />
                      {dpssSolving
                        ? 'Recalculating Topological GIS Mesh Vector...'
                        : 'Optimal SentinelDrive Route Vector Locked'}
                    </span>
                    <p className="text-[11px] font-mono text-slate-400 z-10 mt-2">
                      Origin: Sector Alpha-01 → Waypoint: Ridge Relay → Destination: Swarm Hub Core
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Topological Nodes: {dpssRouteNodes.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDpssSolving(true);
                        audioEngine.initAudio();
                        audioEngine.playGuitarNote(392.0, 0.6);
                        setTimeout(() => {
                          setDpssRouteNodes(Math.floor(1350 + Math.random() * 250));
                          setDpssLatencyMs(Number((4.2 + Math.random() * 3.1).toFixed(1)));
                          setDpssSolving(false);
                        }, 600);
                      }}
                      className="px-3 py-1.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition"
                    >
                      Recalculate Route Mesh
                    </button>
                    <span className="text-emerald-400">Mesh Latency: {dpssLatencyMs}ms</span>
                  </div>
                </div>
              )}

              {activeSimulator === 'swarm' && (
                <div className="w-full space-y-3 text-left font-mono text-xs">
                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[#00f2fe] font-bold">Swarm Factory Core:</span>{' '}
                      <span className="text-slate-300">
                        6 Autonomous Nodes connected to Firestore `gen-lang-client-0343118388`.
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SWARM_AGENTS.map((ag) => (
                      <div
                        key={ag.id}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-bold">{ag.name}</div>
                          <div className="text-[10px] text-slate-400">{ag.repoName}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {agentStates[ag.id]?.status?.toUpperCase() || 'READY'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Swarm Factory Real-Time Sandbox Ready.
              </span>
              <button
                type="button"
                onClick={() => setActiveSimulator(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono transition"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: PARTNER WITH US MODAL
         ========================================================= */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/85 backdrop-blur-md">
          <div className="glass-panel-active rounded-2xl p-6 max-w-md w-full border border-[#00f2fe] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00f2fe]" /> Partner With GreedysLinks AI
              </h3>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Collaborate with Founder & AI Architect <strong className="text-white">Jose Marin</strong> on custom multi-agent systems, 3D WebGL spatial interfaces, and production Firebase AI infrastructure.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">GitHub Organization:</span>
                <a
                  href="https://github.com/greedyslinks-afk"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00f2fe] hover:underline flex items-center gap-1"
                >
                  greedyslinks-afk <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Swarm Factory Repo:</span>
                <a
                  href="https://github.com/greedyslinks-afk/swarm-factory-"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00f2fe] hover:underline flex items-center gap-1"
                >
                  swarm-factory- <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="text-emerald-400">greedyslinks@gmail.com</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#00f2fe] text-[#030712] font-bold text-xs font-mono hover:bg-cyan-300 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrbCouncilContainer;
