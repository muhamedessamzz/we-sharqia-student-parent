import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Printer,
  Award,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Check
} from 'lucide-react';

export default function ExamsTab({ child, onSelectReportStudent }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'regular' | 'remedial'
  const [searchQuery, setSearchQuery] = useState('');

  const exams = child?.examScores || child?.ExamScores || [];

  const filteredExams = exams.filter((ex) => {
    const matchesSearch =
      (ex.examTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ex.subject || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'remedial') return ex.isRemedial;
    if (filterType === 'regular') return !ex.isRemedial;

    return true;
  });

  const totalExams = exams.length;
  const passedExams = exams.filter((e) => e.score >= (e.maxScore * 0.5)).length;
  const remedialCount = exams.filter((e) => e.isRemedial).length;

  const totalObtained = exams.reduce((sum, e) => sum + (e.score || 0), 0);
  const totalMax = exams.reduce((sum, e) => sum + (e.maxScore || 100), 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* 1. Header with Direct Print Action */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold shrink-0 border border-amber-200/60">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              الامتحانات والكنترول والتحسين
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              كشف درجات الشهور، العملي بالمعامل والنظري، ومتابعة امتحانات التحسين المعتمدة.
            </p>
          </div>
        </div>

        {/* Print Official Transcript Button */}
        <button
          onClick={() => onSelectReportStudent && onSelectReportStudent(child)}
          className="bg-gradient-to-r from-[#5C2C90] to-[#E4007C] hover:opacity-95 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-md shadow-purple-950/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <FileText size={15} />
          <span>طباعة كشف الدرجات الشامل المعتمد 🖨️</span>
        </button>
      </div>

      {/* 2. Executive Academic KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">المعدل العام التراكمي</span>
          <div className="text-2xl font-black text-[#5C2C90] font-mono mt-1">
            {overallPercentage}%
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            تقدير عام: ممتاز مع مرتبة الشرف
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">المواد المقررة والمختبرة</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {totalExams}
          </div>
          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
            اختبارات فصلية وشهرية
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">المواد المجتازة بنجاح</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {passedExams}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            نسبة النجاح: {totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 100}%
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">جلسات التحسين (Remedial)</span>
          <div className="text-2xl font-black text-amber-600 font-mono mt-1">
            {remedialCount}
          </div>
          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
            {remedialCount > 0 ? 'تم اجتياز كافة الجلسات' : 'لم يتطلب تحسيناً'}
          </span>
        </div>
      </div>

      {/* 3. Filters and Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="ابحث باسم الاختبار أو المادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3.5 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5C2C90]/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `جميع الاختبارات (${totalExams})` },
            { id: 'regular', label: 'الاختبارات الأساسية' },
            { id: 'remedial', label: `امتحانات التحسين (${remedialCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#5C2C90] text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200/90 shadow-xs space-y-2">
          <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
          <h4 className="font-bold text-slate-700 text-sm">لا توجد اختبارات مسجلة مطابقة</h4>
          <p className="text-xs text-slate-400">
            تأكد من الفلتر المختار أو ابحث باسم مادة أخرى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.map((ex, idx) => {
            const isRemedial = ex.isRemedial;
            const passed = ex.score >= (ex.maxScore * 0.5);
            const scorePercentage = Math.round((ex.score / ex.maxScore) * 100);

            return (
              <div
                key={ex.id || idx}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Exam Info & Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                        {ex.examTitle}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold text-[#5C2C90]">
                          {ex.subject}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {ex.examType}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-black text-[#5C2C90] font-mono">
                        {ex.score}
                        <span className="text-xs text-slate-400 font-bold"> / {ex.maxScore}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${
                          passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {passed ? 'اجتياز معتمد ✓' : 'دون حد النجاح'}
                      </span>
                    </div>
                  </div>

                  {/* Score Progress Bar */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>النسبة المئوية: {scorePercentage}%</span>
                      <span>الحد الأدنى للنجاح: 50%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          scorePercentage >= 85
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : scorePercentage >= 65
                            ? 'bg-gradient-to-r from-purple-600 to-[#5C2C90]'
                            : 'bg-gradient-to-r from-amber-500 to-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, scorePercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Remedial Info Box if Applicable */}
                  {isRemedial && (
                    <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span>جلسة تحسين الأداء (Remedial Session):</span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {ex.remedialStatus || 'اجتاز بنجاح'}
                        </span>
                      </div>
                      {ex.previousScore !== null && ex.previousScore !== undefined && (
                        <div className="text-[11px] text-amber-800 flex items-center justify-between">
                          <span>الدرجة السابقة قبل التحسين:</span>
                          <span className="font-mono font-bold text-rose-600">
                            {ex.previousScore} / {ex.maxScore}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] text-amber-700 leading-relaxed">
                        ✓ خضع الطالب لبرنامج تحسين تدريبي واجتاز التقييم بنجاح واعتمدت درجته بالكنترول.
                      </p>
                    </div>
                  )}

                  {/* Control / Teacher Notes */}
                  {ex.teacherNotes && (
                    <div className="mt-3 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">ملاحظات الكنترول: </span>
                      {ex.teacherNotes}
                    </div>
                  )}
                </div>

                {/* Footer Stamp */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>كنترول مدرسة WE للتكنولوجيا التطبيقية</span>
                  <span>معتمد رسمياً ✓</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
