import type { EvidenceItem, Experiment } from "@/types/portfolio";

export const confidentialSignals = [
  {
    claim: "Ownership",
    evidence: "Independently conceived, designed and implemented by Sagnik.",
    disclosure: "PUBLIC",
  },
  {
    claim: "Control",
    evidence: "Bounded execution and reviewable action paths shape the public engineering philosophy.",
    disclosure: "PRINCIPLE",
  },
  {
    claim: "Inspection",
    evidence: "Important actions are designed to remain reviewable.",
    disclosure: "PRINCIPLE",
  },
  {
    claim: "Evaluation",
    evidence: "Progress is evaluated internally, but private metrics are intentionally not published.",
    disclosure: "PRIVATE EVIDENCE",
  },
  {
    claim: "Access",
    evidence: "A supervised non-sensitive walkthrough can be discussed privately when appropriate.",
    disclosure: "ON REQUEST",
  },
] as const;

export const niftyEvidence: EvidenceItem[] = [
  {
    label: "Data ingestion",
    value: "50 / 50",
    note: "Constituent ingestion completed with zero recorded failures in the owner-published pipeline record.",
    status: "documented",
  },
  {
    label: "Evaluation",
    value: "Walk-forward",
    note: "Model selection and research backtests are separated across time-aware folds.",
    status: "documented",
  },
  {
    label: "Execution gate",
    value: "≈3.98 bps",
    note: "Break-even transaction friction per side in the published Step 5B execution-audit extract.",
    status: "documented",
  },
  {
    label: "Claim boundary",
    value: "Research only",
    note: "No live return series, broker integration or performance guarantee is published.",
    status: "verified",
  },
];

export const motoEvidence: EvidenceItem[] = [
  {
    label: "Optimized policy",
    value: "5,823",
    note: "Mean reward reported in the public repository README.",
    status: "documented",
  },
  {
    label: "Finish rate",
    value: "100%",
    note: "Reported for the final policy and human heuristic in the public README.",
    status: "documented",
  },
  {
    label: "Environment replay",
    value: "Source-derived",
    note: "The interactive replay executes the public environment equations with a labeled heuristic baseline.",
    status: "verified",
  },
  {
    label: "Protocol detail",
    value: "Incomplete",
    note: "Seeds, episode count and held-out-environment detail are not yet published; claims stay bounded accordingly.",
    status: "pending",
  },
];

export const capabilityGroups = [
  {
    label: "AI systems",
    items: ["Agentic workflows", "Evaluation design", "Controlled tool use", "Retrieval and memory", "Local-first systems"],
  },
  {
    label: "ML research",
    items: ["Time-aware validation", "Feature pipelines", "Diagnostics", "Reinforcement learning", "Robustness testing"],
  },
  {
    label: "Product engineering",
    items: ["Python", "TypeScript", "Next.js", "React Native", "Supabase"],
  },
] as const;

export const experiments: Experiment[] = [
  {
    index: "A",
    title: "FinOpsEnv",
    description: "An adversarial cloud-optimization benchmark that tests whether an agent can reduce cost without destroying hidden operational dependencies.",
    meta: "AI evaluation · infrastructure",
    tech: "Python · simulation · agent evals",
    status: "Public repository",
    visual: "network",
    href: "https://github.com/sagniksengupta24/FinOps_Enviroment",
    cursor: "VIEW",
  },
  {
    index: "B",
    title: "Quantum Tic-Tac-Toe",
    description: "An interactive graph-system experiment translating superposition, entanglement loops and collapse into playable rules.",
    meta: "Graph logic · interaction",
    tech: "TypeScript · graph rules",
    status: "Public repository",
    visual: "quantum",
    href: "https://github.com/sagniksengupta24/Quantum-TicTacToe",
    cursor: "PLAY",
  },
  {
    index: "C",
    title: "Samadhan",
    description: "A role-aware property-listing MVP using Supabase authentication, row-level security and constrained media storage.",
    meta: "React Native · Supabase",
    tech: "React Native · Supabase · RLS",
    status: "Private MVP",
    visual: "mobile",
  },
  {
    index: "D",
    title: "The Nomadic Studios",
    description: "A creative-technology identity exploring motion, brand systems and high-conviction digital presentation.",
    meta: "Brand · motion · web",
    tech: "Brand systems · motion · frontend",
    status: "Creative archive",
    visual: "studio",
  },
];
