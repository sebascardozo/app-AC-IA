
import React from 'react';
import { Task, TaskCategory, TaskStatus, UserRole, Permission } from '../types';
import { CATEGORY_COLORS, ROLE_PERMISSIONS, USERS_MOCK } from '../constants';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isActive?: boolean;
  role: UserRole;
  isUnblockQueue?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onSelect, onStatusChange, isActive, role, isUnblockQueue }) => {
  const isSpecialColumn = task.status === TaskStatus.DOCUMENTATION || task.status === TaskStatus.MINUTES;
  const canTrack = ROLE_PERMISSIONS[role].includes(Permission.TRACK_TIME);
  const canManage = ROLE_PERMISSIONS[role].includes(Permission.MANAGE_TASKS_OWN) || ROLE_PERMISSIONS[role].includes(Permission.MANAGE_TASKS_TEAM);

  const formattedDeadline = new Date(task.estimatedCompletionDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const formattedCreation = new Date(task.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const isOverdue = !task.isMinute && new Date(task.estimatedCompletionDate) < new Date() && task.status !== TaskStatus.FINISHED;

  if (task.status === TaskStatus.MINUTES) {
    const sharedAvatars = USERS_MOCK.filter(u => task.sharedWithIds?.includes(u.id));

    return (
      <div 
        onClick={() => onSelect(task)}
        className="bg-[#1e293b]/50 border border-purple-500/30 p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all shadow-lg hover:shadow-purple-500/10 group"
      >
        <div className="flex justify-between items-start mb-3">
           <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-file-signature"></i> MINUTA
          </p>
          <span className="text-[8px] text-gray-600 font-mono italic">{formattedCreation}</span>
        </div>
        <h3 className="font-bold text-sm text-gray-100 group-hover:text-purple-300 transition-colors mb-3">{task.title}</h3>
        
        {task.attachments && task.attachments.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-paperclip text-[10px] text-gray-500"></i>
            <span className="text-[9px] text-gray-500 font-bold">{task.attachments.length} PDFs Adjuntos</span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-800 pt-3">
          <div className="flex -space-x-2">
            {sharedAvatars.map(u => (
              <img key={u.id} src={u.avatar} className="w-5 h-5 rounded-full border border-[#0b0f1a]" title={u.name} />
            ))}
            {sharedAvatars.length === 0 && <span className="text-[8px] text-gray-700 italic">Privada</span>}
          </div>
          <i className="fas fa-chevron-right text-[10px] text-gray-800 group-hover:text-purple-500"></i>
        </div>
      </div>
    );
  }

  if (task.status === TaskStatus.DOCUMENTATION) {
    return (
      <div 
        onClick={() => onSelect(task)}
        className="bg-purple-900/10 border border-purple-500/30 p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform shadow-sm"
      >
        <div className="flex justify-between items-center mb-2">
           <p className="text-[10px] font-bold text-purple-300 uppercase flex items-center gap-2">
            <i className="fas fa-folder"></i> {task.status}
          </p>
        </div>
        <h3 className="font-semibold text-sm text-gray-100">{task.title}</h3>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gray-800 p-4 rounded-xl border-l-4 ${CATEGORY_COLORS[task.category]} shadow-lg transition-all relative group ${isActive ? 'ring-2 ring-blue-500' : ''} ${isUnblockQueue ? 'border-dashed border-2 border-orange-500/50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase w-fit ${CATEGORY_COLORS[task.category]}`}>
            {task.category}
          </span>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className={`text-[9px] font-mono ${isOverdue ? 'text-red-400 font-bold' : 'text-gray-500'}`}>
                <i className="fas fa-calendar-alt mr-1"></i> Límite: {formattedDeadline}
            </span>
            <span className="text-[8px] text-gray-600 font-mono italic">
                <i className="fas fa-plus-circle mr-1"></i> Creado: {formattedCreation}
            </span>
          </div>
        </div>
        
        {canManage && !isUnblockQueue && (
          <select 
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="bg-gray-900 border border-gray-700 text-[9px] text-gray-400 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {Object.values(TaskStatus).filter(s => ![TaskStatus.UNBLOCK_QUEUE, TaskStatus.MINUTES].includes(s)).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        )}
      </div>
      
      <div onClick={() => canTrack && onSelect(task)} className={canTrack ? 'cursor-pointer' : ''}>
        <h3 className="font-semibold text-sm mb-1 text-gray-100 group-hover:text-blue-400 transition-colors">
          {task.title}
        </h3>
        {isUnblockQueue && (
          <p className="text-[10px] text-orange-400 font-bold uppercase mb-2">
            ⚠️ REQUIERE TU ACCIÓN
          </p>
        )}
      </div>
      
      {task.status === TaskStatus.BLOCKED && (
        <div className="mb-3 p-2 bg-red-950/40 border border-red-500/30 rounded-lg">
          <p className="text-[10px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1">
            <i className="fas fa-exclamation-triangle text-[8px]"></i> 
            {task.isInternalBlock ? 'Bloqueo Interno' : 'Bloqueo Externo'}
          </p>
          <p className="text-[11px] text-gray-300 italic mb-1">"{task.blockedReason}"</p>
          {task.isInternalBlock && (
            <p className="text-[9px] text-red-400/80">
              Esperando a: <span className="font-bold underline">{task.unblockerName}</span>
            </p>
          )}
        </div>
      )}

      <div className="border-t border-gray-700/50 pt-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Invertido</span>
            <span className="text-xs text-white font-mono">{task.investedTime}h</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-500 italic">{isUnblockQueue ? `De: ${task.assigneeName}` : ''}</span>
            <img 
              src={task.avatar} 
              className="w-6 h-6 rounded-full border border-gray-700" 
              title={task.assigneeName}
              alt="Avatar" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
