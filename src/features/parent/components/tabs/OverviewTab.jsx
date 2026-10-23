import React, { useState } from 'react';
import {
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  FileText,
  Share2,
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  ChevronLeft,
  MessageSquare,
  ShieldAlert,
  BookOpen,
  ClipboardCheck,
  Send
} from 'lucide-react';
import { GRADE_LABELS } from '../../constants';

export default function OverviewTab({
  child,
  notices = [],
  onSelectTab,
  onSelectReportStudent,
  onSelectCertStudent,
  onShareWhatsapp,
  onAcknowledgeNotice,
  onContactCounselor,
  onOpenRequestModal
}) {
  const [selectedNoticeForAck, setSelectedNoticeForAck] = useState(null);
  const [parentReplyNote, setParentReplyNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!child) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200/80 shadow-xs">
        يرجى اختيار أحد الأبناء من القائمة الجانبية لعرض التقرير الشامل.
      </div>
    );
  }

  // Filter notices for this child
  const childNotices = notices.filter(
    (n) => n.studentName && child.fullName && (child.fullName.includes(n.studentName) || n.studentName.includes(child.fullName))
  );
  const pendingNotices = childNotices.filter((n) => !n.acknowledged);

  const attendanceRate = child.attendance?.rate !== undefined ? child.attendance.rate : 98.5;
  const presentDays = child.attendance?.present !== undefined ? child.attendance.present : (child.attendance?.presentDays !== undefined ? child.attendance.presentDays : 28);
  const absentDays = child.attendance?.absent !== undefined ? child.attendance.absent : (child.attendance?.absentDays !== undefined ? child.attendance.absentDays : 0);

  const submissions = child.progresses || child.Progresses || [];
  const exams = child.examScores || child.ExamScores || [];
  const sports = child.sportsFitness || child.SportsFitness;

  const quickTemplates = [
    'تم التنبيه على الطالب والحرص على الالتزام الكامل بالتعليمات ✓',
    'سيتم الحضور للمدرسة لمقابلة الأخصائي في الموعد المحدد 🤝',
    'تم الاطلاع وسنقوم بالمتابعة الفورية والتواصل مع المدرسة 💜'
  ];

  const handleQuickAck = async (noticeId, note) => {
    setIsSubmitting(true);
    try {
      await onAcknowledgeNotice(noticeId, note);
      setSelectedNoticeForAck(null);
      setParentReplyNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* 1. Child Hero Banner with Direct Actions */}
      <div className="bg-gradient-to-r from-[#190C2E] via-[#35145E] to-[#5C2C90] rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-purple-950/10 border border-purple-800/40 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#E4007C]/15 rounded-full blur-3xl pointer-events-none -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#5C2C90]/30 rounded-full blur-2xl pointer-events-none translate-x-10 translate-y-10"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black bg-[#E4007C] text-white px-3 py-1 rounded-full shadow-2xs">
                ملف الطالب المباشر
              </span>
              {(child.grade || child.classroom) && (
                <span className="text-xs font-bold text-purple-200 bg-white/10 px-3 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                  {child.grade && (GRADE_LABELS[child.grade] || `الصف ${child.grade}`)}
                  {child.grade && child.classroom && ' · '}
                  {child.classroom && `فصل ${child.classroom}`}
                </span>
              )}
              {child.specialty && (
                <span className="text-xs font-bold text-cyan-200 bg-cyan-950/50 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                  {child.specialty === 'programming' ? 'هندسة برمجيات' : child.specialty === 'networking' ? 'هندسة شبكات' : child.specialty === 'communication' ? 'هندسة اتصالات' : 'ذكاء اصطناعي'}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {child.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl font-medium">
              كود الطالب المعتمد: <span className="font-mono text-amber-300 font-bold">{child.studentCode || child.username}</span> · المتابعة اللحظية من منظومة مدارس WE للتكنولوجيا التطبيقية.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectReportStudent(child)}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="طباعة كشف الدرجات الشامل المعتمد"
            >
              <FileText size={15} className="text-purple-200" />
              <span>كشف الدرجات 🖨️</span>
            </button>

            <button
              onClick={() => onSelectCertStudent(child)}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 backdrop-blur-md border border-amber-300/30 px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="طباعة شهادة التقدير الرسمية"
            >
              <Award size={15} className="text-amber-400" />
              <span>شهادة التقدير 🏆</span>
            </button>

            <button
              onClick={() => onShareWhatsapp(child)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
            >
              <Share2 size={15} />
              <span>مشاركة WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Stars */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg border border-amber-100">
              ⭐
            </span>
            <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              حافز تميز
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF6900] font-mono">
            {child.totalStars}
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">إجمالي النجوم المحققة</div>
          <div className="text-[10px] text-slate-400 mt-0.5 group-hover:text-[#5C2C90] transition-colors flex items-center gap-0.5">
            <span>عرض التكليفات والمهام</span>
            <ChevronLeft size={12} />
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div 
          onClick={() => onSelectTab('conduct')}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg border border-emerald-100">
              📅
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              انضباط مدرسي
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            {attendanceRate}%
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">نسبة الحضور والانضباط</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
            {presentDays} يوم حضور {absentDays > 0 ? `· ${absentDays} غياب` : '· بدون غياب'}
          </div>
        </div>

        {/* Card 3: Completed Tasks */}
        <div 
          onClick={() => onSelectTab('submissions')}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5C2C90] flex items-center justify-center text-lg border border-purple-100">
              📝
            </span>
            <span className="text-[10px] font-black text-[#5C2C90] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              عملي ونظري
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#5C2C90] font-mono">
            {child.totalCompleted}
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">تكليفات منجزة بنجاح</div>
          <div className="text-[10px] text-slate-400 mt-0.5 group-hover:text-[#5C2C90] transition-colors flex items-center gap-0.5">
            <span>من أصل {submissions.length} تكليف مسجل</span>
            <ChevronLeft size={12} />
          </div>
        </div>

        {/* Card 4: Sports & Fitness */}
        <div 
          onClick={() => onSelectTab('fitness')}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-lg border border-cyan-100">
              🏃
            </span>
            <span className="text-[10px] font-black text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              لياقة وطابور
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-700 font-mono">
            {sports?.fitnessScore ? `${sports.fitnessScore}%` : '96%'}
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">مستوى اللياقة والبدنية</div>
          <div className="text-[10px] text-cyan-800 font-bold mt-0.5">
            طابور الصباح: {sports?.morningAssemblyStatus || 'ملتزم ومنضبط'}
          </div>
        </div>
      </div>

      {/* 3. URGENT NOTICES SECTION (تنبيه عاجل للمخالفات أو الإنذارات غير الموقعة) */}
      {pendingNotices.length > 0 && (
        <div className="bg-rose-50/70 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg text-rose-900">
                  تنبيه عاجل: توجد ({pendingNotices.length}) ملاحظات انضباط أو غياب تتطلب توقيع واطلاع ولي الأمر
                </h4>
                <p className="text-xs text-rose-700 font-medium">
                  وفق لائحة الانضباط المدرسي المعتمدة لمدارس WE، يرجى الاطلاع وتوثيق ردك لحفظ السجل الأكاديمي لابنك.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('conduct')}
              className="text-xs font-black text-rose-800 bg-white hover:bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer self-start sm:self-auto flex items-center gap-1"
            >
              <span>عرض سجل الانضباط كاملاً</span>
              <ChevronLeft size={14} />
            </button>
          </div>

          {/* Pending Notices Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl p-4.5 border border-rose-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      {notice.category === 'absence' ? 'إنذار غياب' : notice.category === 'uniform' ? 'مخالفة زي مدرسي' : 'مخالفة سلوكية'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {notice.date} {notice.timestamp}
                    </span>
                  </div>

                  <h5 className="font-black text-sm text-slate-900">
                    {notice.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {notice.message}
                  </p>

                  {notice.actionTaken && (
                    <div className="text-[11px] text-rose-800 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                      <span className="font-bold">الإجراء المتخذ: </span>
                      {notice.actionTaken}
                    </div>
                  )}
                </div>

                {/* Inline Acknowledgment Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {selectedNoticeForAck?.id === notice.id ? (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[11px] font-black text-slate-700 block">
                        إفادة وملاحظات ولي الأمر (اختياري):
                      </label>
                      <input
                        type="text"
                        placeholder="اكتب ردك أو اختر من الردود السريعة بالأسفل..."
                        value={parentReplyNote}
                        onChange={(e) => setParentReplyNote(e.target.value)}
                        className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {quickTemplates.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setParentReplyNote(tmpl)}
                            className="text-[10px] font-bold bg-purple-50 text-[#5C2C90] hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 cursor-pointer"
                          >
                            {tmpl}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={isSubmitting}
                          onClick={() => handleQuickAck(notice.id, parentReplyNote)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? 'جارٍ التوثيق...' : 'تأكيد التوقيع والاطلاع رسمياً ✓'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedNoticeForAck(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedNoticeForAck(notice);
                          setParentReplyNote('تم التنبيه على الطالب والحرص على الالتزام الكامل بالتعليمات ✓');
                        }}
                        className="flex-1 bg-[#5C2C90] hover:bg-[#431e6c] text-white py-2 px-3 rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        <span>علم وتم الاطلاع وتأكيد المتابعة</span>
                      </button>

                      <button
                        onClick={() => onContactCounselor(notice)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="مراسلة الأخصائي الاجتماعي واتساب"
                      >
                        <MessageSquare size={14} />
                        <span className="hidden sm:inline">الأخصائي</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Quick Highlights Grid: Submissions + Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Col: Recent Submissions */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-100 text-[#5C2C90] flex items-center justify-center font-bold">
                <ClipboardCheck size={18} />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">
                  آخر التكليفات والمهام المعملية
                </h4>
                <span className="text-[11px] text-slate-400 font-bold block">
                  تقييمات ودرجات المعلمين المباشرة
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('submissions')}
              className="text-xs font-bold text-[#5C2C90] hover:text-[#431e6c] flex items-center gap-0.5 cursor-pointer"
            >
              <span>عرض الكل ({submissions.length})</span>
              <ChevronLeft size={13} />
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs border border-slate-100">
              لا توجد تكليفات مرصودة حالياً.
            </div>
          ) : (
            <div className="space-y-2.5">
              {submissions.slice(0, 3).map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-purple-50/40 hover:border-purple-200 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h5 className="font-black text-xs text-slate-900 truncate">
                      {sub.assignmentTitle}
                    </h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                      {sub.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="font-black text-[#FF6900] text-xs font-mono block">
                        ⭐ {sub.stars}
                      </span>
                      {sub.manualGrade !== null && sub.manualGrade !== undefined && (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {sub.manualGrade}/100
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      sub.status === 'Done'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {sub.status === 'Done' ? 'مكتمل ✓' : 'قيد العمل'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recent Exams */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-slate-900">
                  سجل الاختبارات والكنترول
                </h4>
                <span className="text-[11px] text-slate-400 font-bold block">
                  نتائج الشهور والامتحانات التكوينية
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('exams')}
              className="text-xs font-bold text-[#5C2C90] hover:text-[#431e6c] flex items-center gap-0.5 cursor-pointer"
            >
              <span>عرض الكل ({exams.length})</span>
              <ChevronLeft size={13} />
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs border border-slate-100">
              لا توجد درجات اختبارات مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-2.5">
              {exams.slice(0, 3).map((ex, idx) => {
                const passed = ex.score >= (ex.maxScore * 0.5);
                return (
                  <div
                    key={ex.id || idx}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-amber-50/40 hover:border-amber-200 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h5 className="font-black text-xs text-slate-900 truncate">
                        {ex.examTitle}
                      </h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        {ex.subject} · {ex.examType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="font-black text-[#5C2C90] text-xs font-mono block">
                          {ex.score} / {ex.maxScore}
                        </span>
                        <span className={`text-[10px] font-bold block ${passed ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {passed ? 'اجتياز ✓' : 'تحسين'}
                        </span>
                      </div>
                      {ex.isRemedial && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300">
                          تحسين
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. Educational Guidance Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50/60 border border-purple-200/80 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5C2C90] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Heart size={20} className="text-[#FF6900]" />
          </div>
          <div>
            <h5 className="font-black text-sm text-[#26163A]">
              رسالة توجيه وإرشاد من مدرسة WE للتكنولوجيا التطبيقية
            </h5>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              شجّع ابنك دائماً على الالتزام بحضور طابور الصباح، وارتداء البالطو المعتمد في الورش المعملية، ومتابعة تسليمات المناهج الرقمية؛ لبناء مستقبل تقني رائد.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenRequestModal}
          className="bg-[#5C2C90] hover:bg-[#431e6c] text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Send size={13} />
          <span>تقديم إذن أو عذر جديد</span>
        </button>
      </div>
    </div>
  );
}
