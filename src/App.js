// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { auth, db } from './firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// --- Constantes compartilhadas ---
const PROFESSORES = ['João Leite', 'Rui Silva', 'Sónia Pinto', 'Natália Cardoso', 'Ana Teixeira', 'Ricardo Silveira'];
const DISCIPLINAS = ['CloudOps e Cloud Automation', 'Fundamentos de Python', 'Inglês', 'Matemática', 'Português', 'Educação Física'];
const TURMAS = ['PI01', 'PI02', 'CC03', 'TE02'];
const DAYS_OF_WEEK = ['2ª Feira', '3ª Feira', '4ª Feira', '5ª Feira', '6ª Feira'];
const TIME_SLOTS = ['08:45 - 10:15', '10:30 - 12:00', '12:05 - 13:35', '14:15 - 16:30'];

// --- ScheduleGrid ---
const ScheduleGrid = ({ schedule, turma, isStudent = false }) => {
  const scheduleRef = useRef();

  const handleDownloadPDF = () => {
    if (!scheduleRef.current || !window.jspdf || !window.html2canvas) {
      alert("Aguarde um momento e tente novamente.");
      return;
    }
    const { jsPDF } = window.jspdf;
    window.html2canvas(scheduleRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      let width = pdfWidth;
      let height = width / ratio;
      if (height > pdfHeight) {
        height = pdfHeight;
        width = height * ratio;
      }
      pdf.setFontSize(18);
      pdf.text(`Horário da Turma: ${turma}`, 20, 30);
      pdf.addImage(imgData, 'PNG', (pdfWidth - width) / 2, 40, width, height);
      pdf.save(`horario-${turma}.pdf`);
    });
  };

  return (
    <div>
      {isStudent && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Baixar Horário (PDF)
          </button>
        </div>
      )}
      <div ref={scheduleRef} className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-6 gap-px bg-gray-200 border border-gray-200">
          <div className="bg-gray-100 p-2 font-bold text-center">Horas</div>
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="bg-gray-100 p-2 font-bold text-center">{day}</div>
          ))}
          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              <div className="bg-gray-100 p-2 font-bold text-center flex items-center justify-center">{time}</div>
              {DAYS_OF_WEEK.map((day) => {
                const entry = schedule.find(item => item.dia === day && item.hora === time);
                return (
                  <div key={`${day}-${time}`} className="bg-white p-2 min-h-[80px] flex flex-col justify-center items-center text-center">
                    {entry ? (
                      <>
                        <p className="font-semibold">{entry.disciplina}</p>
                        <p className="text-sm text-gray-600">{entry.professor}</p>
                      </>
                    ) : <p className="text-gray-400">-</p>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
function AdminDashboard() {
  const [schedules, setSchedules] = useState({});
  const [novaLinha, setNovaLinha] = useState({ turma: TURMAS[0], dia: '', hora: '', disciplina: '', professor: '' });

  useEffect(() => {
    const unsubscribes = TURMAS.map((turma) => {
      const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, turma);
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setSchedules(prev => ({ ...prev, [turma]: docSnap.data() }));
        } else {
          setSchedules(prev => ({ ...prev, [turma]: { entries: [], published: false } }));
        }
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const adicionarHorario = async () => {
    if (!novaLinha.turma || !novaLinha.dia || !novaLinha.hora || !novaLinha.disciplina || !novaLinha.professor) return;
    const currentSchedule = schedules[novaLinha.turma]?.entries || [];
    const updatedEntries = [...currentSchedule, { ...novaLinha, id: Date.now().toString() }];
    const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, novaLinha.turma);
    await setDoc(docRef, { entries: updatedEntries, published: schedules[novaLinha.turma]?.published || false }, { merge: true });
    setNovaLinha({ turma: TURMAS[0], dia: '', hora: '', disciplina: '', professor: '' });
  };

  const removerHorario = async (turma, entryId) => {
    const currentSchedule = schedules[turma]?.entries || [];
    const updatedEntries = currentSchedule.filter(entry => entry.id !== entryId);
    const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, turma);
    await setDoc(docRef, { entries: updatedEntries }, { merge: true });
  };

  const togglePublish = async (turma) => {
    const currentStatus = schedules[turma]?.published || false;
    const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, turma);
    await updateDoc(docRef, { published: !currentStatus });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Gerir Horários</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg">
        <select value={novaLinha.turma} onChange={(e) => setNovaLinha({ ...novaLinha, turma: e.target.value })} className="border p-2 rounded">
          {TURMAS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={novaLinha.dia} onChange={(e) => setNovaLinha({ ...novaLinha, dia: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione o Dia</option>
          {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={novaLinha.hora} onChange={(e) => setNovaLinha({ ...novaLinha, hora: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione a Hora</option>
          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={novaLinha.disciplina} onChange={(e) => setNovaLinha({ ...novaLinha, disciplina: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione a Disciplina</option>
          {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={novaLinha.professor} onChange={(e) => setNovaLinha({ ...novaLinha, professor: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione o Professor</option>
          {PROFESSORES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={adicionarHorario} className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 col-span-1 md:col-span-2 lg:col-span-1">Adicionar</button>
      </div>

      {TURMAS.map((t) => (
        <div key={t} className="mb-8 p-4 border rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Horário da Turma {t}</h3>
            <button
              onClick={() => togglePublish(t)}
              className={`${schedules[t]?.published ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-lg transition`}
            >
              {schedules[t]?.published ? 'Despublicar' : 'Publicar'}
            </button>
          </div>

          <ScheduleGrid schedule={schedules[t]?.entries || []} turma={t} />

          <h4 className="font-bold mt-4 mb-2">Aulas Adicionadas</h4>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Dia</th>
                <th className="border p-2">Hora</th>
                <th className="border p-2">Disciplina</th>
                <th className="border p-2">Professor</th>
                <th className="border p-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {(schedules[t]?.entries || []).map((h) => (
                <tr key={h.id}>
                  <td className="border p-2">{h.dia}</td>
                  <td className="border p-2">{h.hora}</td>
                  <td className="border p-2">{h.disciplina}</td>
                  <td className="border p-2">{h.professor}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => removerHorario(t, h.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </motion.div>
  );
}

// --- Professor Dashboard ---
function ProfessorDashboard({ user }) {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [novaDisp, setNovaDisp] = useState({ dia: '', hora: '', disciplina: '', turma: '' });
  const [professorName, setProfessorName] = useState('');
  const professorDocId = user.uid;

  useEffect(() => {
    if (!professorDocId) return;
    const docRef = doc(db, `artifacts/default-app-id/public/data/availabilities`, professorDocId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfessorName(data.professorName || '');
        setDisponibilidades(data.slots || []);
      }
    });
    return () => unsubscribe();
  }, [professorDocId]);

  const handleSave = async () => {
    if (!professorName) {
      alert("Selecione seu nome");
      return;
    }
    const docRef = doc(db, `artifacts/default-app-id/public/data/availabilities`, professorDocId);
    await setDoc(docRef, { professorName, slots: disponibilidades }, { merge: true });
    alert("Disponibilidade salva!");
  };

  const adicionarDisponibilidade = () => {
    if (!novaDisp.dia || !novaDisp.hora || !novaDisp.disciplina || !novaDisp.turma) return;
    setDisponibilidades(prev => [...prev, { ...novaDisp, id: Date.now().toString() }]);
    setNovaDisp({ dia: '', hora: '', disciplina: '', turma: '' });
  };

  const removerDisponibilidade = (id) => {
    setDisponibilidades(prev => prev.filter(d => d.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Minhas Disponibilidades</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Selecione o seu nome:</label>
        <select value={professorName} onChange={(e) => setProfessorName(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Selecione o seu nome</option>
          {PROFESSORES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4 p-4 border rounded-lg">
        <select value={novaDisp.turma} onChange={(e) => setNovaDisp({ ...novaDisp, turma: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione a Turma</option>
          {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={novaDisp.dia} onChange={(e) => setNovaDisp({ ...novaDisp, dia: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione o Dia</option>
          {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={novaDisp.hora} onChange={(e) => setNovaDisp({ ...novaDisp, hora: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione a Hora</option>
          {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={novaDisp.disciplina} onChange={(e) => setNovaDisp({ ...novaDisp, disciplina: e.target.value })} className="border p-2 rounded">
          <option value="">Selecione a Disciplina</option>
          {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={adicionarDisponibilidade} className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">Adicionar</button>
      </div>
      <table className="w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Turma</th>
            <th className="border p-2">Dia</th>
            <th className="border p-2">Hora</th>
            <th className="border p-2">Disciplina</th>
            <th className="border p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidades.map(d => (
            <tr key={d.id}>
              <td className="border p-2">{d.turma}</td>
              <td className="border p-2">{d.dia}</td>
              <td className="border p-2">{d.hora}</td>
              <td className="border p-2">{d.disciplina}</td>
              <td className="border p-2 text-center">
                <button onClick={() => removerDisponibilidade(d.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave} className="w-full bg-green-600 text-white rounded p-3 hover:bg-green-700">Salvar Minhas Disponibilidades</button>
    </motion.div>
  );
}

// --- Aluno Dashboard ---
function AlunoDashboard({ turma }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!turma) return;
    const docRef = doc(db, `artifacts/default-app-id/public/data/schedules`, turma);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().published) {
        setSchedule(docSnap.data().entries);
      } else {
        setSchedule(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [turma]);

  if (loading) return <p>A verificar horário...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {schedule ? (
        <ScheduleGrid schedule={schedule} turma={turma} isStudent={true} />
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">Horário Indisponível</h2>
          <p className="text-gray-600">O horário para a turma {turma} ainda não foi publicado pela administração.</p>
        </div>
      )}
    </motion.div>
  );
}

// --- App principal ---
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [turma, setTurma] = useState('');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
  console.log("Iniciando verificação de autenticação...");

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("onAuthStateChanged chamado", firebaseUser);

    if (!firebaseUser) {
      console.log("Nenhum usuário logado, tentando login anônimo...");
      try {
        const result = await signInAnonymously(auth);
        console.log("Login anônimo realizado:", result.user);
      } catch (error) {
        console.error("Erro no login anônimo:", error);
        alert("Erro ao logar anonimamente: " + error.message);
      }
    } else {
      console.log("Usuário já logado:", firebaseUser);
    }

    setAuthReady(true);
  });

  return () => unsubscribe();
}, []);


  const handleLogin = (e) => {
    e.preventDefault();
    const senhas = { admin: 'admin123', professor: 'prof123', aluno: 'aluno123' };
    if (!role) return;
    if (password === senhas[role]) {
      const userData = { name: 'Usuário', role, turma: role === 'aluno' ? turma.toUpperCase() : null, uid: auth.currentUser?.uid || 'anonymous' };
      setUser(userData);
    } else alert("Senha incorreta!");
  };

  const handleLogout = () => {
    setUser(null);
    setRole('');
    setPassword('');
    setTurma('');
  };

  if (!authReady) return <div className="flex items-center justify-center h-screen bg-gray-100"><p>Carregando...</p></div>;

  if (!user) {
    return (
      <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 font-sans">
        <header className="w-full p-4 flex justify-center">
          <img src="/imagens/logo-epalc.png" alt="EPALC Logo" className="h-24 filter invert(1)" />
        </header>
        <main className="flex items-center justify-center flex-grow w-full px-4">
          <motion.div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Portal de Horários</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required>
                <option value="">Selecione o tipo de acesso</option>
                <option value="admin">Administração</option>
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </select>

              {role === 'aluno' && (
                <input type="text" placeholder="Digite sua turma (ex: PI01)" value={turma} onChange={(e) => setTurma(e.target.value)} className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
              )}

              {role && (
                <input type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" required />
              )}

              <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105">Entrar</button>
            </form>
          </motion.div>
        </main>
        <footer className="w-full p-4 flex justify-center">
          <img src="/imagens/logo-parceiros.png" alt="Partners Logo" className="h-12 filter invert(1)" />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">
          Bem-vindo, <span className="capitalize">{user.role}</span> {user.turma && `(Turma: ${user.turma})`}
        </h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-sm">Sair</button>
      </div>
      <div className="max-w-7xl mx-auto">
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'professor' && <ProfessorDashboard user={user} />}
        {user.role === 'aluno' && <AlunoDashboard turma={user.turma} />}
      </div>
    </div>
  );
}