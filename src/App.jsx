import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthView from './components/AuthView';
import StudentView from './components/StudentView';
import ParentView from './components/ParentView';
import FirstLoginPasswordModal from './components/FirstLoginPasswordModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('we_sharkia_portal_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('we_sharkia_portal_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('we_sharkia_portal_user');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-[#F8F5FC] text-[#26163A]">
        {/* Compact Header for Login */}
        <header className="px-4 pt-3 sm:pt-4 w-full max-w-5xl mx-auto shrink-0">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs rounded-2xl px-4 sm:px-5 h-12 sm:h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/Purple Code and Signal Crest.png"
                alt="شعار مدارس WE للتكنولوجيا التطبيقية"
                className="w-8 h-8 object-contain drop-shadow-xs"
              />
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                مدارس WE للتكنولوجيا التطبيقية · فرع الشرقية
              </span>
            </div>
            <a
              href="http://localhost:5174"
              className="flex items-center gap-1.5 text-xs font-bold text-[#5C2C90] hover:text-[#421d69] bg-purple-50 hover:bg-purple-100 border border-purple-200/70 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>بوابة المعلمين والإدارة</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </header>

        {/* Center Auth Card with Zero Scroll */}
        <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <AuthView onLoginSuccess={setCurrentUser} />
        </main>

        {/* Compact Footer */}
        <footer className="py-2.5 text-center text-[11px] text-slate-400 font-medium shrink-0">
          منظومة مدارس WE للتكنولوجيا التطبيقية · الشركة المصرية للاتصالات Telecom Egypt © 2026
        </footer>
      </div>
    );
  }

  const renderRoleDashboard = () => {

    const r = currentUser.role?.toLowerCase();
    if (r === 'parent') {
      return <ParentView user={currentUser} />;
    } else if (r === 'student') {
      return <StudentView user={currentUser} />;
    }

    // If a staff user logs into portal by mistake
    return (
      <div className="bg-white rounded-3xl p-8 max-w-lg mx-auto text-center border border-slate-200/80 shadow-md space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center text-3xl">
          🏫
        </div>
        <h3 className="text-xl font-black text-slate-900">أهلًا بك {currentUser.fullName}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          حسابك مخصص للمعلمين وإدارة المدرسة ({currentUser.role}). للوصول إلى لوحة التحكم الخاصة بك، تفضل بالانتقال إلى بوابة المعلمين والإدارة.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="http://localhost:5174"
            className="bg-[#5C2C90] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-95 shadow-md shadow-purple-900/20 transition-all inline-block"
          >
            الانتقال إلى بوابة المعلمين والإدارة ↗
          </a>
          <button
            onClick={handleLogout}
            className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5FC] text-[#26163A]">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className={`flex-1 w-full ${currentUser?.role === 'parent' ? 'max-w-[1440px]' : 'max-w-6xl'} mx-auto px-4 sm:px-6 py-6 sm:py-8 ${!currentUser ? 'flex items-center justify-center' : ''}`}>
        {renderRoleDashboard()}
      </main>
      <Footer />

      {/* Mandatory First-Login Password Change Modal */}
      {currentUser.mustChangePassword && (
        <FirstLoginPasswordModal
          user={currentUser}
          onPasswordChanged={() => {
            const updated = { ...currentUser, mustChangePassword: false };
            setCurrentUser(updated);
            localStorage.setItem('we_sharkia_portal_user', JSON.stringify(updated));
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
