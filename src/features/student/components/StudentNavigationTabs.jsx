import React from 'react';
import { BookOpen, PlayCircle, Calendar, CheckCircle2 } from 'lucide-react';

export default function StudentNavigationTabs({
  tab,
  setTab,
  assignmentsCount = 0,
  videosCount = 0
}) {
  const tabs = [
    { id: 'home', title: 'التكليفات والاختبارات', count: assignmentsCount, icon: BookOpen },
    { id: 'videos', title: 'الفيديوهات التعليمية', count: videosCount, icon: PlayCircle },
    { id: 'schedule', title: 'الجدول الدراسي', icon: Calendar },
    { id: 'skills', title: 'المهارات الرقمية', icon: CheckCircle2 }
  ];

  return (
    <div className="w-full bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/70">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer select-none text-center ${
                isActive
                  ? 'bg-[#5C2C90] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="truncate">{t.title}</span>
              {t.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
