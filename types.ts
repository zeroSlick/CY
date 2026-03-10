
export enum UserRole {
  SOC = 'SOC Analyst',
  DFIR = 'DFIR Analyst',
  SYS = 'Security Admin',
  INT = 'Threat Intelligence Analyst'
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  department?: string;
}

export enum Severity {
  INFORMATIONAL = 'P5 - INFO',
  LOW = 'P4 - LOW',
  MEDIUM = 'P3 - MEDIUM',
  HIGH = 'P2 - HIGH',
  CRITICAL = 'P1 - CRITICAL'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED'
}

export interface Threat {
  id: string;
  type: string;
  severity: Severity;
  riskScore: number;
  confidence: number;
  timestamp: string;
  sourceIp: string;
  targetUser: string;
  status: 'DETECTED' | 'MITIGATED' | 'ESCALATED';
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus | 'PENDING_CLOSURE' | 'CLOSED_BY_ADMIN';
  assignedAnalyst: string | null;
  createdAt: string;
  updatedAt: string;
  relatedThreatIds: string[];
  aiInsights?: {
    summary: string;
    riskAssessment: string;
    suggestedSteps: string[];
    hiddenPatterns: string[];
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  category: 'SECURITY' | 'OPERATIONS' | 'DATA' | 'SYSTEM';
}

export interface ForensicCase {
  id: string;
  caseNumber: string;
  title: string;
  incidentIds: string[];
  evidence: Evidence[];
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  investigatorId: string;
  timeline?: TimelineEvent[];
  chainOfCustody: ChainOfCustodyEntry[];
}

export interface Evidence {
  id: string;
  name: string;
  type: 'LOG' | 'EMAIL' | 'FILE' | 'NETWORK';
  sha256: string;
  verificationStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
  timestamp: string;
  isSealed: boolean;
  content?: string;
  // Forensic analysis findings added here
  forensicArtifacts?: string[];
}

export interface ChainOfCustodyEntry {
  id: string;
  timestamp: string;
  action: string;
  operator: string;
  preHash: string;
  postHash: string;
  details: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  category: string;
  importance: string;
}

// System configuration settings for security policies
export interface SystemSettings {
  id: string;
  minPassLength: number;
  sessionTimeout: number;
  maxAttempts: number;
  triageThreshold: number;
  updatedAt: string;
}
