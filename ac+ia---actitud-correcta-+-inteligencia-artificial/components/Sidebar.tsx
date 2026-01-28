
import React from 'react';
import { UserRole } from '../types';
import { MENU_ITEMS_BY_ROLE } from '../constants';

interface SidebarProps {
  role: UserRole;
  onAddTask: () => void;
  onAddMinute: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onAddTask, onAddMinute }) => {
  const menuItems = MENU_ITEMS_BY_ROLE[role];

  return (
    <aside className="w-20 lg:w-64 bg-[#0b0f1a] border-r border-gray-800 flex flex-col items-center lg:items-start p-4 transition-all duration-300 z-50 shadow-2xl">
      <div className="hidden lg:flex flex-col items-center w-full mb-8 px-4 mt-4">
         <div className="flex items-center gap-0.5 text-white font-black text-2xl tracking-tighter">
            <span className="text-[#FACC15] font-light">[</span>
            <span>AC<span className="text-[#FACC15] mx-0.5">+</span>IA</span>
            <span className="text-[#FACC15] font-light">]</span>
         </div>
         <p className="text-[8px] text-gray-600 font-bold tracking-[0.2em] mt-1">BY DESHUMO</p>
      </div>

      <div className="w-full px-2 space-y-3 mb-8">
        {/* Botón Nueva Tarea */}
        <button 
          onClick={onAddTask}
          className="w-full bg-[#FACC15] hover:bg-yellow-500 text-[#101828] py-3.5 rounded-2xl font-black text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/5 active:scale-95 group"
        >
          <span className="font-light opacity-60 group-hover:opacity-100 transition-opacity">[</span>
          <i className="fas fa-plus text-[10px]"></i> NUEVA TAREA
          <span className="font-light opacity-60 group-hover:opacity-100 transition-opacity">]</span>
        </button>

        {/* Botón Nueva Minuta */}
        <button 
          onClick={onAddMinute}
          className="w-full bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 hover:text-white py-3 rounded-2xl font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <i className="fas fa-file-signature text-[11px]"></i> NUEVA MINUTA
        </button>
      </div>

      <div className="hidden lg:block mb-6 px-4 w-full">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] border-b border-gray-800 pb-2">Panel: {role}</p>
      </div>

      <nav className="flex flex-col gap-1 w-full">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group w-full ${index === 0 ? 'bg-slate-800/40 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/30'}`}
          >
            <i className={`fas ${item.icon} text-lg w-6 transition-transform group-hover:scale-110`}></i>
            <span className="hidden lg:inline text-[13px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-auto w-full px-2 py-6">
        <div className="hidden lg:block bg-[#1e293b]/30 rounded-[2rem] p-5 border border-gray-800/50 backdrop-blur-sm shadow-inner">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FACC15] shadow-[0_0_8px_#FACC15]"></div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Soporte IA</p>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium mb-4">¿Optimizar flujo de Q4?</p>
          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[10px] py-2.5 rounded-xl font-black tracking-widest transition-all">
            CONSULTAR
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
