import React from 'react';
import {
  Home,
  ClipboardCheck,
  BookOpen,
  ShieldAlert,
  Activity,
  FileCheck,
  Printer,
  Award,
  MessageSquare,
  Send,
  X,
  User,
  Users,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { GRADE_LABELS } from '../constants';

export default function ParentSidebar({
  user,
  child,
  activeTab,
  onSelectTab,
  pendingNoticesCount = 0,
  parentRequestsCount = 0,
  submissionsCount = 0,
  examsCount = 0,
  onOpenRequestModal,
  onSelectReportStudent,
  onSelectCertStudent,
  onShareWhatsapp,
  isMobileOpen = false,
  onCloseMobile
}) {
  const selectedChild = child;
  const navItems = [
    {
      id: 'overview',
      title: 'الرئيسية ونظرة عامة',
      icon: Home,
      badge: pendingNoticesCount > 0 ? `${pendingNoticesCount} تنبيه` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'schedule',
      title: 'الجدول الدراسي الأسبوعي',
      icon: Calendar,
      badge: '8 حصص',
      badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
    },
    {
      id: 'submissions',
      title: 'التسليمات والواجبات والمستوى',
      icon: ClipboardCheck,
      badge: submissionsCount > 0 ? submissionsCount : null,
      badgeColor: 'bg-purple-100 text-[#5C2C90]',
    },
    {
      id: 'exams',
      title: 'الامتحانات والكنترول والتحسين',
      icon: BookOpen,
      badge: examsCount > 0 ? examsCount : null,
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'conduct',
      title: 'الانضباط والسلوك والإنذارات',
      icon: ShieldAlert,
      badge: pendingNoticesCount > 0 ? 'يتطلب توقيع' : null,
      badgeColor: 'bg-rose-100 text-rose-800 border border-rose-300',
    },
    {
      id: 'fitness',
      title: 'اللياقة وطابور الصباح',
      icon: Activity,
      badge: null,
    },
    {
      id: 'requests',
      title: 'الطلبات والاستئذان والأعذار',
      icon: FileCheck,
      badge: parentRequestsCount > 0 ? parentRequestsCount : null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <>
      {/* 1. Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 2. Responsive Sidebar: Fixed drawer on mobile, static card/sticky on desktop */}
      <aside
        className={`fixed lg:sticky top-3 lg:top-4 right-3 lg:right-0 w-72 sm:w-80 h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-6rem)] bg-white rounded-3xl border border-slate-200/90 shadow-xl lg:shadow-md shadow-purple-950/5 z-50 flex flex-col justify-between p-4.5 transition-transform duration-300 ease-in-out shrink-0 text-right ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-[120%] lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Header: Brand & Mobile Close */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 p-1.5 border border-purple-100/80 flex items-center justify-center shrink-0 shadow-2xs">
                <img
                  src="/Purple Code and Signal Crest.png"
                  alt="شعار مدارس WE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <span className="font-black text-slate-900 text-sm tracking-tight block truncate">
                  مدارس WE للتكنولوجيا
                </span>
                <span className="text-[11px] font-bold text-[#5C2C90] block -mt-0.5">
                  بوابة أولياء الأمور
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Guardian Profile Mini-Card */}
          <div className="mt-3 p-3 rounded-2xl bg-gradient-to-l from-purple-50/70 to-slate-50 border border-purple-100/80 shrink-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-black text-slate-900 truncate block">
                    {user?.fullName || 'ولي الأمر'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                  حساب معتمد للوصول المباشر
                </span>
              </div>

              <button
                onClick={onOpenRequestModal}
                className="bg-white hover:bg-purple-100 text-[#5C2C90] border border-purple-200/80 p-2 rounded-xl text-xs font-black shadow-2xs transition-all cursor-pointer"
                title="تقديم طلب أو إذن خروج جديد"
              >
                <Send size={13} />
              </button>
            </div>
          </div>

          {/* Dedicated Student Info Card (1 Student per Login Session) */}
          {selectedChild && (
            <div className="mt-3 p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5C2C90] to-[#E4007C] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                  {selectedChild.fullName ? selectedChild.fullName.charAt(0) : 'ط'}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 block leading-tight">
                    بيانات الطالب التابع:
                  </span>
                  <div className="font-black text-xs text-slate-900 truncate">
                    {selectedChild.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold font-mono">
                    كود: {selectedChild.studentCode || selectedChild.username}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px] font-bold">
                <span className="text-[#5C2C90] bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                  {selectedChild.grade ? (GRADE_LABELS[selectedChild.grade] || `الصف ${selectedChild.grade}`) : 'طالب مدرسي'}
                </span>
                {selectedChild.classroom && (
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg font-mono">
                    فصل {selectedChild.classroom}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links List */}
          <nav className="flex-1 my-3 space-y-1 overflow-y-auto scrollbar-none pr-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-l from-[#5C2C90] to-[#7B3FA8] text-white shadow-md shadow-purple-900/20'
                      : 'text-slate-600 hover:bg-purple-50/60 hover:text-[#5C2C90]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate">{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Print & Counselor Footer Actions */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 shrink-0">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectReportStudent && onSelectReportStudent(selectedChild)}
                className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200/80 p-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="طباعة كشف الدرجات الشامل المعتمد"
              >
                <Printer size={13} />
                <span>كشف الدرجات</span>
              </button>

              <button
                onClick={() => onSelectCertStudent && onSelectCertStudent(selectedChild)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 p-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="طباعة شهادة التقدير الرسمية"
              >
                <Award size={13} className="text-amber-600" />
                <span>شهادة التقدير</span>
              </button>
            </div>

            <button
              onClick={() => onShareWhatsapp && onShareWhatsapp(selectedChild)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <MessageSquare size={13} />
              <span>مراسلة الأخصائي / مشاركة WhatsApp</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
