
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await api.getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (user: User) => {
    const success = await api.toggleUserStatus(user.id, !user.isActive);
    if (success) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const saveUserChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const success = await api.updateUserRole(editingUser.id, editingUser.role);
      if (success) {
        setIsEditModalOpen(false);
        fetchUsers();
      }
    }
  };

  const resetPassword = (id: string) => {
    // Supabase Auth reset trigger
    api.logAdminAction('PASSWORD_RESET_TRIGGERED', `Admin initiated password reset for ${id}`, id, 'SECURITY');
    alert(`A neural-link reset request has been dispatched to operator ID: ${id}`);
  };

  return (
    <div className="space-y-8 animate-in slide-up duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Identity Hub</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.4em] uppercase mt-2">Operator Lifecycle & Clearance Management</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 transition-all active:scale-95">
          + Provision New Link
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Personnel Registry</h3>
          <div className="flex gap-4">
             <input type="text" placeholder="Filter handles..." className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-2 text-[10px] text-white focus:outline-none w-64" />
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-20 text-center text-slate-600 font-black uppercase text-xs animate-pulse tracking-widest">Establishing secure link to Identity Cluster...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/20 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800/50">
                <th className="px-10 py-6">Operator & Sector</th>
                <th className="px-10 py-6">Identity Status</th>
                <th className="px-10 py-6">Last Link</th>
                <th className="px-10 py-6 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/20 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-indigo-400 text-xs">
                        {u.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{u.username}</div>
                        <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">{u.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <button 
                      onClick={() => toggleUserStatus(u)} 
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${u.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                    >
                      {u.isActive ? 'Clearance Valid' : 'Link Severed'}
                    </button>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-500 font-mono">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'PENDING'}
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <button onClick={() => resetPassword(u.id)} className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Reset</button>
                    <button onClick={() => handleEdit(u)} className="px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Adjust</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl relative">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Role Escalation / Adjustment</h3>
              <form onSubmit={saveUserChanges} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operator Handle</label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-sm text-slate-400 font-bold">{editingUser?.username}</div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assigned Sector Role</label>
                    <select 
                      value={editingUser?.role} 
                      onChange={e => setEditingUser(prev => prev ? {...prev, role: e.target.value as UserRole} : null)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-sm text-white focus:outline-none font-bold"
                    >
                       {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                 </div>
                 <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-950 border border-slate-800 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20">Sync Role</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
