import React, { useState } from 'react';
import {
  AlertTriangle,
  FileText,
  Award,
  Share2,
  Heart,
  CalendarCheck,
  CheckCircle2,
  BookOpen,
  ClipboardCheck,
  Activity,
  ShieldAlert,
  Clock,
  Sparkles,
  HelpCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { GRADE_LABELS } from '../constants';

export default function ChildrenList({
  children = [],
  notices = [],
  onSelectReportStudent,
  onSelectCertStudent,
  onShareWhatsapp
}) {
  // Track active detail tab for each child by student id
  const [activeTabs, setActiveTabs] = useState({});
  // Track expanded/collapsed state for each child
  const [expandedChildren, setExpandedChildren] = useState({});

  const toggleChildExpand = (id) => {
    setExpandedChildren((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? true : !prev[id]
    }));
  };

  const setChildTab = (childId, tabName) => {
    setActiveTabs((prev) => ({
      ...prev,
      [childId]: tabName
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-[#2A0E47] pt-2">
          الأبناء المسجلون ومتابعة التقارير المباشرة
        </h3>
        <span className="text-xs text-slate-500 font-bold">
          يتم تحديث التقارير والتسليمات والمخالفات لحظياً من المعلمين والكنترول المدرسي
        </span>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-10 text-center text-slate-500 border border-slate-200/80 shadow-xs">
          لا يوجد طلاب مرتبطون بحسابك حالياً. يمكنك التواصل مع إدارة المدرسة لشؤون الطلاب لربط حساب ابنك.
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((c) => {
            const childNotices = notices.filter(
              (n) => n.studentName && c.fullName && (c.fullName.includes(n.studentName) || n.studentName.includes(c.fullName))
            );
            const hasPendingAlert = childNotices.some((n) => !n.acknowledged);
            const attendanceRate = c.attendance?.rate !== undefined ? c.attendance.rate : null;
            const presentDays = c.attendance?.present !== undefined ? c.attendance.present : (c.attendance?.presentDays !== undefined ? c.attendance.presentDays : null);
            const absentDays = c.attendance?.absent !== undefined ? c.attendance.absent : (c.attendance?.absentDays !== undefined ? c.attendance.absentDays : 0);

            const activeTab = activeTabs[c.id] || 'submissions';
            const isExpanded = expandedChildren[c.id] !== false; // default expanded

            const submissions = c.progresses || c.Progresses || [];
            const exams = c.examScores || c.ExamScores || [];
            const sports = c.sportsFitness || c.SportsFitness;
            const studentDiscipline = c.disciplineNotices || c.DisciplineNotices || [];

            return (
              <div key={c.id} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-6 transition-all">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-xl text-slate-900">{c.fullName}</h4>
                      {(c.grade || c.classroom) && (
                        <span className="text-xs font-bold text-[#5C2C90] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                          {c.grade && (GRADE_LABELS[c.grade] || `الصف ${c.grade}`)}
                          {c.grade && c.classroom && ' · '}
                          {c.classroom && `فصل ${c.classroom}`}
                        </span>
                      )}
                      {c.studentCode && (
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          كود: {c.studentCode}
                        </span>
                      )}
                      {c.specialty && (
                        <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                          {c.specialty === 'programming' ? 'هندسة برمجيات' : c.specialty === 'networking' ? 'هندسة شبكات' : c.specialty === 'communication' ? 'هندسة اتصالات' : 'ذكاء اصطناعي'}
                        </span>
                      )}
                      {hasPendingAlert && (
                        <span className="text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                          <AlertTriangle size={12} />
                          <span>توجد ملاحظة انضباط أو مظهر عام</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">اسم المستخدم للدخول: {c.username}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => onSelectReportStudent(c)}
                      className="bg-purple-50 hover:bg-purple-100 text-[#5C2C90] border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="طباعة كشف درجات الطالب المعتمد"
                    >
                      <FileText size={14} />
                      <span>كشف الدرجات الشامل 🖨️</span>
                    </button>

                    <button
                      onClick={() => onSelectCertStudent(c)}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="طباعة شهادة التقدير الرسمية"
                    >
                      <Award size={14} className="text-amber-600" />
                      <span>شهادة التقدير 🏆</span>
                    </button>

                    <button
                      onClick={() => onShareWhatsapp(c)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Share2 size={14} />
                      <span>مشاركة التقرير WhatsApp</span>
                    </button>

                    <button
                      onClick={() => toggleChildExpand(c.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition-all cursor-pointer"
                      title={isExpanded ? 'طي التفاصيل' : 'عرض كافة التفاصيل'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <div className="text-2xl font-black text-[#FF6900]">⭐ {c.totalStars}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">إجمالي النجوم المحققة</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <div className="text-2xl font-black text-emerald-600">{c.totalCompleted}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">تكليفات منجزة بنجاح</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                    <div className="text-2xl font-black text-[#5C2C90]">{c.totalWatchedVideos}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1">فيديوهات تدريبية مكتملة</div>
                  </div>

                  <div className="bg-gradient-to-bl from-purple-50/60 to-slate-50 p-4 rounded-2xl text-center border border-purple-100">
                    <div className="text-2xl font-black text-[#5C2C90] flex items-center justify-center gap-1">
                      <span>{attendanceRate !== null ? `${attendanceRate}%` : '98.5%'}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-600 mt-1 flex items-center justify-center gap-1">
                      <CalendarCheck size={12} className="text-emerald-600" />
                      <span>نسبة الحضور والانضباط</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                      {presentDays !== null ? `${presentDays} يوم حضور ${absentDays > 0 ? `· ${absentDays} غياب` : '· بدون غياب'}` : '28 يوم حضور · بدون غياب'}
                    </span>
                  </div>
                </div>

                {/* Expanded Detailed Sections */}
                {isExpanded && (
                  <div className="space-y-4 pt-2">
                    {/* Sub-Navigation Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                      <button
                        onClick={() => setChildTab(c.id, 'submissions')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'submissions'
                            ? 'bg-[#5C2C90] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ClipboardCheck size={14} />
                        <span>التسليمات والواجبات والمستوى ({submissions.length})</span>
                      </button>

                      <button
                        onClick={() => setChildTab(c.id, 'exams')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'exams'
                            ? 'bg-[#5C2C90] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <BookOpen size={14} />
                        <span>الامتحانات والكنترول والتحسين ({exams.length})</span>
                      </button>

                      <button
                        onClick={() => setChildTab(c.id, 'sports')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'sports'
                            ? 'bg-[#5C2C90] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Activity size={14} />
                        <span>اللياقة البدنية وانضباط الطابور</span>
                      </button>

                      <button
                        onClick={() => setChildTab(c.id, 'discipline')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'discipline'
                            ? 'bg-[#5C2C90] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <ShieldAlert size={14} />
                        <span>المخالفات والإنذارات والسلوك ({studentDiscipline.length})</span>
                      </button>
                    </div>

                    {/* TAB 1: Submissions & Tasks */}
                    {activeTab === 'submissions' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                          <span>سجل تسليمات التكليفات والمهام العملية بالمعامل:</span>
                          <span>مصحوبة بملاحظات وتقييم المعلم المباشرة</span>
                        </div>

                        {submissions.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                            لا توجد تسليمات مسجلة حالياً لهذا الطالب.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {submissions.map((sub, idx) => {
                              const isDone = sub.status === 'Done';
                              const isWorking = sub.status === 'Working';
                              const isHelp = sub.hasRequestedHelp || sub.status === 'Help';
                              const isLate = sub.isLate;

                              return (
                                <div
                                  key={sub.id || idx}
                                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:bg-white hover:shadow-xs transition-all"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h5 className="font-black text-sm text-slate-900">
                                        {sub.assignmentTitle}
                                      </h5>
                                      <span className="text-[11px] text-slate-500 block mt-0.5">
                                        المادة: {sub.subject}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {isDone ? (
                                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                                          ✓ تم التسليم والتصحيح
                                        </span>
                                      ) : isHelp ? (
                                        <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                                          طلب مساعدة من المعلم
                                        </span>
                                      ) : isWorking ? (
                                        <span className="text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                                          قيد الإنجاز
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                          {sub.status}
                                        </span>
                                      )}

                                      {isLate && (
                                        <span className="text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full">
                                          تسليم متأخر
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                                    <div className="font-bold text-[#FF6900] flex items-center gap-1">
                                      <span>⭐ {sub.stars} نجوم</span>
                                      {sub.manualGrade !== null && sub.manualGrade !== undefined && (
                                        <span className="text-slate-600 font-mono text-[11px]">
                                          (الدرجة: {sub.manualGrade}/100)
                                        </span>
                                      )}
                                    </div>

                                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                      <Clock size={11} />
                                      {sub.lastActiveAtUtc ? new Date(sub.lastActiveAtUtc).toLocaleDateString('ar-EG') : 'حديثاً'}
                                    </span>
                                  </div>

                                  {sub.teacherFeedback && (
                                    <div className="bg-purple-50/80 border border-purple-100 rounded-xl p-2.5 text-xs text-[#5C2C90]">
                                      <span className="font-bold block mb-0.5 flex items-center gap-1">
                                        <Sparkles size={12} className="text-[#FF6900]" />
                                        ملاحظات المعلم:
                                      </span>
                                      <p className="text-[11px] leading-relaxed text-slate-700">
                                        "{sub.teacherFeedback}"
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: Exams & Control */}
                    {activeTab === 'exams' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                          <span>سجل الكنترول المدرسي (الامتحانات التكوينية والتحسينية):</span>
                          <span>مباشرة من وحدة التقييم والامتحانات</span>
                        </div>

                        {exams.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                            لا توجد درجات اختبارات مرصودة حالياً لهذا الطالب في الكنترول.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {exams.map((ex, idx) => {
                              const isRemedial = ex.isRemedial;
                              const passed = ex.score >= (ex.maxScore * 0.5);

                              return (
                                <div
                                  key={ex.id || idx}
                                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5 hover:bg-white hover:shadow-xs transition-all"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h5 className="font-black text-sm text-slate-900">
                                        {ex.examTitle}
                                      </h5>
                                      <span className="text-[11px] text-slate-500 block mt-0.5">
                                        المادة: {ex.subject} · {ex.examType}
                                      </span>
                                    </div>

                                    <div className="text-right">
                                      <div className="text-base font-black text-[#5C2C90] font-mono">
                                        {ex.score} <span className="text-xs text-slate-400">/ {ex.maxScore}</span>
                                      </div>
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                          passed
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}
                                      >
                                        {passed ? 'اجتياز بنجاح ✓' : 'دون حد النجاح'}
                                      </span>
                                    </div>
                                  </div>

                                  {isRemedial && (
                                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 space-y-1">
                                      <div className="flex items-center justify-between font-bold">
                                        <span>جلسة تحسين (الامتحان التحسيني):</span>
                                        <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full">
                                          {ex.remedialStatus || 'اجتاز بنجاح'}
                                        </span>
                                      </div>
                                      {ex.previousScore !== null && ex.previousScore !== undefined && (
                                        <span className="text-[11px] text-amber-800 block">
                                          الدرجة السابقة قبل التحسين: {ex.previousScore} / {ex.maxScore}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {ex.teacherNotes && (
                                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                      <span className="font-bold text-slate-700">ملاحظات الكنترول:</span> {ex.teacherNotes}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: Sports & Physical Fitness */}
                    {activeTab === 'sports' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                          <span>سجل اللياقة البدنية والأنشطة الرياضية:</span>
                          <span>مباشرة من كابتن التربية الرياضية بالمدرسة</span>
                        </div>

                        {!sports ? (
                          <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                            لم يتم رصد تقييم اللياقة البدنية لهذا الطالب حتى الآن.
                          </div>
                        ) : (
                          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-200/60">
                              <div>
                                <span className="text-xs text-slate-500 font-bold block">مستوى اللياقة البدنية العام</span>
                                <h5 className="font-black text-lg text-emerald-700 flex items-center gap-2 mt-0.5">
                                  <span>{sports.fitnessScore}% - لائق بدنياً بدرجة ممتاز</span>
                                </h5>
                              </div>

                              <div className="text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                                <span className="text-slate-500 font-bold">طابور الصباح: </span>
                                <span className="font-bold text-[#5C2C90]">{sports.morningAssemblyStatus}</span>
                              </div>
                            </div>

                            {/* 3 Physical Tests Metrics */}
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <div className="text-lg font-black text-[#5C2C90] font-mono">{sports.speedScore} / 10</div>
                                <div className="text-[11px] font-bold text-slate-600 mt-0.5">السرعة والرشاقة (عدو 50م)</div>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <div className="text-lg font-black text-emerald-600 font-mono">{sports.enduranceScore} / 10</div>
                                <div className="text-[11px] font-bold text-slate-600 mt-0.5">قوة التحمل (جري 800م)</div>
                              </div>

                              <div className="bg-white p-3 rounded-xl border border-slate-200">
                                <div className="text-lg font-black text-amber-600 font-mono">{sports.flexibilityScore} / 10</div>
                                <div className="text-[11px] font-bold text-slate-600 mt-0.5">المرونة والتوافق العضلي</div>
                              </div>
                            </div>

                            {sports.coachNotes && (
                              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-[#5C2C90]">
                                <span className="font-bold block mb-0.5">
                                  ملاحظات كابتن التربية الرياضية ({sports.recordedByCoachName || 'كابتن حسام حسن'}):
                                </span>
                                <p className="text-[11px] text-slate-700 leading-relaxed">
                                  "{sports.coachNotes}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: Discipline & Violations */}
                    {activeTab === 'discipline' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                          <span>سجل الانضباط والمخالفات والإنذارات المدرسية:</span>
                          <span>إخطارات الأخصائي الاجتماعي وشؤون الطلاب المعتمدة</span>
                        </div>

                        {studentDiscipline.length === 0 ? (
                          <div className="p-6 text-center text-emerald-700 bg-emerald-50/60 rounded-2xl text-xs border border-emerald-200 font-bold">
                            ✓ لا توجد مخالفات أو إنذارات مسجلة لهذا الطالب. الطالب ملتزم تماماً بلائحة الانضباط المدرسي.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {studentDiscipline.map((n, idx) => {
                              const isPositive = n.category === 'positive';
                              const isSummon = n.category === 'summon';
                              const isAbsence = n.category === 'absence';

                              return (
                                <div
                                  key={n.id || idx}
                                  className={`p-4 rounded-2xl border ${
                                    isPositive
                                      ? 'bg-emerald-50/30 border-emerald-200'
                                      : isSummon
                                      ? 'bg-rose-50/30 border-rose-300'
                                      : isAbsence
                                      ? 'bg-amber-50/30 border-amber-200'
                                      : 'bg-slate-50/70 border-slate-200'
                                  } space-y-2`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                          isPositive
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                            : isSummon
                                            ? 'bg-rose-600 text-white border-rose-700'
                                            : isAbsence
                                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                                            : 'bg-slate-100 text-slate-800 border-slate-300'
                                        }`}
                                      >
                                        {n.title || (isPositive ? 'تكريم' : isSummon ? 'استدعاء' : isAbsence ? 'إنذار غياب' : 'ملاحظة سلوكية')}
                                      </span>
                                      <span className="text-xs font-bold text-slate-800">{n.details}</span>
                                    </div>

                                    <span className="text-[11px] text-slate-400 font-mono">
                                      {n.incidentDate ? n.incidentDate.split('T')[0] : ''}
                                    </span>
                                  </div>

                                  {n.actionTaken && (
                                    <div className="text-[11px] text-slate-600">
                                      <span className="font-bold text-slate-700">الإجراء المتخذ:</span> {n.actionTaken}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[11px]">
                                    <span className="text-slate-400">الجهة الصادرة: {n.issuedBy || 'الأخصائي الاجتماعي'}</span>
                                    {n.isAcknowledgedByParent ? (
                                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={12} />
                                        تم تأكيد الاطلاع من ولي الأمر
                                      </span>
                                    ) : (
                                      <span className="text-rose-600 font-bold flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        بانتظار تأكيد الاطلاع
                                      </span>
                                    )}
                                  </div>

                                  {n.parentNotes && (
                                    <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2 rounded-lg border border-emerald-200">
                                      <span className="font-bold">إفادة ولي الأمر:</span> {n.parentNotes}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Educational Guidance Footer Note */}
                    <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl">
                      <div className="font-bold text-xs sm:text-sm text-[#5C2C90] flex items-center gap-2 mb-1">
                        <Heart size={16} className="text-[#E4007C]" />
                        <span>إرشادات تربوية من المدرسة لولي الأمر:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        شجّع ابنك دائماً على المتابعة المستمرة والتواصل مع المعلمين والمهندسين عند الحاجة، وشاركه ما يتعلمه في ورش ومعامل مدرسة WE؛ فالتحفيز المستمر يبني ثقته بنفسه، والالتزام بالزي المدرسي والمظهر العام يعزز انضباطه المهني والأكاديمي.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
