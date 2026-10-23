import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  ExternalLink,
  FileCode,
  HelpCircle,
  AlertTriangle,
  FileCheck,
  Eye
} from 'lucide-react';
import DrivePreviewModal from '../../../../components/modals/DrivePreviewModal';
import { extractDriveUrl } from '../../../../utils/driveUtils';

export default function SubmissionsTab({ child }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', title: '' });

  const submissions = child?.progresses || child?.Progresses || [];

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      (sub.assignmentTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.subject || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'done') return sub.status === 'Done';
    if (statusFilter === 'working') return sub.status === 'Working';
    if (statusFilter === 'late') return sub.isLate;
    if (statusFilter === 'help') return sub.hasRequestedHelp || sub.status === 'Help';

    return true;
  });

  const totalDone = submissions.filter((s) => s.status === 'Done').length;
  const totalStars = submissions.reduce((sum, s) => sum + (s.stars || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Header Info & Stats Summary */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold shrink-0">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              التسليمات والمهام العملية بالمعامل
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              متابعة مباشرة لتكليفات الطالب بالورش والمعامل ودرجات المعلمين وملاحظاتهم.
            </p>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-purple-50 text-[#5C2C90] border border-purple-200 px-3.5 py-1.5 rounded-2xl text-xs font-black">
            <span>⭐ {totalStars} نجمة ممنوحة</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-black">
            <span>{totalDone} / {submissions.length} تكليف مكتمل</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="ابحث باسم التكليف أو المادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `الكل (${submissions.length})` },
            { id: 'done', label: `مكتمل ومصحح (${totalDone})` },
            { id: 'working', label: 'قيد الإنجاز' },
            { id: 'late', label: 'تسليم متأخر' },
            { id: 'help', label: 'طلب مساعدة' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#5C2C90] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List Grid */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/90 shadow-xs space-y-2">
          <FileCode size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">لا توجد تكليفات مطابقة لبحثك</h4>
          <p className="text-xs text-slate-400">
            تأكد من اختيار التصفية المناسبة أو قم بتعديل كلمة البحث.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map((sub, idx) => {
            const isDone = sub.status === 'Done';
            const isWorking = sub.status === 'Working';
            const isHelp = sub.hasRequestedHelp || sub.status === 'Help';
            const isLate = sub.isLate;

            return (
              <div
                key={sub.id || idx}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
              >
                <div>
                  {/* Top Row: Title, Subject, & Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-black text-sm text-slate-900 leading-tight">
                        {sub.assignmentTitle}
                      </h4>
                      <span className="text-[11px] text-[#5C2C90] font-bold block mt-1">
                        {sub.subject}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {isDone ? (
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          <span>تم التصحيح</span>
                        </span>
                      ) : isHelp ? (
                        <span className="text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <HelpCircle size={11} />
                          <span>طلب مساعدة</span>
                        </span>
                      ) : isWorking ? (
                        <span className="text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full">
                          قيد التنفيذ
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                          {sub.status}
                        </span>
                      )}

                      {isLate && (
                        <span className="text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full">
                          تسليم متأخر
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating / Score Row */}
                  <div className="mt-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-[#FF6900] font-mono flex items-center gap-1">
                        ⭐ {sub.stars}
                      </span>
                      {sub.manualGrade !== null && sub.manualGrade !== undefined && (
                        <span className="font-bold text-slate-700 font-mono text-xs border-r border-slate-200 pr-2">
                          الدرجة: {sub.manualGrade} / 100
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock size={11} />
                      {sub.lastActiveAtUtc ? new Date(sub.lastActiveAtUtc).toLocaleDateString('ar-EG') : 'تم التسليم'}
                    </span>
                  </div>

                  {/* Teacher Feedback / Notes if available */}
                  {sub.teacherFeedback && (
                    <div className="mt-3 bg-purple-50/80 border border-purple-100 rounded-2xl p-3 text-xs text-[#5C2C90] space-y-1">
                      <div className="font-black flex items-center gap-1.5 text-xs text-[#5C2C90]">
                        <Sparkles size={13} className="text-[#FF6900]" />
                        <span>تقييم وملاحظات المعلم:</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        "{sub.teacherFeedback}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer File / Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>منصة جاهز · استعد · سلّم</span>
                  {(() => {
                    const subDrive = sub.driveLink || extractDriveUrl(sub.answersJson || '');
                    if (subDrive) {
                      return (
                        <button
                          type="button"
                          onClick={() => setPreviewModal({
                            isOpen: true,
                            url: subDrive,
                            title: `مشروع الطالب: ${sub.assignmentTitle}`
                          })}
                          className="text-[#5C2C90] font-black hover:underline flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-all"
                        >
                          <Eye size={12} />
                          <span>معاينة ملف التسليم داخل المنصة 👁️</span>
                        </button>
                      );
                    }
                    return <span className="text-slate-400">ملف المعمل معتمد</span>;
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-Platform Drive Preview Modal */}
      <DrivePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, url: '', title: '' })}
        url={previewModal.url}
        title={previewModal.title}
      />
    </div>
  );
}
