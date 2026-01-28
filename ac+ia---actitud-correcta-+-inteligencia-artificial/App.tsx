
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import AddMinuteModal from './components/AddMinuteModal';
import TaskDetailModal from './components/TaskDetailModal';
import { Task, TaskStatus, UserRole, Permission, User, Company } from './types';
import { INITIAL_TASKS, ROLE_PERMISSIONS, USERS_MOCK, COMPANIES } from './constants';
import { aiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("IA: Analizando flujos de trabajo...");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddMinuteModalOpen, setIsAddMinuteModalOpen] = useState(false);

  // Estados para el flujo de Login
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const visibleTasks = tasks.filter(task => {
    if (!currentUser || !activeCompany) return false;
    // Si es una minuta, solo se ve si está compartida con el usuario o es el creador
    if (task.status === TaskStatus.MINUTES) {
        return task.assigneeId === currentUser.id || task.sharedWithIds?.includes(currentUser.id) || currentUser.role === UserRole.DIRECTOR;
    }
    if (currentUser.role === UserRole.DIRECTOR) return task.companyId === activeCompany.id;
    if (currentUser.role === UserRole.TEAM_LEADER) return task.companyId === currentUser.companyId;
    if (currentUser.role === UserRole.CONTRIBUTOR) return task.assigneeId === currentUser.id || task.unblockerId === currentUser.id;
    return false;
  });

  useEffect(() => {
    if (currentUser && visibleTasks.length > 0) {
      const fetchInsight = async () => {
        const insight = await aiService.getEfficiencyFeedback(visibleTasks);
        setAiInsight(insight);
      };
      fetchInsight();
    }
  }, [tasks, currentUser, activeCompany]);

  const handleAttemptLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tempUser) return;

    if (passwordInput === tempUser.password) {
      setCurrentUser(tempUser);
      const company = COMPANIES.find(c => c.id === tempUser.companyId) || COMPANIES[0];
      setActiveCompany(company);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 1000);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTempUser(null);
    setPasswordInput('');
    setActiveCompany(null);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    if (!currentUser || !activeCompany) return;
    const task: Task = {
      ...(newTask as Task),
      id: Math.random().toString(36).substr(2, 9),
      assigneeId: currentUser.id,
      assigneeName: currentUser.name,
      avatar: currentUser.avatar,
      companyId: activeCompany.id,
      investedTime: newTask.investedTime || '00:00',
      createdAt: new Date().toISOString()
    };
    setTasks([task, ...tasks]);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#101828] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FACC15] rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[150px]"></div>
        </div>

        <div className="z-10 text-center mb-12 animate-slide-up">
          <div className="flex flex-col items-center mb-8">
             <div className="flex items-center gap-1 text-white font-black text-6xl tracking-tighter">
                <span className="logo-bracket text-[1.2em]">[</span>
                <span className="flex items-baseline">
                  AC<span className="text-[#FACC15] mx-1">+</span>IA
                </span>
                <span className="logo-bracket text-[1.2em]">]</span>
             </div>
             <p className="text-[14px] text-gray-400 font-bold tracking-[0.3em] mt-2 uppercase">BY DESHUMO</p>
          </div>
        </div>

        <div className="z-10 w-full max-w-md bg-gray-900/40 backdrop-blur-2xl border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl animate-slide-up relative min-h-[450px]">
          {!tempUser ? (
            <div className="animate-slide-up">
              <h2 className="text-lg font-semibold text-gray-300 mb-8 text-center tracking-wide">Selecciona tu Perfil</h2>
              <div className="space-y-3">
                {USERS_MOCK.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setTempUser(user)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#1e293b]/50 border border-gray-800 hover:border-[#FACC15] hover:bg-[#1e293b] transition-all group"
                  >
                    <img src={user.avatar} className="w-12 h-12 rounded-xl border border-gray-700 shadow-md" alt={user.name} />
                    <div className="text-left">
                      <p className="font-bold text-white group-hover:text-[#FACC15]">{user.name}</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{user.role}</p>
                    </div>
                    <i className="fas fa-arrow-right ml-auto text-gray-700 group-hover:text-[#FACC15] transition-transform group-hover:translate-x-1"></i>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-slide-left h-full flex flex-col">
              <button 
                onClick={() => { setTempUser(null); setPasswordInput(''); setLoginError(false); }}
                className="text-gray-500 hover:text-white mb-6 text-sm flex items-center gap-2 transition-colors font-bold uppercase tracking-widest"
              >
                <i className="fas fa-chevron-left text-[10px]"></i> Volver
              </button>
              
              <div className="flex flex-col items-center mb-10">
                <img src={tempUser.avatar} className="w-20 h-20 rounded-2xl border-2 border-[#FACC15] shadow-xl mb-4" alt="avatar" />
                <h2 className="text-xl font-black text-white">{tempUser.name}</h2>
                <p className="text-[10px] text-[#FACC15] font-black uppercase tracking-[0.2em]">{tempUser.role}</p>
              </div>

              <form onSubmit={handleAttemptLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contraseña de acceso</label>
                  <div className="relative">
                    <input
                      autoFocus
                      type="password"
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className={`w-full bg-slate-900 border ${loginError ? 'border-red-500 animate-shake' : 'border-gray-800'} rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-gray-700`}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      <i className={`fas fa-lock ${loginError ? 'text-red-500' : 'text-gray-700'}`}></i>
                    </div>
                  </div>
                  {loginError && <p className="text-[10px] text-red-500 font-black uppercase text-center mt-2 tracking-widest">Credenciales incorrectas</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FACC15] hover:bg-yellow-500 text-[#101828] font-black py-5 rounded-[2rem] shadow-2xl shadow-yellow-500/10 transition-all flex items-center justify-center gap-3 tracking-[0.2em] active:scale-95"
                >
                  INGRESAR <i className="fas fa-sign-in-alt text-xs"></i>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#101828] overflow-hidden font-sans">
      <Sidebar 
        role={currentUser.role} 
        onAddTask={() => setIsAddTaskModalOpen(true)} 
        onAddMinute={() => setIsAddMinuteModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 bg-navy-gradient">
        <header className="h-20 border-b border-gray-800 px-8 flex justify-between items-center bg-[#101828]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-1">Contexto Corporativo</span>
              <div className="flex items-center gap-2">
                <i className="fas fa-building text-[#FACC15] text-xs"></i>
                {currentUser.role === UserRole.DIRECTOR ? (
                  <select 
                    value={activeCompany?.id}
                    onChange={(e) => setActiveCompany(COMPANIES.find(c => c.id === e.target.value) || null)}
                    className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer hover:text-[#FACC15] transition-colors"
                  >
                    {COMPANIES.map(c => <option key={c.id} value={c.id} className="bg-[#101828]">{c.name}</option>)}
                  </select>
                ) : (
                  <span className="text-white font-bold text-sm">{activeCompany?.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-[#FACC15]/5 border border-[#FACC15]/10 px-5 py-2.5 rounded-2xl brand-shadow">
            <div className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></div>
            <p className="text-[11px] font-bold text-[#FACC15] tracking-tight">{aiInsight}</p>
          </div>

          <div className="flex items-center gap-6 pl-8 border-l border-gray-800">
            <div className="text-right">
              <p className="text-sm font-black text-white leading-none mb-1">{currentUser.name}</p>
              <p className="text-[9px] text-[#FACC15] font-black uppercase tracking-widest">{currentUser.role}</p>
            </div>
            <div className="relative group">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-xl border border-gray-800 group-hover:border-[#FACC15] transition-all cursor-pointer shadow-lg" alt="profile" />
              <button 
                onClick={handleLogout}
                className="absolute -bottom-1 -right-1 bg-red-600 text-white w-5 h-5 rounded-md text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                title="Cerrar sesión"
              >
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-auto p-8 flex gap-8">
          {[
            { status: TaskStatus.TODO, color: 'text-gray-400' },
            { status: TaskStatus.IN_PROGRESS, color: 'text-blue-400' },
            { status: TaskStatus.BLOCKED, color: 'text-red-400' },
            { status: TaskStatus.UNBLOCK_QUEUE, color: 'text-[#FACC15]' },
            { status: TaskStatus.FINISHED, color: 'text-green-400' },
            { status: TaskStatus.DOCUMENTATION, color: 'text-purple-400' },
            { status: TaskStatus.MINUTES, color: 'text-orange-400' }
          ].map(col => {
            const colTasks = visibleTasks.filter(t => {
                if (col.status === TaskStatus.UNBLOCK_QUEUE) {
                    return t.status === TaskStatus.BLOCKED && t.unblockerId === currentUser.id;
                }
                return t.status === col.status;
            });
            const sorted = [...colTasks].sort((a, b) => new Date(a.estimatedCompletionDate).getTime() - new Date(b.estimatedCompletionDate).getTime());

            return (
              <section key={col.status} className="min-w-[320px] max-w-[320px] flex flex-col gap-4 group/col">
                <div className="flex justify-between items-center px-2 py-2 border-b border-gray-800/50 mb-2 transition-colors group-hover/col:border-[#FACC15]/30">
                  <h2 className={`font-black uppercase text-[10px] tracking-[0.2em] ${col.color}`}>
                    {col.status === TaskStatus.UNBLOCK_QUEUE ? '⚠️ A Desbloquear' : col.status}
                  </h2>
                  <span className="bg-gray-800/50 text-gray-500 px-2 py-0.5 rounded-md text-[9px] font-bold group-hover/col:text-gray-300 transition-colors">{sorted.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 pb-10">
                  {sorted.map(t => (
                    <TaskCard 
                      key={t.id} 
                      task={t} 
                      onSelect={setSelectedTaskForDetail} 
                      onStatusChange={(id, status) => handleUpdateTask({...t, status})}
                      role={currentUser.role}
                      isUnblockQueue={col.status === TaskStatus.UNBLOCK_QUEUE}
                    />
                  ))}
                  {sorted.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center border border-gray-800/30 rounded-3xl opacity-20 italic text-[10px] tracking-widest">
                      SIN PENDIENTES
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </main>
      </div>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        onAdd={handleAddTask} 
      />

      <AddMinuteModal
        isOpen={isAddMinuteModalOpen}
        onClose={() => setIsAddMinuteModalOpen(false)}
        onAdd={handleAddTask}
      />

      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={!!selectedTaskForDetail}
        onClose={() => setSelectedTaskForDetail(null)}
        onUpdate={handleUpdateTask}
        onLogTime={(id, h, m) => {
            const task = tasks.find(t => t.id === id);
            if (task && !task.isMinute) {
                const [currH, currM] = task.investedTime.split(':').map(Number);
                let newMinutes = currM + m;
                let newHours = currH + h + Math.floor(newMinutes / 60);
                newMinutes = newMinutes % 60;
                handleUpdateTask({...task, investedTime: `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`});
            }
        }}
      />
    </div>
  );
};

export default App;
