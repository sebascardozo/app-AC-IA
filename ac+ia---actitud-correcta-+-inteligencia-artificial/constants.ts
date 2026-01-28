
import { Task, TaskCategory, TaskStatus, UserRole, Permission, Company, User } from './types';

export const COMPANIES: Company[] = [
  { id: 'comp_1', name: 'Innova Tech S.A.' },
  { id: 'comp_2', name: 'Global Logistics' }
];

export const USERS_MOCK: User[] = [
  { 
    id: 'user_dir', 
    name: 'Carlos Ruiz', 
    password: '123',
    role: UserRole.DIRECTOR, 
    companyId: 'comp_1', 
    managedCompanyIds: ['comp_1', 'comp_2'],
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=FACC15&color=101828'
  },
  { 
    id: 'user_lead', 
    name: 'Juan Perez', 
    password: '123',
    role: UserRole.TEAM_LEADER, 
    companyId: 'comp_1', 
    teamId: 'team_alpha',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=1e293b&color=FACC15'
  },
  { 
    id: 'user_resp', 
    name: 'Maria Gomez', 
    password: '123',
    role: UserRole.CONTRIBUTOR, 
    companyId: 'comp_1', 
    teamId: 'team_alpha',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Gomez&background=334155&color=fff'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Diseño Plan Trimestral',
    description: 'Definir objetivos de facturación y expansión para Q3.',
    category: TaskCategory.STRATEGIC,
    status: TaskStatus.TODO,
    frequency: 'Mensual',
    estimatedTime: 4,
    investedTime: '02:15',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=1e293b&color=FACC15',
    assigneeId: 'user_lead',
    assigneeName: 'Juan Perez',
    createdAt: new Date().toISOString(),
    estimatedCompletionDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    companyId: 'comp_1',
    teamId: 'team_alpha'
  },
  {
    id: '2',
    title: 'Auditoría Global comp_2',
    description: 'Revisión de procesos logísticos.',
    category: TaskCategory.OPERATIONAL,
    status: TaskStatus.IN_PROGRESS,
    frequency: 'Anual',
    estimatedTime: 10,
    investedTime: '01:00',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Ruiz&background=FACC15&color=101828',
    assigneeId: 'user_dir',
    assigneeName: 'Carlos Ruiz',
    createdAt: new Date().toISOString(),
    estimatedCompletionDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    companyId: 'comp_2'
  }
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.DIRECTOR]: [
    Permission.VIEW_REPORTS_GLOBAL,
    Permission.MANAGE_TASKS_ALL,
    Permission.MANAGE_SETTINGS,
    Permission.SWITCH_COMPANY
  ],
  [UserRole.TEAM_LEADER]: [
    Permission.VIEW_REPORTS_TEAM,
    Permission.VIEW_REPORTS_OWN,
    Permission.MANAGE_TASKS_TEAM,
    Permission.MANAGE_TASKS_OWN,
    Permission.TRACK_TIME
  ],
  [UserRole.CONTRIBUTOR]: [
    Permission.VIEW_REPORTS_OWN,
    Permission.MANAGE_TASKS_OWN,
    Permission.TRACK_TIME
  ]
};

export const MENU_ITEMS_BY_ROLE: Record<UserRole, { icon: string; label: string; permission?: Permission }[]> = {
  [UserRole.DIRECTOR]: [
    { icon: 'fa-chart-pie', label: 'Dashboard Corporativo' },
    { icon: 'fa-building', label: 'Mis Empresas' },
    { icon: 'fa-globe', label: 'Reportes Globales' },
    { icon: 'fa-cog', label: 'Configuración' },
  ],
  [UserRole.TEAM_LEADER]: [
    { icon: 'fa-chart-pie', label: 'Tablero Equipo' },
    { icon: 'fa-users', label: 'Mi Equipo' },
    { icon: 'fa-file-invoice-dollar', label: 'Remuneraciones' },
  ],
  [UserRole.CONTRIBUTOR]: [
    { icon: 'fa-chart-pie', label: 'Mis Tareas' },
    { icon: 'fa-user', label: 'Perfil' },
    { icon: 'fa-clock', label: 'Mi Tiempo' },
  ]
};

export const CATEGORY_COLORS = {
  [TaskCategory.STRATEGIC]: 'border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]',
  [TaskCategory.OPERATIONAL]: 'border-blue-400 bg-blue-400/10 text-blue-400',
  [TaskCategory.ROUTINE]: 'border-slate-500 bg-slate-500/10 text-slate-400'
};
