"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  FileDown, 
  Brain, 
  Activity, 
  Calendar,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PatientManagementPage() {
  const { data: session } = useSession();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      // In the absence of a direct "patients" list endpoint for instructors, 
      // we use the professional-links or just filter users.
      // For now, let's assume supervisors want to see their linked patients.
      const res = await fetch(`${baseUrl}/api/users/`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Filter only patients
        setPatients((data.results || data).filter((u: any) => u.role === 'patient'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchPatients();
    }
  }, [session]);

  const handleExport = async (patientId: number, type: 'rpd' | 'mood') => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const token = (session as any)?.accessToken;
    
    if (!token) {
      alert("Sessão inválida para download.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/clinical/${type}/export_pdf/?user_id=${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação ou ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paciente_${patientId}_relatorio_${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Ocorreu um erro ao exportar o arquivo do paciente.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Acompanhamento Clínico</h1>
          <p className="text-slate-600 font-medium">Visualize o progresso e baixe relatórios dos seus pacientes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {patients.map((patient: any) => (
          <motion.div 
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl">
                {patient.first_name?.[0] || "P"}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{patient.first_name} {patient.last_name}</h3>
                <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <span>@{patient.username}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>Paciente Premium</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleExport(patient.id, 'rpd')}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
              >
                <Brain size={16} />
                Relatório RPD
              </button>
              <button 
                onClick={() => handleExport(patient.id, 'mood')}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
              >
                <Activity size={16} />
                Relatório Humor
              </button>
              <Link 
                href={`/instrutor/pacientes/${patient.id}`}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                Detalhes
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}

        {patients.length === 0 && !loading && (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Nenhum paciente vinculado encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
