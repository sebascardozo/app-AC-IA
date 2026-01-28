
import React, { useState } from 'react';
import { Task, TaskCategory, TaskStatus, UserRole } from '../types';
import { USERS_MOCK } from '../constants';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Partial<Task>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: TaskCategory.OPERATIONAL,
    frequency: 'Única',
    estimatedTime: 1,
    estimatedCompletionDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: TaskStatus.TODO,
    isInternalBlock: false,
    blockedReason: '',
    unblockerId: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const unblocker = USERS_MOCK.find(u => u.id === formData.unblockerId);
    
    onAdd({
      ...formData,
      // La fecha se estampa en handleAddTask en App.tsx
      avatar: `https://ui-avatars.com/api/?name=${formData.title.split(' ')[0]}&background=FACC15&color=101828`,
      unblockerName: unblocker?.name
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-[#101828]/80 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-[#101828] border-l border-gray-800 shadow-2xl p-10 overflow-y-auto animate-slide-left">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white">
            <span className="text-[#FACC15] font-light text-3xl">[</span>
            NUEVA TAREA
            <span className="text-[#FACC15] font-light text-3xl">]</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Título de la Gestión</label>
            <input
              type="text"
              required
              placeholder="Ej. Análisis de mercado Q4"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Fecha Límite</label>
              <input
                type="date"
                required
                value={formData.estimatedCompletionDate}
                onChange={(e) => setFormData({ ...formData, estimatedCompletionDate: e.target.value })}
                className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-4 py-4 text-sm text-white focus:ring-2 focus:ring-[#FACC15] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Nivel Impacto</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-4 py-4 text-sm text-white focus:ring-2 focus:ring-[#FACC15] outline-none appearance-none"
              >
                <option value={TaskCategory.STRATEGIC}>Estratégica</option>
                <option value={TaskCategory.OPERATIONAL}>Operativa</option>
                <option value={TaskCategory.ROUTINE}>Rutinaria</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
             <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Estado de la Tarea</label>
             <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-[#FACC15] outline-none"
              >
                <option value={TaskStatus.TODO}>Por Hacer</option>
                <option value={TaskStatus.IN_PROGRESS}>En Curso</option>
                <option value={TaskStatus.BLOCKED}>Bloqueada</option>
                <option value={TaskStatus.FINISHED}>Finalizada</option>
              </select>
          </div>

          {formData.status === TaskStatus.BLOCKED && (
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl space-y-5 animate-slide-up">
              <div className="flex items-center gap-3 mb-1">
                <input 
                  type="checkbox" 
                  id="internal"
                  checked={formData.isInternalBlock}
                  onChange={(e) => setFormData({...formData, isInternalBlock: e.target.checked})}
                  className="w-5 h-5 rounded-lg border-gray-800 bg-gray-900 text-[#FACC15] focus:ring-[#FACC15]"
                />
                <label htmlFor="internal" className="text-[11px] text-red-400 font-black uppercase tracking-widest cursor-pointer">Bloqueo Interno (Equipo)</label>
              </div>
              
              <textarea
                placeholder="Especifique el motivo de la detención..."
                value={formData.blockedReason}
                onChange={(e) => setFormData({...formData, blockedReason: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-gray-300 h-24 outline-none focus:border-red-500/50"
              />

              {formData.isInternalBlock && (
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Responsable del Desbloqueo</label>
                  <select
                    value={formData.unblockerId}
                    onChange={(e) => setFormData({...formData, unblockerId: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white outline-none"
                  >
                    <option value="">Asignar a...</option>
                    {USERS_MOCK.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#FACC15] hover:bg-yellow-500 text-[#101828] font-black py-5 rounded-[2rem] shadow-2xl shadow-yellow-500/10 transition-all flex items-center justify-center gap-3 tracking-[0.2em] active:scale-95"
            >
              CREAR TAREA <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
