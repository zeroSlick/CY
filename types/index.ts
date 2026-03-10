
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
  INFORMATIONAL = 'P5 - Informational',
  LOW = 'P4 - Low',
  MEDIUM = 'P3 - Medium',
  HIGH = 'P2 - High',
  CRITICAL = 'P1 - Critical'
}

export enum IncidentStatus {
  OPEN = 'Open',
  INVESTIGATING = 'Investigating',
  CLOSED = 'Closed',
  RESOLVED = 'Resolved'
}

export interface Threat {
  id: string;
  type: string;
  severity: Severity;
  riskScore: number;
  confidence: number;
  mlDetected: boolean;
  timestamp: string;
  sourceIp: string;
  targetUser: string;
  status: 'Detected' | 'Mitigated' | 'Escalated';
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus | 'Pending Closure' | 'Closed By Admin';
  assignedAnalyst: string | null;
  assignedRole?: UserRole;
  createdAt: string;
  updatedAt: string;
  relatedThreatIds: string[];
}
