"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Users, 
  ShieldCheck, 
  UserCircle,
  Search,
  MoreVertical,
  Mail,
  UserCheck
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "psychologist",
    first_name: "",
    last_name: ""
  });

  const fetchUsers = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/users/`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.results || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchUsers();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Usuário criado com sucesso!");
        setShowAddForm(false);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(`Erro: ${JSON.stringify(err)}`);
      }
    } catch (err) {
      toast.error("Falha na conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Gestão de Equipe</h1>
          <p className="text-slate-600 font-medium">Gerencie os psicólogos e atendentes sob sua supervisão.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200"
        >
          <UserPlus size={20} />
          Adicionar Profissional
        </button>
      </header>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Novo Cadastro</h2>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 font-bold">Cancelar</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Username</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</label>
              <input 
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Senha Provisória</label>
              <input 
                required
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Cargo</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all appearance-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="psychologist">Psicólogo</option>
                <option value="attendant">Atendente</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nome</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Sobrenome</label>
              <input 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-all"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all">Salvar Profissional</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <Users className="text-slate-400" />
            <span className="font-black text-slate-900 uppercase tracking-widest text-sm">Profissionais Ativos ({users.length})</span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Buscar por nome ou email..."
              className="bg-white border border-slate-200 rounded-full pl-12 pr-6 py-2 text-sm outline-none focus:border-emerald-500 transition-all w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Profissional</th>
                <th className="px-8 py-4">Cargo</th>
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                        {user.first_name?.[0] || user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{user.first_name} {user.last_name}</div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'psychologist' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {user.role === 'psychologist' ? 'Psicólogo' : 'Atendente'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium">{user.email}</td>
                  <td className="px-8 py-6">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users size={48} className="text-slate-200" />
                      <p className="text-slate-400 font-medium">Nenhum profissional cadastrado ainda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
