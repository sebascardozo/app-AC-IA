
export enum TaskCategory {
  STRATEGIC = 'ESTRATÉGICA',
  OPERATIONAL = 'OPERATIVA',
  ROUTINE = 'RUTINARIA'
}

export enum TaskStatus {
  TODO = 'Por Hacer',
  IN_PROGRESS = 'En Curso',
  BLOCKED = 'Bloqueadas',
  UNBLOCK_QUEUE = 'A Desbloquear',
  FINISHED = 'Finalizadas',
  DOCUMENTATION = 'Documentación',
  MINUTES = 'Minutas'
}

export enum UserRole {
  DIRECTOR = 'Director',
  TEAM_LEADER = 'Líder de Equipo',
  CONTRIBUTOR = 'Responsable'
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  password?: string;
  role: UserRole;
  companyId: string;
  managedCompanyIds?: string[];
  teamId?: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  frequency: string;
  estimatedTime: number; 
  investedTime: string; 
  avatar: string;
  assigneeId: string;
  assigneeName: string;
  createdAt: string; 
  estimatedCompletionDate: string; 
  isInternalBlock?: boolean;
  blockedReason?: string;
  unblockerId?: string;
  unblockerName?: string;
  companyId: string; 
  teamId?: string;
  attachments?: string[]; // Nombres de archivos PDF
  sharedWithIds?: string[]; // IDs de usuarios con acceso
  isMinute?: boolean; // Flag para diferenciar lógica de UI
}

export enum Permission {
  VIEW_REPORTS_GLOBAL = 'VIEW_REPORTS_GLOBAL',
  VIEW_REPORTS_TEAM = 'VIEW_REPORTS_TEAM',
  VIEW_REPORTS_OWN = 'VIEW_REPORTS_OWN',
  MANAGE_TASKS_ALL = 'MANAGE_TASKS_ALL',
  MANAGE_TASKS_TEAM = 'MANAGE_TASKS_TEAM',
  MANAGE_TASKS_OWN = 'MANAGE_TASKS_OWN',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  TRACK_TIME = 'TRACK_TIME',
  SWITCH_COMPANY = 'SWITCH_COMPANY'
}
