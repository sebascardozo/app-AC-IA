
import React, { useState, useRef } from 'react';
import { Task, TaskCategory, TaskStatus } from '../types';
import { USERS_MOCK } from '../constants';

interface AddMinuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (minute: Partial<Task>) => void;
}

const AddMinuteModal: React.FC<AddMinuteModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sharedWithIds: [] as string[],
    attachments: [] as string[]
  });
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    
    onAdd({
      ...formData,
      status: TaskStatus.MINUTES,
      category: TaskCategory.ROUTINE,
      isMinute: true,
      investedTime: '00:00',
      estimatedTime: 0,
      frequency: 'Reunión',
      estimatedCompletionDate: new Date().toISOString()
    });
    
    onClose();
  };

  const toggleShare = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sharedWithIds: prev.sharedWithIds.includes(id) 
        ? prev.sharedWithIds.filter(uid => uid !== id)
        : [...prev.sharedWithIds, id]
    }));
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, linkInput.trim()] }));
      setLinkInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, `Local: ${file.name}`] }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/95 backdrop-blur-xl p-4">
      <div className="w-full max-w-xl bg-[#101828] border border-gray-800 shadow-2xl rounded-[3rem] p-10 overflow-y-auto animate-slide-up max-h-[90vh]">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tighter">
            <span className="text-purple-500 font-light text-3xl">[</span>
            REGISTRO DE MINUTA
            <span className="text-purple-500 font-light text-3xl">]</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Título de la Sesión</label>
            <input
              type="text"
              required
              placeholder="Ej. Acta de Directorio Mayo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Resumen / Acuerdos</label>
            <textarea
              required
              placeholder="Escribe los puntos clave discutidos..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-gray-800 rounded-2xl px-5 py-4 text-sm text-white h-40 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-4">
             <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Compartir con Equipo</label>
             <div className="flex flex-wrap gap-3">
                {USERS_MOCK.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleShare(u.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${formData.sharedWithIds.includes(u.id) ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'}`}
                  >
                    <img src={u.avatar} className="w-5 h-5 rounded-full" alt={u.name} />
                    <span className="text-[10px] font-bold">{u.name}</span>
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Documentos y Enlaces PDF</label>
            
            {/* Input para Enlace */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <i className="fas fa-link absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs"></i>
                <input
                  type="text"
                  placeholder="Pegar enlace del PDF alojado (Drive, Dropbox, etc.)"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <button 
                type="button"
                onClick={handleAddLink}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-xl text-[10px] font-black transition-all"
              >
                AÑADIR
              </button>
            </div>

            {/* Selector de archivo local oculto */}
            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />

            <div className="grid grid-cols-1 gap-3">
               {formData.attachments.map((file, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800 animate-slide-up">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <i className="fas fa-file-pdf text-red-500 shrink-0"></i>
                      <span className="text-[9px] text-gray-400 truncate tracking-tight">{file}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="text-gray-600 hover:text-red-500 transition-colors ml-2"
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                 </div>
               ))}
               
               <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-4 bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-xl hover:border-purple-500/50 hover:text-purple-400 transition-all text-[9px] font-bold text-gray-600"
               >
                 <i className="fas fa-upload"></i> O ELEGIR ARCHIVO LOCAL (PDF)
               </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-purple-500/10 transition-all flex items-center justify-center gap-3 tracking-[0.2em] active:scale-95"
            >
              REGISTRAR MINUTA <i className="fas fa-check text-xs"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMinuteModal;
