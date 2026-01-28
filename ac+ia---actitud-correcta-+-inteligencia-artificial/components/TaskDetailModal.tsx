
import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskStatus, UserRole } from '../types';
import { USERS_MOCK } from '../constants';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onLogTime: (taskId: string, hours: number, minutes: number) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onUpdate, onLogTime }) => {
  const [formData, setFormData] = useState<Task | null>(null);
  const [logHours, setLogHours] = useState(0);
  const [logMinutes, setLogMinutes] = useState(0);

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
      setLogHours(0);
      setLogMinutes(0);
    }
  }, [task]);

  if (!isOpen || !formData) return null;

  const isMinute = formData.status === TaskStatus.MINUTES;

  const handleSave = () => {
    if (formData) {
      if (!isMinute && (logHours > 0 || logMinutes > 0)) {
        onLogTime(formData.id, logHours, logMinutes);
      }
      const unblocker = USERS_MOCK.find(u => u.id === formData.unblockerId);
      const finalTask = {
        ...formData,
        unblockerName: unblocker?.name || formData.unblockerName
      };
      onUpdate(finalTask);
      onClose();
    }
  };

  const handleOpenAttachment = (file: string) => {
    if (file.startsWith('http') || file.startsWith('www')) {
      const url = file.startsWith('http') ? file : `https://${file}`;
      window.open(url, '_blank');
    } else {
      alert(`Accediendo a documento local: ${file.replace('Local: ', '')}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#101828]/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#101828] border border-gray-800 rounded-[2.5rem] shadow-2xl animate-slide-up overflow-hidden">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-[#101828]/50">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${isMinute ? 'bg-purple-500' : (formData.status === TaskStatus.BLOCKED ? 'bg-red-500' : 'bg-[#FACC15]')} shadow-lg shadow-current/20`}></div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                <span className={`${isMinute ? 'text-purple-500' : 'text-[#FACC15]'} font-light`}>[</span> 
                {isMinute ? 'FICHA DE MINUTA' : 'FICHA DE GESTIÓN'} 
                <span className={`${isMinute ? 'text-purple-500' : 'text-[#FACC15]'} font-light`}>]</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className={`p-10 grid grid-cols-1 ${isMinute ? '' : 'lg:grid-cols-2'} gap-10`}>
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">{isMinute ? 'Contenido de la Reunión' : 'Descripción'}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white h-36 resize-none focus:ring-2 focus:ring-[#FACC15] outline-none"
              />
            </div>

            {!isMinute && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white outline-none"
                  >
                    {Object.values(TaskStatus).filter(s => s !== TaskStatus.UNBLOCK_QUEUE && s !== TaskStatus.MINUTES).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Vencimiento</label>
                  <input
                    type="date"
                    value={formData.estimatedCompletionDate.split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: new Date(e.target.value).toISOString() })}
                    className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}

            {isMinute && formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Documentos y Enlaces PDF</label>
                    <div className="grid grid-cols-1 gap-4">
                        {formData.attachments.map((file, i) => (
                            <button
                                key={i}
                                onClick={() => handleOpenAttachment(file)}
                                className="flex items-center gap-3 p-4 bg-gray-900 rounded-2xl border border-gray-800 hover:border-purple-500 transition-all text-left group"
                            >
                                <i className={`fas ${file.startsWith('http') ? 'fa-external-link-alt' : 'fa-file-pdf'} text-purple-500 text-lg`}></i>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[10px] text-white font-bold truncate tracking-tight">{file}</span>
                                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{file.startsWith('http') ? 'Abrir enlace' : 'Ver archivo'}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {!isMinute && (
            <div className="space-y-8">
              <div className={`p-6 rounded-[2rem] border transition-all ${formData.status === TaskStatus.BLOCKED ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/50 border-gray-800 opacity-50 pointer-events-none'}`}>
                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                  <i className="fas fa-shield-alt text-xs"></i> Control de Bloqueo
                </h3>
                
                <div className="flex items-center gap-3 mb-5">
                  <input 
                    type="checkbox" 
                    id="internal_edit"
                    checked={formData.isInternalBlock}
                    onChange={(e) => setFormData({...formData, isInternalBlock: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-gray-800 bg-gray-950 text-red-600 focus:ring-red-600"
                  />
                  <label htmlFor="internal_edit" className="text-[11px] text-gray-300 font-black uppercase tracking-widest cursor-pointer">Interno</label>
                </div>

                <textarea
                  placeholder="Explicación técnica..."
                  value={formData.blockedReason || ''}
                  onChange={(e) => setFormData({...formData, blockedReason: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white h-24 outline-none mb-5 focus:border-red-500/50"
                />

                {formData.isInternalBlock && (
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Sujeto Responsable</label>
                    <select
                      value={formData.unblockerId || ''}
                      onChange={(e) => setFormData({...formData, unblockerId: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {USERS_MOCK.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="bg-[#FACC15]/5 border border-[#FACC15]/10 p-6 rounded-[2rem] brand-shadow">
                <h3 className="text-[10px] font-black text-[#FACC15] uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                  <i className="fas fa-stopwatch text-xs"></i> Cronómetro de Gestión
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      placeholder="00"
                      value={logHours}
                      onChange={(e) => setLogHours(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 text-center text-white font-black text-xl focus:border-[#FACC15] outline-none"
                    />
                    <span className="text-[9px] text-gray-500 mt-2 uppercase font-black tracking-widest">Horas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="00"
                      value={logMinutes}
                      onChange={(e) => setLogMinutes(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 text-center text-white font-black text-xl focus:border-[#FACC15] outline-none"
                    />
                    <span className="text-[9px] text-gray-500 mt-2 uppercase font-black tracking-widest">Minutos</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center mt-4 font-bold tracking-widest uppercase">Inversión actual: <span className="text-white font-mono">{formData.investedTime}h</span></p>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#0b0f1a] border-t border-gray-800 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl text-[11px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            DESCARTAR
          </button>
          <button
            onClick={handleSave}
            className={`${isMinute ? 'bg-purple-600 hover:bg-purple-500' : 'bg-[#FACC15] hover:bg-yellow-500'} text-white font-black px-10 py-4 rounded-[2rem] text-[11px] tracking-[0.2em] shadow-xl transition-all active:scale-95`}
          >
            GUARDAR CAMBIOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
