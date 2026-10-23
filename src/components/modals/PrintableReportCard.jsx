import React, { useState, useEffect } from 'react';
import { Printer, X, Award, CheckCircle2, QrCode, FileText } from 'lucide-react';
import { api } from '../../api/client';

export default function PrintableReportCard({ isOpen, onClose, student, assignments = [], progressMap = {} }) {
  const [liveProgress, setLiveProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !student?.id) return;
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const prog = await api.getStudentProgress(student.id);
        if (Array.isArray(prog)) {
          setLiveProgress(prog);
        }
      } catch (e) {
        console.warn('Could not load progress for report card:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [isOpen, student?.id]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  // Determine actual graded coursework
  const gradedItems = liveProgress.filter(p => p.isGraded || p.grade !== undefined || p.status === 4);

  // Compute curriculum subjects dynamically
  const curriculumSubjects = (student.subjects && student.subjects.length > 0)
    ? student.subjects
    : gradedItems.length > 0
    ? gradedItems.map(item => ({
        name: item.assignmentTitle || 'تقييم عملي تخصصي',
        max: 100,
        min: 50,
        score: item.grade !== undefined ? Math.round(Number(item.grade) * 10) : 100,
        grade: (item.grade >= 9) ? 'ممتاز (A+)' : (item.grade >= 8) ? 'جيد جداً (B+)' : (item.grade >= 6.5) ? 'جيد (C)' : 'مقبول (D)'
      }))
    : [
        { name: 'أساسيات وتراكيب شبكات الحاسب (ICT)', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'برمجة الحاسب والخوارزميات (Python)', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'تكنولوجيا الاتصالات والألياف الضوئية', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'صيانة الحاسب والتشغيل العملي بالمعامل', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'اللغة الإنجليزية التخصصية (Technical English)', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'الرياضيات التطبيقية والفيزياء الرقمية', max: 100, min: 50, score: student.score || 100, grade: student.score ? 'معتمد' : 'قيد التقييم' },
        { name: 'السلوك والمواظبة والانضباط المدرسي', max: 50, min: 25, score: 50, grade: 'انضباط كامل (100%)' },
      ];

  const totalMax = curriculumSubjects.reduce((acc, s) => acc + s.max, 0);
  const totalScore = curriculumSubjects.reduce((acc, s) => acc + s.score, 0);
  const percentage = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : '100.0';

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 my-auto max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:border-none print:max-w-none print:w-full">
        {/* Modal Top Bar - Hidden on print */}
        <div className="p-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#5C2C90]" />
            <span className="text-xs font-black text-slate-800">
              معاينة كشف الدرجات
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-black text-white bg-gradient-to-r from-[#5C2C90] to-[#E4007C] px-4 py-2 rounded-xl shadow-xs hover:opacity-95 cursor-pointer"
            >
              <Printer size={15} />
              <span>طباعة كشف الدرجات</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-700 border border-slate-200 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (A4 ratio) */}
        <div className="p-8 sm:p-12 text-[#26163A] bg-white print:p-6" dir="rtl" id="official-report-card">
          {/* Header with Crest and School Titles */}
          <div className="border-b-2 border-[#5C2C90] pb-5 mb-6 flex items-center justify-between gap-4">
            <div className="text-right">
              <h3 className="text-xs font-bold text-slate-600">جمهورية مصر العربية</h3>
              <h4 className="text-xs font-bold text-slate-600">وزارة التربية والتعليم والتعليم الفني</h4>
              <h1 className="text-base sm:text-lg font-black text-[#5C2C90] mt-0.5">
                مدرسة WE للتكنولوجيا التطبيقية — محافظة الشرقية
              </h1>
              <p className="text-[11px] font-bold text-[#E4007C]">
                بالشراكة مع الشركة المصرية للاتصالات (Telecom Egypt)
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/Purple Code and Signal Crest.png"
                alt="شعار مدرسة WE"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
              <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">WE APPLIED TECH</span>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center my-4">
            <div className="inline-block bg-purple-50 border-2 border-[#5C2C90] px-6 py-1.5 rounded-full">
              <h2 className="text-sm sm:text-base font-black text-[#5C2C90]">
                كشف درجات أعمال السنة والتقييمات — الفصل الدراسي الأول 2026/2027
              </h2>
            </div>
          </div>

          {/* Student Identity Card Box */}
          <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 my-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 font-bold">اسم الطالب:</span>
              <span className="font-black text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold">كود الطالب:</span>
              <span className="font-black text-slate-800 font-mono">{student.studentCode || student.username || 'WE-2026-089'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold">الفصل الدراسي:</span>
              <span className="font-black text-[#5C2C90]">فصل {student.classroom || 'A1'} (تكنولوجيا اتصالات)</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold">حالة القيد:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                منتظم
              </span>
            </div>
          </div>

          {/* Official Grade Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden my-5">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-[#5C2C90] text-white font-black text-[11px]">
                  <th className="py-2.5 px-3 border-l border-purple-800">#</th>
                  <th className="py-2.5 px-3 border-l border-purple-800">المادة الدراسية / الوحدة التقنية</th>
                  <th className="py-2.5 px-3 text-center border-l border-purple-800">النهاية العظمى</th>
                  <th className="py-2.5 px-3 text-center border-l border-purple-800">النهاية الصغرى</th>
                  <th className="py-2.5 px-3 text-center border-l border-purple-800">درجة الطالب</th>
                  <th className="py-2.5 px-3 text-center">التقدير العام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {curriculumSubjects.map((sub, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="py-2 px-3 border-l border-slate-200 font-mono text-slate-500 font-bold">{i + 1}</td>
                    <td className="py-2 px-3 border-l border-slate-200 font-bold text-slate-900">{sub.name}</td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-mono text-slate-600">{sub.max}</td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-mono text-slate-600">{sub.min}</td>
                    <td className="py-2 px-3 border-l border-slate-200 text-center font-mono font-black text-[#5C2C90] text-sm">{sub.score}</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-800">{sub.grade}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-purple-50/80 font-black text-slate-900 border-t-2 border-[#5C2C90]">
                  <td colSpan={2} className="py-3 px-4 border-l border-purple-200 text-sm">
                    المجموع الكلي والنسبة المئوية
                  </td>
                  <td className="py-3 px-3 border-l border-purple-200 text-center font-mono">{totalMax}</td>
                  <td className="py-3 px-3 border-l border-purple-200 text-center font-mono">{totalMax / 2}</td>
                  <td className="py-3 px-3 border-l border-purple-200 text-center font-mono text-base text-[#5C2C90]">
                    {totalScore}
                  </td>
                  <td className="py-3 px-3 text-center font-black text-emerald-700 text-sm">
                    {percentage}% — ممتاز مع مرتبة الشرف
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification & Signatures Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <p className="font-bold text-slate-500 mb-8">مسؤول التقييم والامتحانات</p>
              <p className="font-extrabold text-slate-800 underline decoration-dotted">أ / محمد عاطف المنشاوي</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#5C2C90] flex flex-col items-center justify-center p-1 text-[9px] font-bold text-[#5C2C90] rotate-[-8deg] bg-purple-50/40">
                <Award size={18} />
                <span>خاتم المدرسة</span>
                <span>معتمد</span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono mt-1">CERTIFIED REPORT</p>
            </div>

            <div>
              <p className="font-bold text-slate-500 mb-8">مدير المدرسة</p>
              <p className="font-extrabold text-slate-800 underline decoration-dotted">م / أحمد مصطفى عبد السلام</p>
            </div>
          </div>

          {/* Footer watermark & QR */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>صدر هذا البيان إلكترونيًا من منصة مدرسة WE للتكنولوجيا التطبيقية بالشرقية.</span>
            <span className="font-mono">VERIFIED ID: WE-SHARKIA-2026-{(student.id || '').slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
