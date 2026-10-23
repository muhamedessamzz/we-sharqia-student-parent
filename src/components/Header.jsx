import React from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Header({ user, onLogout }) {
  const isParent = user?.role === 'parent';
  return (
    <header className={`sticky top-3 sm:top-4 z-50 px-4 sm:px-6 w-full ${isParent ? 'max-w-[1440px]' : 'max-w-6xl'} mx-auto transition-all`}>
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-200/50 rounded-2xl px-4 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand with Purple Crest Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/Purple Code and Signal Crest.png"
            alt="شعار مدارس WE للتكنولوجيا التطبيقية"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0 drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-tight">
              مدارس WE · الشرقية
            </span>
            <span className="text-[10px] text-[#5C2C90] font-bold hidden sm:inline leading-none mt-0.5">
              بوابة الطلاب وأولياء الأمور
            </span>
          </div>
        </div>

        {/* User Profile & Actions */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell user={user} />

            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                {user.fullName}
              </span>
              {user.classroom && (
                <span className="text-[10px] font-bold text-[#5C2C90] bg-[#5C2C90]/10 px-1.5 py-0.5 rounded-md font-mono border border-[#5C2C90]/20">
                  فصل {user.classroom}
                </span>
              )}
            </div>

            <span className="text-slate-300">|</span>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50 font-semibold"
              title="تسجيل الخروج"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          <a
            href="http://localhost:5174"
            className="flex items-center gap-1.5 text-xs font-bold text-[#5C2C90] bg-purple-50 hover:bg-purple-100 border border-purple-200/70 px-3 py-1.5 rounded-xl transition-all"
            title="الانتقال إلى بوابة المعلمين والإدارة"
          >
            <span>بوابة المعلمين والإدارة</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </header>
  );
}
