export type SwarmDomain = 'AI' | 'Spatial' | 'Security' | 'Cloud';
export type SwarmModality = 'Autonomous' | 'Reactive' | 'Orchestrator';

export interface SignProfile {
  id: string;
  name: string;
  symbol: string;
  element: SwarmDomain;
  modality: SwarmModality;
  archetype: string;
  title: string;
  subtitle: string;
  repoName: string;
  repoUrl: string;
  color: string;
  glowColor: string;
  gradient: string;
  harmonicFreq: number;
  frequencyLabel: string;
  speechPitch: number;
  speechRate: number;
  timbreDescription: string;
  voiceStyle: string;
  perspective: string;
  angleDeg: number;
  traits: string[];
  capabilities: string[];
  quickPrompts: string[];
}

export const SWARM_AGENTS: SignProfile[] = [
  {
    id: 'digital-products',
    name: 'AI Digital Products',
    symbol: 'BOT',
    element: 'AI',
    modality: 'Autonomous',
    archetype: 'Custom Agents & SaaS',
    title: 'AI-Driven Digital Products',
    subtitle: 'Custom Agents & SaaS',
    repoName: 'greedyslinks-afk/temp_gemini_flow',
    repoUrl: 'https://github.com/greedyslinks-afk/temp_gemini_flow',
    color: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.65)',
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    harmonicFreq: 432.0,
    frequencyLabel: '432 Hz · AI Core',
    speechPitch: 1.08,
    speechRate: 1.05,
    timbreDescription: 'Crisp, high-velocity neural telemetry cadence',
    voiceStyle: 'Direct, analytical, product-focused execution',
    perspective: 'Specialized in building full-stack AI applications, autonomous multi-agent workflows, and scalable micro-SaaS platforms.',
    angleDeg: 315,
    traits: ['Multimodal Agents', 'Micro-SaaS', 'Gemini 2.5 Flash', 'Voice AI'],
    capabilities: [
      'Multimodal AI Agent Workflows',
      'Interactive Spatial Web Dashboards',
      'Real-time Voice AI & Audio Processing',
      'Gemini 2.5 Flash & API Function Orchestration'
    ],
    quickPrompts: [
      'Synthesize a multimodal agent workflow for real-time customer telemetry',
      'Benchmark token velocity and response latency across active SaaS nodes',
      'Deploy autonomous function-calling pipeline for GreedysLinks AI Hub'
    ]
  },
  {
    id: 'tech-essentials',
    name: 'Tech Essentials',
    symbol: 'SEC',
    element: 'Security',
    modality: 'Reactive',
    archetype: 'DPSS System & Security',
    title: 'Tech Essentials & DPSS Ecosystem',
    subtitle: 'DPSS System & Security',
    repoName: 'greedyslinks-afk/SentinelDrive-',
    repoUrl: 'https://github.com/greedyslinks-afk/SentinelDrive-',
    color: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.65)',
    gradient: 'from-indigo-400 via-indigo-600 to-purple-600',
    harmonicFreq: 324.0,
    frequencyLabel: '324 Hz · GIS & Sec',
    speechPitch: 0.94,
    speechRate: 1.0,
    timbreDescription: 'Grounded, zero-trust security & spatial routing tone',
    voiceStyle: 'Precise, diagnostic, security-hardened',
    perspective: 'Spatial navigation algorithms, topological geographical mesh routing, SentinelDrive hazard telemetry, and zero-trust security protocols.',
    angleDeg: 45,
    traits: ['DPSS Routing', 'SentinelDrive', 'Zero-Trust', 'GIS Mesh'],
    capabilities: [
      'Low-Latency Topological Navigation Mesh (sub-10ms solver)',
      'SentinelDrive Dashcam & Real-Time Hazard Telemetry',
      'End-to-End Key Security & Firestore ABAC Rules',
      'Offline Vector Map Tile Caching & CI/CD Pipelines'
    ],
    quickPrompts: [
      'Compute optimal topological route vector across 1,420 GIS mesh nodes',
      'Run SentinelDrive hazard detection scan and verify zero-trust key integrity',
      'Audit Firestore security rules for project gen-lang-client-0343118388'
    ]
  },
  {
    id: 'spatial-ui',
    name: '3D UI/UX Navigation',
    symbol: '3D',
    element: 'Spatial',
    modality: 'Autonomous',
    archetype: 'AstroGuitar AI & WebGL',
    title: '3D UI/UX Navigation (AstroGuitar AI)',
    subtitle: 'AstroGuitar AI & WebGL',
    repoName: 'greedyslinks-afk/https-greedyslinks-portfolio-',
    repoUrl: 'https://github.com/greedyslinks-afk/https-greedyslinks-portfolio-',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.65)',
    gradient: 'from-blue-400 via-cyan-500 to-indigo-500',
    harmonicFreq: 528.0,
    frequencyLabel: '528 Hz · WebGL Audio',
    speechPitch: 1.12,
    speechRate: 1.04,
    timbreDescription: 'Harmonic, spatial WebGL & Web Audio synthesizer timbre',
    voiceStyle: 'Expressive, spatial, audio-reactive',
    perspective: 'Pioneering interactive 3D spatial navigation layers using Three.js, WebGL shaders, and hands-free voice-commanded audio training.',
    angleDeg: 225,
    traits: ['Three.js WebGL', 'AstroGuitar AI', 'Web Audio Synth', '60 FPS Spatial'],
    capabilities: [
      '60 FPS Interactive WebGL 3D Fretboards & Spatial Orbits',
      'Dynamic Camera Motion & Exponential Damping Controls',
      'Hands-free Voice Command Scale & Chord Highlighting',
      'Polyphonic Web Audio API Tone & Frequency Synthesis'
    ],
    quickPrompts: [
      'Synthesize 3D WebGL fretboard scale mesh and voice triggers for AstroGuitar AI',
      'Calibrate Three.js particle orbit velocity and stereo audio panning',
      'Generate polyphonic Web Audio chord progression in C Major / A Minor'
    ]
  },
  {
    id: 'ai-solutions',
    name: 'Swarm Factory Core',
    symbol: 'SWM',
    element: 'Cloud',
    modality: 'Orchestrator',
    archetype: 'Multi-Agent Swarm Hub',
    title: 'Swarm Factory Multi-Agent Solutions',
    subtitle: 'Autonomous Agent Swarm',
    repoName: 'greedyslinks-afk/swarm-factory-',
    repoUrl: 'https://github.com/greedyslinks-afk/swarm-factory-',
    color: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.7)',
    gradient: 'from-cyan-300 via-teal-400 to-emerald-500',
    harmonicFreq: 648.0,
    frequencyLabel: '648 Hz · Swarm Core',
    speechPitch: 1.0,
    speechRate: 1.06,
    timbreDescription: 'Authoritative multi-agent orchestrator resonance',
    voiceStyle: 'Coordinated, high-throughput, systems-architectural',
    perspective: 'Autonomous multi-agent orchestration engine synchronizing Firebase Firestore state, Gemini 2.5 Flash reasoning, and distributed repo pipelines.',
    angleDeg: 135,
    traits: ['Swarm Factory', 'Firestore Sync', 'Multi-Agent', 'Cloud Run'],
    capabilities: [
      'Autonomous Multi-Agent Task Dispatch & Consensus Synthesis',
      'Real-Time Firebase Firestore State Synchronization',
      'Cross-Repository Pipeline Integration (GreedysLinks AI)',
      'Sub-second Telemetry Benchmarking & Live Orb Refresh'
    ],
    quickPrompts: [
      'Synchronize Swarm Factory state across Firebase project gen-lang-client-0343118388',
      'Orchestrate parallel benchmark across AstroGuitar, DPSS, and Cloud MCP nodes',
      'Synthesize multi-agent deployment manifest for GreedysLinks AI Developers'
    ]
  },
  {
    id: 'firebase-mcp',
    name: 'Firebase & Cloud MCP',
    symbol: 'MCP',
    element: 'Cloud',
    modality: 'Reactive',
    archetype: 'Firebase AI & Cloud Run',
    title: 'Firebase & Cloud Run MCP Infrastructure',
    subtitle: 'Project #643675584033',
    repoName: 'greedyslinks-afk/agent-skills',
    repoUrl: 'https://github.com/greedyslinks-afk/agent-skills',
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.65)',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    harmonicFreq: 486.0,
    frequencyLabel: '486 Hz · Cloud MCP',
    speechPitch: 1.04,
    speechRate: 1.02,
    timbreDescription: 'Clean cloud telemetry & database verification pulse',
    voiceStyle: 'Structured, cloud-native, infrastructure-focused',
    perspective: 'Integrates Firebase Firestore, Authentication, Cloud Run MCP servers, and Gemini CLI workspace skills for production AI deployments.',
    angleDeg: 0,
    traits: ['Firebase MCP', 'Firestore DB', 'Cloud Run', 'Agent Skills'],
    capabilities: [
      'Live Firestore Persistence (gen-lang-client-0343118388)',
      'Cloud Run & Gemini Cloud Assist MCP Server Integration',
      'Automated Security Rule Validation & Schema Sync',
      'Google Workspace & GitHub MCP Extension Bridging'
    ],
    quickPrompts: [
      'Verify live Firestore connection and agent collection latency',
      'Generate Cloud Run deployment config for Swarm Factory container',
      'Sync agent-skills Firebase MCP descriptors with active workbench'
    ]
  },
  {
    id: 'platform-core',
    name: 'Platform AI & DevTools',
    symbol: 'DEV',
    element: 'AI',
    modality: 'Orchestrator',
    archetype: 'OmniGit & Gemini CLI',
    title: 'Platform AI & Developer Tools',
    subtitle: 'OmniGit & DevTools',
    repoName: 'greedyslinks-afk/platform-ai',
    repoUrl: 'https://github.com/greedyslinks-afk/platform-ai',
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.65)',
    gradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    harmonicFreq: 576.0,
    frequencyLabel: '576 Hz · DevTools',
    speechPitch: 1.06,
    speechRate: 1.08,
    timbreDescription: 'Fast compiler & developer toolchain resonance',
    voiceStyle: 'Technical, concise, architecture-first',
    perspective: 'Provides developer toolchain automation, OmniGit MCP repository indexing, and Gemini CLI extensions for rapid full-stack engineering.',
    angleDeg: 180,
    traits: ['Platform AI', 'OmniGit MCP', 'Gemini CLI', 'DevTools'],
    capabilities: [
      'Multi-Repository Context Indexing (greedyslinks-afk)',
      'Automated TypeScript & Vite Build Verification',
      'Gemini CLI Extension & Theme Orchestration',
      'Real-time Telemetry Stream & JSON Protocol Logging'
    ],
    quickPrompts: [
      'Index all greedyslinks-afk repositories into the Swarm Factory knowledge graph',
      'Run full-stack build verification and latency diagnostics',
      'Export Studio AI Workbench telemetry report in JSON protocol format'
    ]
  }
];

export const COUNCIL_SIGNS: SignProfile[] = SWARM_AGENTS;

export function getSignById(id: string): SignProfile | undefined {
  return SWARM_AGENTS.find((s) => s.id.toLowerCase() === id.toLowerCase());
}
