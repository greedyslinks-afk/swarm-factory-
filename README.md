# ⚡ Swarm Factory (`swarm-factory-`)

> **Containerized Multi-Agent Orchestration & 3D Spatial Command Environment**  
> **Architected by Greedys Links AI Developers (`G.L.AI.Dev`) & Autonomous Swarms Labs**

**Stack:** TypeScript (96.9%) | Vite | React | Firebase & Firestore | Express (`server.ts`) | Web Audio API  
**Security Framework:** [Snape Shield Defense](./security_spec.md) | **License:** [MIT](./LICENSE)

---

## 🌌 Overview

**Swarm Factory** is a modular, cloud-native multi-agent orchestration platform engineered for real-time autonomous agent deployment, telemetry ingestion, and spatial human-in-the-loop command. Built with a dark-mode 3D spatial orbit interface and glassmorphism UI nodes, Swarm Factory bridges generative AI reasoning with low-latency audio synthesis and enterprise-grade security governance.

---

## 🏗️ Core Architecture & Modules

### 1. Spatial 3D Command & UI Layer
* **`OrbCouncilContainer.tsx` & `OrbHub.tsx`**: Interactive 3D spatial orbit layout and glassmorphic node hubs for visualizing active agent states, task routing, and swarm consensus in real time.
* **Dynamic Telemetry & State**: Real-time visual feedback loops tracking agent execution pipelines and inter-agent communication.

### 2. Neural Audio & Voice Synthesis Engine
* **`audioEngine.ts`**: Custom Web Audio API processing pipeline for low-latency audio streaming, spatial soundscapes, and dynamic acoustic feedback triggers.
* **`voiceProfiles.ts`**: Distinct vocal identity mappings and synthesis configurations for individual autonomous agents within the Council.

### 3. Snape Shield Defense (`security_spec.md`)
Enterprise multi-agent security framework enforcing zero-trust execution, Firestore rule validation (`firestore.rules`), and runtime protection across four dedicated defense sub-agents:
* 🛡️ **K.R.O.N.O.S.** — Temporal anomaly detection, rate-limiting governance, and execution lifecycle auditing.
* 🧠 **S.A.N.I.** — Prompt sanitization, input/output validation, and adversarial injection filtering.
* 📡 **C.A.P.** — Perimeter access control, API gateway telemetry, and credential boundary enforcement.
* 🔒 **L.O.C.K.** — Automated containment protocols, state rollback, and cryptographic session isolation.

### 4. Backend & Cloud Infrastructure
* **`server.ts`**: Express/Node.js TypeScript runtime coordinating API routing, agent orchestration webhooks, and secure environment state.
* **Firebase & Cloud Integration**: Configured via `firebase-blueprint.json`, `firebase-applet-config.json`, and hardened `firestore.rules` for real-time state persistence and event-driven triggers.

---

## 📂 Repository Structure

```text
swarm-factory-/
├── src/                        # Core application source, state machines & UI modules
├── public/                     # Static assets & WebGL resources
├── OrbCouncilContainer.tsx     # Multi-agent 3D spatial council orchestration view
├── OrbHub.tsx                  # Central interactive orb node controller
├── audioEngine.ts              # Web Audio API synthesis & acoustic telemetry engine
├── voiceProfiles.ts            # Agent-specific voice configuration matrix
├── server.ts                   # Backend TypeScript orchestration server
├── security_spec.md            # Snape Shield Defense architecture & threat model
├── SECURITY.md                 # Vulnerability disclosure & security policy
├── firestore.rules             # Hardened Firebase Firestore security rules
├── firebase-blueprint.json     # Cloud infrastructure & Firebase schema blueprint
├── firebase-applet-config.json # Applet runtime configuration
├── vite.config.ts              # Vite bundler & build configuration
└── tsconfig.json               # TypeScript compiler specifications
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
* **Bun** (v1.0+) or **Node.js** (v20+)
* **Firebase CLI** (optional, for local rule emulation and deployment)

### 1. Install Dependencies
```bash
cd swarm-factory-
bun install
```

### 2. Configure Environment Variables
Copy the example environment file and populate your API keys and Firebase credentials:
```bash
cp .env.example .env
```

### 3. Launch Development Server
```bash
bun run dev
```

---

## 🛡️ Security & Governance

Security is governed by the **Snape Shield Defense** specification. Review [`security_spec.md`](./security_spec.md) for architectural details on agent sandboxing and [`SECURITY.md`](./SECURITY.md) for reporting vulnerabilities.

---

## 🏛️ Branding & Authorship

* **Organization:** Greedys Links AI Developers & Autonomous Swarms Labs
* **Lead Architect:** Jose Marin (`@greedyslinks-afk`)
* **Asset Stamp:** `G.L.AI.Dev` / `G.LAI Dev.`
* **License:** [MIT License](./LICENSE)
