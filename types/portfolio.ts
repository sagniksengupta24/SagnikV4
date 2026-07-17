export type EvidenceStatus = "verified" | "documented" | "pending";

export type EvidenceItem = {
  label: string;
  value: string;
  note: string;
  status: EvidenceStatus;
};

export type Experiment = {
  index: string;
  title: string;
  description: string;
  meta: string;
  tech: string;
  status: string;
  visual: "network" | "quantum" | "mobile" | "studio";
  href?: string;
  cursor?: string;
};
